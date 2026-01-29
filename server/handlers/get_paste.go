package handlers

import (
	"net/http"
	"strconv"
	"time"

	"openpastebin/server/database"
	"openpastebin/server/models"

	"github.com/gin-gonic/gin"
)

type GetPasteHandler struct{}

type GetPasteResponse struct {
	ID        uint       `json:"id"`
	Content   string     `json:"content"`
	ExpiresAt *string    `json:"expires_at"` // ISO 8601 format or null
	CreatedAt string     `json:"created_at"` // ISO 8601 format
}

func NewGetPasteHandler() *GetPasteHandler {
	return &GetPasteHandler{}
}

func (h *GetPasteHandler) Method() string {
	return "GET"
}

func (h *GetPasteHandler) Path() string {
	return "/pastes/:id"
}

func (h *GetPasteHandler) Description() string {
	return "Retrieve a paste by its ID. Returns 404 if the paste does not exist or has expired."
}

func (h *GetPasteHandler) ExampleBody() interface{} {
	return nil
}

func (h *GetPasteHandler) ExampleResponse() interface{} {
	expiresAt := "2026-01-30T12:00:00Z"
	return GetPasteResponse{
		ID:        1,
		Content:   "Hello, World!",
		ExpiresAt: &expiresAt,
		CreatedAt: "2026-01-29T10:00:00Z",
	}
}

func (h *GetPasteHandler) Handle(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid paste ID"})
		return
	}

	var paste models.Paste
	if err := database.DB.First(&paste, uint(id)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Paste not found"})
		return
	}

	// Check if paste has expired
	if isExpired(paste.ExpiresAt) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Paste not found"})
		return
	}

	// Format response
	response := GetPasteResponse{
		ID:        paste.ID,
		Content:   paste.Content,
		CreatedAt: paste.CreatedAt.Format(time.RFC3339),
	}

	if paste.ExpiresAt != nil {
		expiresAtStr := paste.ExpiresAt.Format(time.RFC3339)
		response.ExpiresAt = &expiresAtStr
	}

	c.JSON(http.StatusOK, response)
}

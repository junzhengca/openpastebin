package handlers

import (
	"net/http"
	"time"

	"openpastebin/server/database"
	"openpastebin/server/models"

	"github.com/gin-gonic/gin"
)

type UpdatePasteHandler struct{}

type UpdatePasteRequest struct {
	Content     string `json:"content" binding:"required"`
	SecretToken string `json:"secret_token" binding:"required"`
}

type UpdatePasteResponse struct {
	ID        string `json:"id"`
	Content   string `json:"content"`
	ExpiresAt *string `json:"expires_at"` // ISO 8601 format or null
	UpdatedAt string `json:"updated_at"` // ISO 8601 format
}

func NewUpdatePasteHandler() *UpdatePasteHandler {
	return &UpdatePasteHandler{}
}

func (h *UpdatePasteHandler) Method() string {
	return "PUT"
}

func (h *UpdatePasteHandler) Path() string {
	return "/pastes/:id"
}

func (h *UpdatePasteHandler) Description() string {
	return "Update an existing paste. Requires the secret token that was returned when the paste was created."
}

func (h *UpdatePasteHandler) ExampleBody() interface{} {
	return UpdatePasteRequest{
		Content:     "Updated content",
		SecretToken: "abc123def456ghi789jkl012mno345pq",
	}
}

func (h *UpdatePasteHandler) ExampleResponse() interface{} {
	expiresAt := "2026-01-30T12:00:00Z"
	return UpdatePasteResponse{
		ID:        "aBcDeF",
		Content:   "Updated content",
		ExpiresAt: &expiresAt,
		UpdatedAt: "2026-01-29T11:00:00Z",
	}
}

func (h *UpdatePasteHandler) Handle(c *gin.Context) {
	idStr := c.Param("id")
	if len(idStr) != 6 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid paste ID"})
		return
	}

	var req UpdatePasteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body", "details": err.Error()})
		return
	}

	// Find paste
	var paste models.Paste
	if err := database.DB.Where("id = ?", idStr).First(&paste).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Paste not found"})
		return
	}

	// Check if paste has expired
	if isExpired(paste.ExpiresAt) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Paste not found"})
		return
	}

	// Verify secret token
	if paste.SecretToken != req.SecretToken {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid secret token"})
		return
	}

	// Update paste content
	paste.Content = req.Content
	if err := database.DB.Save(&paste).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update paste", "details": err.Error()})
		return
	}

	// Format response
	response := UpdatePasteResponse{
		ID:        paste.ID,
		Content:   paste.Content,
		UpdatedAt: paste.UpdatedAt.Format(time.RFC3339),
	}

	if paste.ExpiresAt != nil {
		expiresAtStr := paste.ExpiresAt.Format(time.RFC3339)
		response.ExpiresAt = &expiresAtStr
	}

	c.JSON(http.StatusOK, response)
}

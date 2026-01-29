package handlers

import (
	"net/http"

	"openpastebin/server/database"
	"openpastebin/server/models"

	"github.com/gin-gonic/gin"
)

type DeletePasteHandler struct{}

type DeletePasteRequest struct {
	SecretToken string `json:"secret_token" binding:"required"`
}

type DeletePasteResponse struct {
	Message string `json:"message"`
}

func NewDeletePasteHandler() *DeletePasteHandler {
	return &DeletePasteHandler{}
}

func (h *DeletePasteHandler) Method() string {
	return "DELETE"
}

func (h *DeletePasteHandler) Path() string {
	return "/pastes/:id"
}

func (h *DeletePasteHandler) Description() string {
	return "Delete a paste. Requires the secret token that was returned when the paste was created."
}

func (h *DeletePasteHandler) ExampleBody() interface{} {
	return DeletePasteRequest{
		SecretToken: "abc123def456ghi789jkl012mno345pq",
	}
}

func (h *DeletePasteHandler) ExampleResponse() interface{} {
	return DeletePasteResponse{
		Message: "Paste deleted successfully",
	}
}

func (h *DeletePasteHandler) Handle(c *gin.Context) {
	idStr := c.Param("id")
	if len(idStr) != 6 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid paste ID"})
		return
	}

	var req DeletePasteRequest
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

	// Verify secret token
	if paste.SecretToken != req.SecretToken {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid secret token"})
		return
	}

	// Delete paste
	if err := database.DB.Delete(&paste).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete paste", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, DeletePasteResponse{
		Message: "Paste deleted successfully",
	})
}

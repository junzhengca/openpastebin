package handlers

import (
	"net/http"
	"time"

	"openpastebin/server/database"
	"openpastebin/server/models"

	"github.com/gin-gonic/gin"
)

type CreatePasteHandler struct{}

type CreatePasteRequest struct {
	Content   string  `json:"content" binding:"required"`
	ExpiresAt *string `json:"expires_at"` // ISO 8601 format, optional
}

type CreatePasteResponse struct {
	ID          string     `json:"id"`
	Content     string     `json:"content"`
	SecretToken string     `json:"secret_token"`
	ExpiresAt   *time.Time `json:"expires_at"`
	CreatedAt   time.Time  `json:"created_at"`
}

func NewCreatePasteHandler() *CreatePasteHandler {
	return &CreatePasteHandler{}
}

func (h *CreatePasteHandler) Method() string {
	return "POST"
}

func (h *CreatePasteHandler) Path() string {
	return "/pastes"
}

func (h *CreatePasteHandler) Description() string {
	return "Create a new paste. Returns the paste with a secret token that can be used to update or delete it later."
}

func (h *CreatePasteHandler) ExampleBody() interface{} {
	return CreatePasteRequest{
		Content:   "Hello, World!",
		ExpiresAt: stringPtr("2026-01-30T12:00:00Z"),
	}
}

func (h *CreatePasteHandler) ExampleResponse() interface{} {
	expiresAt := time.Date(2026, 1, 30, 12, 0, 0, 0, time.UTC)
	return CreatePasteResponse{
		ID:          "aBcDeF",
		Content:     "Hello, World!",
		SecretToken: "abc123def456ghi789jkl012mno345pq",
		ExpiresAt:   &expiresAt,
		CreatedAt:   time.Date(2026, 1, 29, 10, 0, 0, 0, time.UTC),
	}
}

func (h *CreatePasteHandler) Handle(c *gin.Context) {
	var req CreatePasteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body", "details": err.Error()})
		return
	}

	// Generate paste ID
	pasteID, err := generatePasteID()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate paste ID"})
		return
	}

	// Generate secret token
	secretToken, err := generateSecretToken()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate secret token"})
		return
	}

	// Parse expiry time if provided
	var expiresAt *time.Time
	if req.ExpiresAt != nil && *req.ExpiresAt != "" {
		parsed, err := time.Parse(time.RFC3339, *req.ExpiresAt)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid expires_at format. Use ISO 8601 format (e.g., 2026-01-30T12:00:00Z)"})
			return
		}
		expiresAt = &parsed

		// Check if expiry is in the past
		if parsed.Before(time.Now()) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "expires_at cannot be in the past"})
			return
		}
	}

	// Create paste
	paste := models.Paste{
		ID:          pasteID,
		Content:     req.Content,
		SecretToken: secretToken,
		ExpiresAt:   expiresAt,
	}

	if err := database.DB.Create(&paste).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create paste", "details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, CreatePasteResponse{
		ID:          paste.ID,
		Content:     paste.Content,
		SecretToken: paste.SecretToken,
		ExpiresAt:   paste.ExpiresAt,
		CreatedAt:   paste.CreatedAt,
	})
}

func stringPtr(s string) *string {
	return &s
}

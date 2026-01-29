package handlers

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"time"

	"openpastebin/server/database"
	"openpastebin/server/models"

	"gorm.io/gorm"
)

// generateSecretToken generates a 32-character random alphanumeric string
func generateSecretToken() (string, error) {
	// Generate 24 random bytes (will be 32 chars when base64 encoded)
	bytes := make([]byte, 24)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	// Use URL-safe base64 encoding and remove padding
	token := base64.URLEncoding.EncodeToString(bytes)
	// Remove padding and ensure exactly 32 characters
	return token[:32], nil
}

// generatePasteID generates a random 6-character non-numeric string
// Uses only letters (a-z, A-Z) to ensure non-numeric IDs
func generatePasteID() (string, error) {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	const idLength = 6
	const maxRetries = 10

	for attempt := 0; attempt < maxRetries; attempt++ {
		bytes := make([]byte, idLength)
		if _, err := rand.Read(bytes); err != nil {
			return "", err
		}

		id := make([]byte, idLength)
		for i := range bytes {
			id[i] = charset[bytes[i]%byte(len(charset))]
		}

		pasteID := string(id)

		// Check for uniqueness
		var existingPaste models.Paste
		result := database.DB.Where("id = ?", pasteID).First(&existingPaste)
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			// If record not found, ID is unique
			return pasteID, nil
		}
		if result.Error != nil {
			// Some other error occurred
			return "", result.Error
		}
		// If found, retry with a new ID
	}

	return "", errors.New("failed to generate unique paste ID after max retries")
}

// isExpired checks if a paste has expired based on its ExpiresAt field
func isExpired(expiresAt *time.Time) bool {
	if expiresAt == nil {
		return false
	}
	return time.Now().After(*expiresAt)
}

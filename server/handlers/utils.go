package handlers

import (
	"crypto/rand"
	"encoding/base64"
	"time"
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

// isExpired checks if a paste has expired based on its ExpiresAt field
func isExpired(expiresAt *time.Time) bool {
	if expiresAt == nil {
		return false
	}
	return time.Now().After(*expiresAt)
}

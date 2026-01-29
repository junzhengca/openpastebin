package handlers

import (
	"testing"

	"openpastebin/server/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// setupTestDB creates an in-memory SQLite database for testing
func setupTestDB(t *testing.T) *gorm.DB {
	// Create an in-memory SQLite database for testing
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("Failed to connect to test database: %v", err)
	}

	// Auto-migrate models
	if err := db.AutoMigrate(&models.Paste{}); err != nil {
		t.Fatalf("Failed to migrate test database: %v", err)
	}

	return db
}

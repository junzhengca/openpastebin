package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"openpastebin/server/database"
	"openpastebin/server/models"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestUpdatePasteHandler_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)
	database.DB = db
	defer func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}()

	// Create a test paste
	secretToken := "testtoken1234567890123456789012"
	paste := models.Paste{
		Content:     "Original content",
		SecretToken: secretToken,
		ExpiresAt:   nil,
	}
	db.Create(&paste)

	handler := NewUpdatePasteHandler()
	router := gin.New()
	router.PUT(handler.Path(), handler.Handle)

	reqBody := UpdatePasteRequest{
		Content:     "Updated content",
		SecretToken: secretToken,
	}
	jsonBody, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest("PUT", "/pastes/1", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response UpdatePasteResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, uint(1), response.ID)
	assert.Equal(t, "Updated content", response.Content)
	assert.NotEmpty(t, response.UpdatedAt)

	// Verify the paste was actually updated in the database
	var updatedPaste models.Paste
	db.First(&updatedPaste, 1)
	assert.Equal(t, "Updated content", updatedPaste.Content)
}

func TestUpdatePasteHandler_InvalidToken(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)
	database.DB = db
	defer func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}()

	// Create a test paste
	paste := models.Paste{
		Content:     "Original content",
		SecretToken: "correcttoken1234567890123456789012",
		ExpiresAt:   nil,
	}
	db.Create(&paste)

	handler := NewUpdatePasteHandler()
	router := gin.New()
	router.PUT(handler.Path(), handler.Handle)

	reqBody := UpdatePasteRequest{
		Content:     "Updated content",
		SecretToken: "wrongtoken1234567890123456789012",
	}
	jsonBody, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest("PUT", "/pastes/1", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
	assert.Contains(t, w.Body.String(), "Invalid secret token")

	// Verify the paste was NOT updated
	var unchangedPaste models.Paste
	db.First(&unchangedPaste, 1)
	assert.Equal(t, "Original content", unchangedPaste.Content)
}

func TestUpdatePasteHandler_NotFound(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)
	database.DB = db
	defer func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}()

	handler := NewUpdatePasteHandler()
	router := gin.New()
	router.PUT(handler.Path(), handler.Handle)

	reqBody := UpdatePasteRequest{
		Content:     "Updated content",
		SecretToken: "sometoken1234567890123456789012",
	}
	jsonBody, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest("PUT", "/pastes/999", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.Contains(t, w.Body.String(), "Paste not found")
}

func TestUpdatePasteHandler_ExpiredPaste(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)
	database.DB = db
	defer func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}()

	// Create an expired paste
	secretToken := "testtoken1234567890123456789012"
	pastTime := time.Now().Add(-24 * time.Hour)
	paste := models.Paste{
		Content:     "Original content",
		SecretToken: secretToken,
		ExpiresAt:   &pastTime,
	}
	db.Create(&paste)

	handler := NewUpdatePasteHandler()
	router := gin.New()
	router.PUT(handler.Path(), handler.Handle)

	reqBody := UpdatePasteRequest{
		Content:     "Updated content",
		SecretToken: secretToken,
	}
	jsonBody, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest("PUT", "/pastes/1", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.Contains(t, w.Body.String(), "Paste not found")
}

func TestUpdatePasteHandler_InvalidID(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)
	database.DB = db
	defer func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}()

	handler := NewUpdatePasteHandler()
	router := gin.New()
	router.PUT(handler.Path(), handler.Handle)

	reqBody := UpdatePasteRequest{
		Content:     "Updated content",
		SecretToken: "sometoken1234567890123456789012",
	}
	jsonBody, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest("PUT", "/pastes/invalid", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "Invalid paste ID")
}

func TestUpdatePasteHandler_MissingFields(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)
	database.DB = db
	defer func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}()

	handler := NewUpdatePasteHandler()
	router := gin.New()
	router.PUT(handler.Path(), handler.Handle)

	reqBody := map[string]interface{}{}
	jsonBody, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest("PUT", "/pastes/1", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "error")
}

package handlers

import (
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

func TestGetPasteHandler_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)
	database.DB = db
	defer func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}()

	// Create a test paste
	paste := models.Paste{
		Content:     "Test content",
		SecretToken: "testtoken1234567890123456789012",
		ExpiresAt:   nil,
	}
	db.Create(&paste)

	handler := NewGetPasteHandler()
	router := gin.New()
	router.GET(handler.Path(), handler.Handle)

	req, _ := http.NewRequest("GET", "/pastes/1", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response GetPasteResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, uint(1), response.ID)
	assert.Equal(t, "Test content", response.Content)
	assert.Nil(t, response.ExpiresAt)
	assert.NotEmpty(t, response.CreatedAt)
}

func TestGetPasteHandler_WithExpiry(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)
	database.DB = db
	defer func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}()

	// Create a test paste with expiry
	futureTime := time.Now().Add(24 * time.Hour)
	paste := models.Paste{
		Content:     "Test content with expiry",
		SecretToken: "testtoken1234567890123456789012",
		ExpiresAt:   &futureTime,
	}
	db.Create(&paste)

	handler := NewGetPasteHandler()
	router := gin.New()
	router.GET(handler.Path(), handler.Handle)

	req, _ := http.NewRequest("GET", "/pastes/1", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response GetPasteResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.NotNil(t, response.ExpiresAt)
}

func TestGetPasteHandler_NotFound(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)
	database.DB = db
	defer func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}()

	handler := NewGetPasteHandler()
	router := gin.New()
	router.GET(handler.Path(), handler.Handle)

	req, _ := http.NewRequest("GET", "/pastes/999", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.Contains(t, w.Body.String(), "Paste not found")
}

func TestGetPasteHandler_ExpiredPaste(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)
	database.DB = db
	defer func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}()

	// Create an expired paste
	pastTime := time.Now().Add(-24 * time.Hour)
	paste := models.Paste{
		Content:     "Expired content",
		SecretToken: "testtoken1234567890123456789012",
		ExpiresAt:   &pastTime,
	}
	db.Create(&paste)

	handler := NewGetPasteHandler()
	router := gin.New()
	router.GET(handler.Path(), handler.Handle)

	req, _ := http.NewRequest("GET", "/pastes/1", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.Contains(t, w.Body.String(), "Paste not found")
}

func TestGetPasteHandler_InvalidID(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)
	database.DB = db
	defer func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}()

	handler := NewGetPasteHandler()
	router := gin.New()
	router.GET(handler.Path(), handler.Handle)

	req, _ := http.NewRequest("GET", "/pastes/invalid", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "Invalid paste ID")
}

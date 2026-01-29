package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"openpastebin/server/database"
	"openpastebin/server/models"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func TestDeletePasteHandler_Success(t *testing.T) {
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
		Content:     "Content to delete",
		SecretToken: secretToken,
		ExpiresAt:   nil,
	}
	db.Create(&paste)

	handler := NewDeletePasteHandler()
	router := gin.New()
	router.DELETE(handler.Path(), handler.Handle)

	reqBody := DeletePasteRequest{
		SecretToken: secretToken,
	}
	jsonBody, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest("DELETE", "/pastes/1", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response DeletePasteResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Contains(t, response.Message, "deleted successfully")

	// Verify the paste was actually deleted
	var deletedPaste models.Paste
	result := db.First(&deletedPaste, 1)
	assert.Error(t, result.Error)
	assert.Equal(t, gorm.ErrRecordNotFound, result.Error)
}

func TestDeletePasteHandler_InvalidToken(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)
	database.DB = db
	defer func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}()

	// Create a test paste
	paste := models.Paste{
		Content:     "Content to delete",
		SecretToken: "correcttoken1234567890123456789012",
		ExpiresAt:   nil,
	}
	db.Create(&paste)

	handler := NewDeletePasteHandler()
	router := gin.New()
	router.DELETE(handler.Path(), handler.Handle)

	reqBody := DeletePasteRequest{
		SecretToken: "wrongtoken1234567890123456789012",
	}
	jsonBody, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest("DELETE", "/pastes/1", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
	assert.Contains(t, w.Body.String(), "Invalid secret token")

	// Verify the paste was NOT deleted
	var unchangedPaste models.Paste
	result := db.First(&unchangedPaste, 1)
	assert.NoError(t, result.Error)
	assert.Equal(t, "Content to delete", unchangedPaste.Content)
}

func TestDeletePasteHandler_NotFound(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)
	database.DB = db
	defer func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}()

	handler := NewDeletePasteHandler()
	router := gin.New()
	router.DELETE(handler.Path(), handler.Handle)

	reqBody := DeletePasteRequest{
		SecretToken: "sometoken1234567890123456789012",
	}
	jsonBody, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest("DELETE", "/pastes/999", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.Contains(t, w.Body.String(), "Paste not found")
}

func TestDeletePasteHandler_InvalidID(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)
	database.DB = db
	defer func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}()

	handler := NewDeletePasteHandler()
	router := gin.New()
	router.DELETE(handler.Path(), handler.Handle)

	reqBody := DeletePasteRequest{
		SecretToken: "sometoken1234567890123456789012",
	}
	jsonBody, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest("DELETE", "/pastes/invalid", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "Invalid paste ID")
}

func TestDeletePasteHandler_MissingToken(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)
	database.DB = db
	defer func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}()

	handler := NewDeletePasteHandler()
	router := gin.New()
	router.DELETE(handler.Path(), handler.Handle)

	reqBody := map[string]interface{}{}
	jsonBody, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest("DELETE", "/pastes/1", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "error")
}

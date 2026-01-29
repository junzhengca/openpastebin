package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"openpastebin/server/database"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestCreatePasteHandler_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)
	database.DB = db
	defer func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}()

	handler := NewCreatePasteHandler()
	router := gin.New()
	router.POST(handler.Path(), handler.Handle)

	reqBody := CreatePasteRequest{
		Content: "Test paste content",
	}
	jsonBody, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest("POST", handler.Path(), bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)

	var response CreatePasteResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "Test paste content", response.Content)
	assert.NotEmpty(t, response.SecretToken)
	assert.Equal(t, 32, len(response.SecretToken))
	assert.NotZero(t, response.ID)
	assert.NotZero(t, response.CreatedAt)
}

func TestCreatePasteHandler_WithExpiry(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)
	database.DB = db
	defer func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}()

	handler := NewCreatePasteHandler()
	router := gin.New()
	router.POST(handler.Path(), handler.Handle)

	futureTime := time.Now().Add(24 * time.Hour).Format(time.RFC3339)
	reqBody := CreatePasteRequest{
		Content:   "Test paste with expiry",
		ExpiresAt: &futureTime,
	}
	jsonBody, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest("POST", handler.Path(), bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)

	var response CreatePasteResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.NotNil(t, response.ExpiresAt)
}

func TestCreatePasteHandler_MissingContent(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)
	database.DB = db
	defer func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}()

	handler := NewCreatePasteHandler()
	router := gin.New()
	router.POST(handler.Path(), handler.Handle)

	reqBody := map[string]interface{}{}
	jsonBody, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest("POST", handler.Path(), bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "error")
}

func TestCreatePasteHandler_InvalidExpiryFormat(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)
	database.DB = db
	defer func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}()

	handler := NewCreatePasteHandler()
	router := gin.New()
	router.POST(handler.Path(), handler.Handle)

	invalidExpiry := "not-a-valid-date"
	reqBody := CreatePasteRequest{
		Content:   "Test paste",
		ExpiresAt: &invalidExpiry,
	}
	jsonBody, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest("POST", handler.Path(), bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "Invalid expires_at format")
}

func TestCreatePasteHandler_ExpiryInPast(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)
	database.DB = db
	defer func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}()

	handler := NewCreatePasteHandler()
	router := gin.New()
	router.POST(handler.Path(), handler.Handle)

	pastTime := time.Now().Add(-24 * time.Hour).Format(time.RFC3339)
	reqBody := CreatePasteRequest{
		Content:   "Test paste",
		ExpiresAt: &pastTime,
	}
	jsonBody, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest("POST", handler.Path(), bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "expires_at cannot be in the past")
}

func TestCreatePasteHandler_InvalidJSON(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)
	database.DB = db
	defer func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}()

	handler := NewCreatePasteHandler()
	router := gin.New()
	router.POST(handler.Path(), handler.Handle)

	req, _ := http.NewRequest("POST", handler.Path(), bytes.NewBufferString("invalid json"))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "error")
}

package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestHelloWorld(t *testing.T) {
	// Set Gin to test mode
	gin.SetMode(gin.TestMode)

	// Create a Gin router
	router := gin.New()
	router.GET("/api/hello", HelloWorld)

	// Create a test request
	req, _ := http.NewRequest("GET", "/api/hello", nil)
	w := httptest.NewRecorder()

	// Perform the request
	router.ServeHTTP(w, req)

	// Assert the response
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "Hello, World!")
	assert.Contains(t, w.Body.String(), "message")
}

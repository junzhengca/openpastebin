package handlers

import "github.com/gin-gonic/gin"

// Handler defines the interface for API handlers that can be used for documentation generation
type Handler interface {
	// Method returns the HTTP method (GET, POST, PUT, DELETE, etc.)
	Method() string

	// Path returns the route path (e.g., "/api/pastes/:id")
	Path() string

	// Description returns a human-readable description of what this endpoint does
	Description() string

	// ExampleBody returns an example request body structure (nil if no body expected)
	ExampleBody() interface{}

	// ExampleResponse returns an example response structure
	ExampleResponse() interface{}

	// Handle processes the HTTP request
	Handle(c *gin.Context)
}

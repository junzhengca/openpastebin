package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"openpastebin/server/config"
	"openpastebin/server/database"
	"openpastebin/server/handlers"
	"openpastebin/server/models"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	if err := config.Load(); err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Set Gin mode
	gin.SetMode(config.AppConfig.GinMode)

	// Initialize database
	db, err := database.Init()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	log.Printf("Successfully connected to %s database", config.AppConfig.DatabaseType)

	// Create a simple test to verify database connection
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("Failed to get database instance: %v", err)
	}
	if err := sqlDB.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	// Auto-migrate models
	if err := database.DB.AutoMigrate(&models.Paste{}); err != nil {
		log.Fatalf("Failed to auto-migrate models: %v", err)
	}
	log.Println("Database models migrated successfully")

	// Setup router
	router := gin.Default()

	// Configure CORS middleware
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "accept", "origin", "Cache-Control", "X-Requested-With"}
	router.Use(cors.New(corsConfig))

	// Register routes
	api := router.Group("/api")
	{
		api.GET("/hello", handlers.HelloWorld)

		// Paste handlers
		createPasteHandler := handlers.NewCreatePasteHandler()
		getPasteHandler := handlers.NewGetPasteHandler()
		updatePasteHandler := handlers.NewUpdatePasteHandler()
		deletePasteHandler := handlers.NewDeletePasteHandler()

		api.POST(createPasteHandler.Path(), createPasteHandler.Handle)
		api.GET(getPasteHandler.Path(), getPasteHandler.Handle)
		api.PUT(updatePasteHandler.Path(), updatePasteHandler.Handle)
		api.DELETE(deletePasteHandler.Path(), deletePasteHandler.Handle)
	}

	// Create HTTP server
	srv := &http.Server{
		Addr:    ":" + config.AppConfig.Port,
		Handler: router,
	}

	// Start server in a goroutine
	go func() {
		log.Printf("Server starting on port %s", config.AppConfig.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	// Graceful shutdown with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exited")
}

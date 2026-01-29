package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port         string
	GinMode      string
	DatabaseType string
	// SQLite config
	DatabasePath string
	// PostgreSQL config
	DatabaseHost     string
	DatabasePort     string
	DatabaseUser     string
	DatabasePassword string
	DatabaseName     string
}

var AppConfig *Config

func Load() error {
	// Try to load .env file, but don't fail if it doesn't exist
	_ = godotenv.Load()

	AppConfig = &Config{
		Port:         getEnv("PORT", "8080"),
		GinMode:      getEnv("GIN_MODE", "debug"),
		DatabaseType: getEnv("DATABASE_TYPE", "sqlite"),
		// SQLite
		DatabasePath: getEnv("DATABASE_PATH", "./data.db"),
		// PostgreSQL
		DatabaseHost:     getEnv("DATABASE_HOST", "localhost"),
		DatabasePort:     getEnv("DATABASE_PORT", "5432"),
		DatabaseUser:     getEnv("DATABASE_USER", "postgres"),
		DatabasePassword: getEnv("DATABASE_PASSWORD", ""),
		DatabaseName:     getEnv("DATABASE_NAME", "openpastebin"),
	}

	// Validate PostgreSQL config if using postgres
	if AppConfig.DatabaseType == "postgres" {
		if AppConfig.DatabasePassword == "" {
			return fmt.Errorf("DATABASE_PASSWORD is required when using PostgreSQL")
		}
	}

	return nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

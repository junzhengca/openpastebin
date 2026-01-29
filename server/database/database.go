package database

import (
	"fmt"

	"openpastebin/server/config"

	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Init() (*gorm.DB, error) {
	var err error

	switch config.AppConfig.DatabaseType {
	case "sqlite":
		DB, err = gorm.Open(sqlite.Open(config.AppConfig.DatabasePath), &gorm.Config{})
		if err != nil {
			return nil, fmt.Errorf("failed to connect to SQLite database: %w", err)
		}
	case "postgres":
		dsn := fmt.Sprintf(
			"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
			config.AppConfig.DatabaseHost,
			config.AppConfig.DatabaseUser,
			config.AppConfig.DatabasePassword,
			config.AppConfig.DatabaseName,
			config.AppConfig.DatabasePort,
		)
		DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			return nil, fmt.Errorf("failed to connect to PostgreSQL database: %w", err)
		}
	default:
		return nil, fmt.Errorf("unsupported database type: %s (supported: sqlite, postgres)", config.AppConfig.DatabaseType)
	}

	return DB, nil
}

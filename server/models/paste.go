package models

import (
	"time"

	"gorm.io/gorm"
)

type Paste struct {
	ID          string         `json:"id" gorm:"primaryKey;type:varchar(6);not null;uniqueIndex"`
	Content     string         `json:"content" gorm:"type:text;not null"`
	SecretToken string         `json:"secret_token" gorm:"type:varchar(32);not null;uniqueIndex"`
	ExpiresAt   *time.Time     `json:"expires_at" gorm:"index"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

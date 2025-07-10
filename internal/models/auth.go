package models

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

// ValkeySession represents a user session stored in Valkey cache
type ValkeySession struct {
	ID           uuid.UUID `json:"id"`
	UserID       uuid.UUID `json:"user_id"`
	SessionToken string    `json:"session_token"`
	DeviceInfo   string    `json:"device_info"`
	IPAddress    string    `json:"ip_address"`
	UserAgent    string    `json:"user_agent"`
	ExpiresAt    time.Time `json:"expires_at"`
	CreatedAt    time.Time `json:"created_at"`
}

// APIToken represents a long-lived token for machine-to-machine authentication
type APIToken struct {
	ID         uuid.UUID        `json:"id" db:"id"`
	UserID     uuid.UUID        `json:"user_id" db:"user_id"`
	TokenName  string           `json:"token_name" db:"token_name"`
	TokenHash  string           `json:"token_hash" db:"token_hash"`
	Scopes     *json.RawMessage `json:"scopes" db:"scopes"`
	LastUsedAt *time.Time       `json:"last_used_at" db:"last_used_at"`
	ExpiresAt  *time.Time       `json:"expires_at" db:"expires_at"`
	RevokedAt  *time.Time       `json:"revoked_at" db:"revoked_at"`
	CreatedAt  time.Time        `json:"created_at" db:"created_at"`
	UpdatedAt  time.Time        `json:"updated_at" db:"updated_at"`
}

// AuthResponse represents the response from authentication endpoints
type AuthResponse struct {
	User    User   `json:"user"`
	Message string `json:"message"`
}

// LoginRequest represents login request payload
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

// RegisterRequest represents registration request payload
type RegisterRequest struct {
	FirstName string `json:"first_name" validate:"required,min=1,max=64"`
	LastName  string `json:"last_name" validate:"required,min=1,max=64"`
	Email     string `json:"email" validate:"required,email"`
	Password  string `json:"password" validate:"required,min=8"`
}

// CreateAPITokenRequest represents API token creation request
type CreateAPITokenRequest struct {
	TokenName string   `json:"token_name" validate:"required,min=1,max=255"`
	Scopes    []string `json:"scopes"`
	ExpiresAt *string  `json:"expires_at"` // ISO 8601 date string, optional
}

// CreateAPITokenResponse represents API token creation response
type CreateAPITokenResponse struct {
	Token     string     `json:"token"` // Only returned once
	TokenID   uuid.UUID  `json:"token_id"`
	TokenName string     `json:"token_name"`
	ExpiresAt *time.Time `json:"expires_at"`
}

// APITokenInfo represents API token information (without the actual token)
type APITokenInfo struct {
	ID         uuid.UUID        `json:"id"`
	TokenName  string           `json:"token_name"`
	Scopes     *json.RawMessage `json:"scopes"`
	LastUsedAt *time.Time       `json:"last_used_at"`
	ExpiresAt  *time.Time       `json:"expires_at"`
	CreatedAt  time.Time        `json:"created_at"`
}

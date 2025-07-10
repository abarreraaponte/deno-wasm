package auth

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"kitledger/internal/config"
	"kitledger/internal/database"
	"kitledger/internal/models"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/bcrypt"
)

type Service struct {
	db     *sqlx.DB
	cache  *database.Cache
	config config.AuthConfig
}

type Claims struct {
	UserID    string `json:"user_id"`
	SessionID string `json:"session_id,omitempty"` // Only for SPA sessions
	TokenID   string `json:"token_id,omitempty"`   // Only for API tokens
	Type      string `json:"type"`                 // "session" or "api_token"
	jwt.RegisteredClaims
}

func NewService(db *sqlx.DB, cache *database.Cache, config config.AuthConfig) *Service {
	return &Service{
		db:     db,
		cache:  cache,
		config: config,
	}
}

// HashPassword hashes a password using bcrypt
func (s *Service) HashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("failed to hash password: %w", err)
	}
	return string(hash), nil
}

// VerifyPassword verifies a password against its hash
func (s *Service) VerifyPassword(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// RegisterUser creates a new user account
func (s *Service) RegisterUser(ctx context.Context, req models.RegisterRequest) (*models.User, error) {
	// Check if user already exists
	var existingUser models.User
	err := s.db.GetContext(ctx, &existingUser, "SELECT id FROM users WHERE email = $1", strings.ToLower(req.Email))
	if err == nil {
		return nil, fmt.Errorf("user with email %s already exists", req.Email)
	}

	// Hash password
	passwordHash, err := s.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	// Create user
	user := models.User{
		ID:           uuid.New(),
		FirstName:    req.FirstName,
		LastName:     req.LastName,
		Email:        strings.ToLower(req.Email),
		PasswordHash: passwordHash,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	query := `
		INSERT INTO users (id, first_name, last_name, email, password_hash, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)`

	_, err = s.db.ExecContext(ctx, query, user.ID, user.FirstName, user.LastName, user.Email, user.PasswordHash, user.CreatedAt, user.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	// Don't return password hash
	user.PasswordHash = ""
	return &user, nil
}

// AuthenticateUser verifies user credentials
func (s *Service) AuthenticateUser(ctx context.Context, email, password string) (*models.User, error) {
	var user models.User
	err := s.db.GetContext(ctx, &user, "SELECT id, first_name, last_name, email, password_hash, created_at, updated_at FROM users WHERE email = $1", strings.ToLower(email))
	if err != nil {
		return nil, fmt.Errorf("invalid credentials")
	}

	if !s.VerifyPassword(password, user.PasswordHash) {
		return nil, fmt.Errorf("invalid credentials")
	}

	// Don't return password hash
	user.PasswordHash = ""
	return &user, nil
}

// CreateSession creates a new session stored entirely in Valkey
func (s *Service) CreateSession(ctx context.Context, userID uuid.UUID, deviceInfo, ipAddress, userAgent string) (*models.ValkeySession, string, error) {
	// Generate session token
	sessionToken, err := s.generateSecureToken(32)
	if err != nil {
		return nil, "", fmt.Errorf("failed to generate session token: %w", err)
	}

	// Create session object
	session := models.ValkeySession{
		ID:           uuid.New(),
		UserID:       userID,
		SessionToken: sessionToken,
		DeviceInfo:   deviceInfo,
		IPAddress:    ipAddress,
		UserAgent:    userAgent,
		ExpiresAt:    time.Now().Add(time.Duration(s.config.SessionTTLHours) * time.Hour),
		CreatedAt:    time.Now(),
	}

	// Store complete session in Valkey
	sessionJSON, err := json.Marshal(session)
	if err != nil {
		return nil, "", fmt.Errorf("failed to marshal session: %w", err)
	}

	cacheKey := fmt.Sprintf("session:%s", sessionToken)
	ttl := time.Until(session.ExpiresAt)
	if err := s.cache.Set(ctx, cacheKey, string(sessionJSON), ttl); err != nil {
		return nil, "", fmt.Errorf("failed to store session in cache: %w", err)
	}

	// Generate JWT
	jwtToken, err := s.generateJWT(userID.String(), session.ID.String(), "", "session", session.ExpiresAt)
	if err != nil {
		return nil, "", fmt.Errorf("failed to generate JWT: %w", err)
	}

	return &session, jwtToken, nil
}

// CreateAPIToken creates a new API token for machine-to-machine authentication
func (s *Service) CreateAPIToken(ctx context.Context, userID uuid.UUID, req models.CreateAPITokenRequest) (*models.CreateAPITokenResponse, error) {
	// Parse expiration if provided
	var expiresAt *time.Time
	if req.ExpiresAt != nil && *req.ExpiresAt != "" {
		parsed, err := time.Parse(time.RFC3339, *req.ExpiresAt)
		if err != nil {
			return nil, fmt.Errorf("invalid expires_at format, use ISO 8601")
		}
		expiresAt = &parsed
	}

	// Generate API token
	token, err := s.generateSecureToken(40)
	if err != nil {
		return nil, fmt.Errorf("failed to generate API token: %w", err)
	}

	// Hash the token for storage
	tokenHash := s.hashToken(token)

	// Serialize scopes
	scopesJSON, _ := json.Marshal(req.Scopes)

	// Create API token record
	apiToken := models.APIToken{
		ID:        uuid.New(),
		UserID:    userID,
		TokenName: req.TokenName,
		TokenHash: tokenHash,
		Scopes:    (*json.RawMessage)(&scopesJSON),
		ExpiresAt: expiresAt,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	query := `
		INSERT INTO api_tokens (id, user_id, token_name, token_hash, scopes, expires_at, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`

	_, err = s.db.ExecContext(ctx, query, apiToken.ID, apiToken.UserID, apiToken.TokenName, apiToken.TokenHash, apiToken.Scopes, apiToken.ExpiresAt, apiToken.CreatedAt, apiToken.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to create API token: %w", err)
	}

	return &models.CreateAPITokenResponse{
		Token:     token,
		TokenID:   apiToken.ID,
		TokenName: apiToken.TokenName,
		ExpiresAt: apiToken.ExpiresAt,
	}, nil
}

// ValidateSessionToken validates a session token and returns user info
func (s *Service) ValidateSessionToken(ctx context.Context, sessionToken string) (*models.User, error) {
	// Get session from Valkey cache
	cacheKey := fmt.Sprintf("session:%s", sessionToken)
	sessionData, err := s.cache.Get(ctx, cacheKey)
	if err != nil {
		return nil, fmt.Errorf("invalid or expired session")
	}

	// Unmarshal complete session data
	var session models.ValkeySession
	if err := json.Unmarshal([]byte(sessionData), &session); err != nil {
		return nil, fmt.Errorf("invalid session data")
	}

	// Check if session is expired (extra safety check)
	if time.Now().After(session.ExpiresAt) {
		// Clean up expired session
		_ = s.cache.Del(ctx, cacheKey)
		return nil, fmt.Errorf("session expired")
	}

	return s.getUserByID(ctx, session.UserID)
}

// ValidateAPIToken validates an API token and returns user info
func (s *Service) ValidateAPIToken(ctx context.Context, token string) (*models.User, *models.APIToken, error) {
	tokenHash := s.hashToken(token)

	var apiToken models.APIToken
	query := `
		SELECT id, user_id, token_name, scopes, last_used_at, expires_at, revoked_at, created_at, updated_at
		FROM api_tokens 
		WHERE token_hash = $1 AND revoked_at IS NULL AND (expires_at IS NULL OR expires_at > NOW())`

	err := s.db.GetContext(ctx, &apiToken, query, tokenHash)
	if err != nil {
		return nil, nil, fmt.Errorf("invalid or expired API token")
	}

	// Update last_used_at
	go func() {
		updateQuery := "UPDATE api_tokens SET last_used_at = NOW() WHERE id = $1"
		s.db.ExecContext(context.Background(), updateQuery, apiToken.ID)
	}()

	user, err := s.getUserByID(ctx, apiToken.UserID)
	if err != nil {
		return nil, nil, err
	}

	return user, &apiToken, nil
}

// DeleteSession removes a session (logout)
func (s *Service) DeleteSession(ctx context.Context, sessionToken string) error {
	// Remove from Valkey cache (sessions are only stored here now)
	cacheKey := fmt.Sprintf("session:%s", sessionToken)
	return s.cache.Del(ctx, cacheKey)
}

// RevokeAPIToken revokes an API token
func (s *Service) RevokeAPIToken(ctx context.Context, userID, tokenID uuid.UUID) error {
	query := "UPDATE api_tokens SET revoked_at = NOW() WHERE id = $1 AND user_id = $2"
	result, err := s.db.ExecContext(ctx, query, tokenID, userID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("API token not found")
	}

	return nil
}

// generateJWT generates a JWT token
func (s *Service) generateJWT(userID, sessionID, tokenID, tokenType string, expiresAt time.Time) (string, error) {
	claims := Claims{
		UserID:    userID,
		SessionID: sessionID,
		TokenID:   tokenID,
		Type:      tokenType,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "kitledger",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.config.JWTSecret))
}

// generateSecureToken generates a cryptographically secure random token
func (s *Service) generateSecureToken(length int) (string, error) {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

// hashToken creates a SHA256 hash of a token
func (s *Service) hashToken(token string) string {
	hash := sha256.Sum256([]byte(token))
	return hex.EncodeToString(hash[:])
}

// getUserByID retrieves a user by ID
func (s *Service) getUserByID(ctx context.Context, userID uuid.UUID) (*models.User, error) {
	var user models.User
	err := s.db.GetContext(ctx, &user, "SELECT id, first_name, last_name, email, created_at, updated_at FROM users WHERE id = $1", userID)
	if err != nil {
		return nil, fmt.Errorf("user not found")
	}
	return &user, nil
}

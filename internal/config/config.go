package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

type ServerConfig struct {
	Port int `json:"port"`
}

type DatabaseConfig struct {
	URL         string `json:"url"`
	PoolMaxSize int    `json:"pool_max_size"`
}

type ValkeyConfig struct {
	URL string `json:"url"`
}

type AuthConfig struct {
	JWTSecret          string   `json:"jwt_secret"`
	SessionTTLHours    int      `json:"session_ttl_hours"`
	CookieDomain       string   `json:"cookie_domain"`
	CookieSecure       bool     `json:"cookie_secure"`
	CookieSameSite     string   `json:"cookie_same_site"`
	AllowedOrigins     []string `json:"allowed_origins"`
	AuthProvider       string   `json:"auth_provider"` // "simple" or "oauth2"
	TokenRevocationTTL int      `json:"token_revocation_ttl_days"`
}

type AppConfig struct {
	Server   ServerConfig   `json:"server"`
	Database DatabaseConfig `json:"database"`
	Valkey   ValkeyConfig   `json:"valkey"`
	Auth     AuthConfig     `json:"auth"`
}

func Load() (*AppConfig, error) {
	// Load .env file if it exists
	_ = godotenv.Load()

	// Server Configuration
	portStr := os.Getenv("KL_SERVER_PORT")
	if portStr == "" {
		portStr = "8000" // Default: 8000
	}
	port, err := strconv.Atoi(portStr)
	if err != nil {
		return nil, fmt.Errorf("invalid KL_SERVER_PORT: %v", err)
	}

	// Database Configuration (REQUIRED)
	dbURL := os.Getenv("KL_DATABASE_URL")
	if dbURL == "" {
		return nil, fmt.Errorf("KL_DATABASE_URL not set")
	}

	poolMaxSizeStr := os.Getenv("KL_DATABASE_POOL_MAX_SIZE")
	poolMaxSize := 10 // Default: 10
	if poolMaxSizeStr != "" {
		if parsed, err := strconv.Atoi(poolMaxSizeStr); err == nil {
			poolMaxSize = parsed
		}
	}

	// Valkey Configuration
	valkeyURL := os.Getenv("KL_VALKEY_URL")
	if valkeyURL == "" {
		valkeyURL = "valkey://localhost:6379/0" // Default: localhost:6379/0
	}

	// Authentication Configuration
	jwtSecret := os.Getenv("KL_JWT_SECRET") // REQUIRED
	if jwtSecret == "" {
		return nil, fmt.Errorf("KL_JWT_SECRET not set")
	}

	sessionTTLStr := os.Getenv("KL_SESSION_TTL_HOURS")
	sessionTTL := 24 * 7 // Default: 7 days (168 hours)
	if sessionTTLStr != "" {
		if parsed, err := strconv.Atoi(sessionTTLStr); err == nil {
			sessionTTL = parsed
		}
	}

	cookieDomain := os.Getenv("KL_COOKIE_DOMAIN") // Default: empty (browser uses current domain)

	cookieSecureStr := os.Getenv("KL_COOKIE_SECURE")
	cookieSecure := false // Default: false (set true in production with HTTPS)
	if cookieSecureStr == "true" {
		cookieSecure = true
	}

	cookieSameSite := os.Getenv("KL_COOKIE_SAME_SITE")
	if cookieSameSite == "" {
		cookieSameSite = "lax" // Default: lax
	}

	allowedOriginsStr := os.Getenv("KL_ALLOWED_ORIGINS")
	allowedOrigins := []string{"http://localhost:3000"} // Default: localhost:3000 for dev
	if allowedOriginsStr != "" {
		allowedOrigins = strings.Split(allowedOriginsStr, ",")
		for i, origin := range allowedOrigins {
			allowedOrigins[i] = strings.TrimSpace(origin)
		}
	}

	authProvider := os.Getenv("KL_AUTH_PROVIDER")
	if authProvider == "" {
		authProvider = "simple" // Default: simple (vs oauth2)
	}

	tokenRevocationTTLStr := os.Getenv("KL_TOKEN_REVOCATION_TTL_DAYS")
	tokenRevocationTTL := 30 // Default: 30 days
	if tokenRevocationTTLStr != "" {
		if parsed, err := strconv.Atoi(tokenRevocationTTLStr); err == nil {
			tokenRevocationTTL = parsed
		}
	}

	return &AppConfig{
		Server: ServerConfig{
			Port: port,
		},
		Database: DatabaseConfig{
			URL:         dbURL,
			PoolMaxSize: poolMaxSize,
		},
		Valkey: ValkeyConfig{
			URL: valkeyURL,
		},
		Auth: AuthConfig{
			JWTSecret:          jwtSecret,
			SessionTTLHours:    sessionTTL,
			CookieDomain:       cookieDomain,
			CookieSecure:       cookieSecure,
			CookieSameSite:     cookieSameSite,
			AllowedOrigins:     allowedOrigins,
			AuthProvider:       authProvider,
			TokenRevocationTTL: tokenRevocationTTL,
		},
	}, nil
}

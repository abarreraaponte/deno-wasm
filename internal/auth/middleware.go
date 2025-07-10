package auth

import (
	"net/http"
	"strings"

	"kitledger/internal/models"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

// Middleware creates an authentication middleware
func (s *Service) Middleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// Skip authentication for certain routes
			if s.shouldSkipAuth(c.Path()) {
				return next(c)
			}

			// Check for session-based auth (cookie)
			sessionCookie, err := c.Cookie("session_token")
			if err == nil && sessionCookie.Value != "" {
				user, authErr := s.ValidateSessionToken(c.Request().Context(), sessionCookie.Value)
				if authErr == nil {
					c.Set("user", user)
					c.Set("auth_type", "session")
					return next(c)
				}
			}

			// Check for API token auth (Bearer token)
			authHeader := c.Request().Header.Get("Authorization")
			if authHeader != "" {
				// Check if it's a Bearer token
				if strings.HasPrefix(authHeader, "Bearer ") {
					token := strings.TrimPrefix(authHeader, "Bearer ")

					// Try API token first
					user, apiToken, authErr := s.ValidateAPIToken(c.Request().Context(), token)
					if authErr == nil {
						c.Set("user", user)
						c.Set("api_token", apiToken)
						c.Set("auth_type", "api_token")
						return next(c)
					}

					// Try JWT token
					claims, authErr := s.ValidateJWT(token)
					if authErr == nil {
						userID, err := uuid.Parse(claims.UserID)
						if err != nil {
							return echo.NewHTTPError(http.StatusUnauthorized, "Invalid user ID in token")
						}

						user, err := s.getUserByID(c.Request().Context(), userID)
						if err != nil {
							return echo.NewHTTPError(http.StatusUnauthorized, "User not found")
						}

						c.Set("user", user)
						c.Set("jwt_claims", claims)
						c.Set("auth_type", "jwt")
						return next(c)
					}
				}
			}

			return echo.NewHTTPError(http.StatusUnauthorized, "Authentication required")
		}
	}
}

// OptionalMiddleware creates an optional authentication middleware
func (s *Service) OptionalMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// Try to authenticate but don't fail if authentication fails

			// Check for session-based auth (cookie)
			sessionCookie, err := c.Cookie("session_token")
			if err == nil && sessionCookie.Value != "" {
				user, authErr := s.ValidateSessionToken(c.Request().Context(), sessionCookie.Value)
				if authErr == nil {
					c.Set("user", user)
					c.Set("auth_type", "session")
					return next(c)
				}
			}

			// Check for API token auth (Bearer token)
			authHeader := c.Request().Header.Get("Authorization")
			if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
				token := strings.TrimPrefix(authHeader, "Bearer ")

				// Try API token first
				user, apiToken, authErr := s.ValidateAPIToken(c.Request().Context(), token)
				if authErr == nil {
					c.Set("user", user)
					c.Set("api_token", apiToken)
					c.Set("auth_type", "api_token")
					return next(c)
				}

				// Try JWT token
				claims, authErr := s.ValidateJWT(token)
				if authErr == nil {
					userID, err := uuid.Parse(claims.UserID)
					if err == nil {
						user, err := s.getUserByID(c.Request().Context(), userID)
						if err == nil {
							c.Set("user", user)
							c.Set("jwt_claims", claims)
							c.Set("auth_type", "jwt")
							return next(c)
						}
					}
				}
			}

			// Continue without authentication
			return next(c)
		}
	}
}

// ValidateJWT validates and parses a JWT token
func (s *Service) ValidateJWT(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		// Verify signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, echo.NewHTTPError(http.StatusUnauthorized, "Invalid signing method")
		}
		return []byte(s.config.JWTSecret), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, echo.NewHTTPError(http.StatusUnauthorized, "Invalid token")
}

// shouldSkipAuth determines if authentication should be skipped for a given path
func (s *Service) shouldSkipAuth(path string) bool {
	skipPaths := []string{
		"/api/health",
		"/api/auth/login",
		"/api/auth/register",
		"/api/test-json",
	}

	for _, skipPath := range skipPaths {
		if path == skipPath {
			return true
		}
	}

	return false
}

// GetCurrentUser extracts the current user from the echo context
func GetCurrentUser(c echo.Context) (*models.User, bool) {
	user, ok := c.Get("user").(*models.User)
	return user, ok
}

// GetCurrentAPIToken extracts the current API token from the echo context
func GetCurrentAPIToken(c echo.Context) (*models.APIToken, bool) {
	token, ok := c.Get("api_token").(*models.APIToken)
	return token, ok
}

// GetAuthType extracts the authentication type from the echo context
func GetAuthType(c echo.Context) string {
	authType, ok := c.Get("auth_type").(string)
	if !ok {
		return ""
	}
	return authType
}

// RequireAuthType middleware ensures a specific authentication type
func RequireAuthType(authType string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			currentAuthType := GetAuthType(c)
			if currentAuthType != authType {
				return echo.NewHTTPError(http.StatusForbidden, "Invalid authentication method for this endpoint")
			}
			return next(c)
		}
	}
}

package auth

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"kitledger/internal/models"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type Handlers struct {
	service *Service
}

func NewHandlers(service *Service) *Handlers {
	return &Handlers{
		service: service,
	}
}

// Register handles user registration
func (h *Handlers) Register(c echo.Context) error {
	var req models.RegisterRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request payload")
	}

	// Basic validation
	if req.Email == "" || req.Password == "" || req.FirstName == "" || req.LastName == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "All fields are required")
	}

	if len(req.Password) < 8 {
		return echo.NewHTTPError(http.StatusBadRequest, "Password must be at least 8 characters")
	}

	user, err := h.service.RegisterUser(c.Request().Context(), req)
	if err != nil {
		if strings.Contains(err.Error(), "already exists") {
			return echo.NewHTTPError(http.StatusConflict, err.Error())
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create user")
	}

	return c.JSON(http.StatusCreated, models.AuthResponse{
		User:    *user,
		Message: "User registered successfully",
	})
}

// Login handles user authentication
func (h *Handlers) Login(c echo.Context) error {
	var req models.LoginRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request payload")
	}

	if req.Email == "" || req.Password == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "Email and password are required")
	}

	user, err := h.service.AuthenticateUser(c.Request().Context(), req.Email, req.Password)
	if err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, "Invalid credentials")
	}

	// Create session for SPA
	deviceInfo := c.Request().Header.Get("User-Agent")
	ipAddress := c.RealIP()
	userAgent := c.Request().Header.Get("User-Agent")

	session, jwtToken, err := h.service.CreateSession(c.Request().Context(), user.ID, deviceInfo, ipAddress, userAgent)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create session")
	}

	// Set session cookie
	cookie := &http.Cookie{
		Name:     "session_token",
		Value:    session.SessionToken,
		Path:     "/",
		Domain:   h.service.config.CookieDomain,
		Expires:  session.ExpiresAt,
		Secure:   h.service.config.CookieSecure,
		HttpOnly: true,
	}

	// Set SameSite attribute
	switch strings.ToLower(h.service.config.CookieSameSite) {
	case "strict":
		cookie.SameSite = http.SameSiteStrictMode
	case "none":
		cookie.SameSite = http.SameSiteNoneMode
	default:
		cookie.SameSite = http.SameSiteLaxMode
	}

	c.SetCookie(cookie)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"user":    user,
		"token":   jwtToken, // For applications that prefer JWT over cookies
		"message": "Login successful",
	})
}

// Logout handles user logout
func (h *Handlers) Logout(c echo.Context) error {
	// Get session token from cookie
	sessionCookie, err := c.Cookie("session_token")
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "No active session")
	}

	err = h.service.DeleteSession(c.Request().Context(), sessionCookie.Value)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to logout")
	}

	// Clear session cookie
	cookie := &http.Cookie{
		Name:     "session_token",
		Value:    "",
		Path:     "/",
		Domain:   h.service.config.CookieDomain,
		Expires:  time.Unix(0, 0),
		Secure:   h.service.config.CookieSecure,
		HttpOnly: true,
	}

	c.SetCookie(cookie)

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Logout successful",
	})
}

// Me returns current user information
func (h *Handlers) Me(c echo.Context) error {
	user, ok := GetCurrentUser(c)
	if !ok {
		return echo.NewHTTPError(http.StatusUnauthorized, "Authentication required")
	}

	authType := GetAuthType(c)

	response := map[string]interface{}{
		"user":      user,
		"auth_type": authType,
	}

	// Include API token info if authenticated via API token
	if authType == "api_token" {
		if apiToken, ok := GetCurrentAPIToken(c); ok {
			response["api_token"] = models.APITokenInfo{
				ID:         apiToken.ID,
				TokenName:  apiToken.TokenName,
				Scopes:     apiToken.Scopes,
				LastUsedAt: apiToken.LastUsedAt,
				ExpiresAt:  apiToken.ExpiresAt,
				CreatedAt:  apiToken.CreatedAt,
			}
		}
	}

	return c.JSON(http.StatusOK, response)
}

// CreateAPIToken handles API token creation
func (h *Handlers) CreateAPIToken(c echo.Context) error {
	user, ok := GetCurrentUser(c)
	if !ok {
		return echo.NewHTTPError(http.StatusUnauthorized, "Authentication required")
	}

	var req models.CreateAPITokenRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request payload")
	}

	if req.TokenName == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "Token name is required")
	}

	response, err := h.service.CreateAPIToken(c.Request().Context(), user.ID, req)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create API token")
	}

	return c.JSON(http.StatusCreated, response)
}

// ListAPITokens returns user's API tokens (without the actual tokens)
func (h *Handlers) ListAPITokens(c echo.Context) error {
	user, ok := GetCurrentUser(c)
	if !ok {
		return echo.NewHTTPError(http.StatusUnauthorized, "Authentication required")
	}

	query := `
		SELECT id, token_name, scopes, last_used_at, expires_at, created_at
		FROM api_tokens 
		WHERE user_id = $1 AND revoked_at IS NULL
		ORDER BY created_at DESC`

	rows, err := h.service.db.QueryContext(c.Request().Context(), query, user.ID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to fetch API tokens")
	}
	defer rows.Close()

	var tokens []models.APITokenInfo
	for rows.Next() {
		var token models.APITokenInfo
		var scopesJSON []byte

		err := rows.Scan(
			&token.ID,
			&token.TokenName,
			&scopesJSON,
			&token.LastUsedAt,
			&token.ExpiresAt,
			&token.CreatedAt,
		)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to scan API token")
		}

		// Convert scopes JSON to RawMessage
		if scopesJSON != nil {
			rawMsg := json.RawMessage(scopesJSON)
			token.Scopes = &rawMsg
		}

		tokens = append(tokens, token)
	}

	if err = rows.Err(); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Error reading API tokens")
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"tokens": tokens,
	})
}

// RevokeAPIToken revokes an API token
func (h *Handlers) RevokeAPIToken(c echo.Context) error {
	user, ok := GetCurrentUser(c)
	if !ok {
		return echo.NewHTTPError(http.StatusUnauthorized, "Authentication required")
	}

	tokenIDStr := c.Param("tokenId")
	tokenID, err := uuid.Parse(tokenIDStr)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid token ID")
	}

	err = h.service.RevokeAPIToken(c.Request().Context(), user.ID, tokenID)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			return echo.NewHTTPError(http.StatusNotFound, "API token not found")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to revoke API token")
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "API token revoked successfully",
	})
}

// RefreshSession extends the current session
func (h *Handlers) RefreshSession(c echo.Context) error {
	user, ok := GetCurrentUser(c)
	if !ok {
		return echo.NewHTTPError(http.StatusUnauthorized, "Authentication required")
	}

	authType := GetAuthType(c)
	if authType != "session" {
		return echo.NewHTTPError(http.StatusBadRequest, "Session refresh only available for session-based authentication")
	}

	// Get current session token
	sessionCookie, err := c.Cookie("session_token")
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "No active session")
	}

	// Delete old session
	_ = h.service.DeleteSession(c.Request().Context(), sessionCookie.Value)

	// Create new session
	deviceInfo := c.Request().Header.Get("User-Agent")
	ipAddress := c.RealIP()
	userAgent := c.Request().Header.Get("User-Agent")

	session, jwtToken, err := h.service.CreateSession(c.Request().Context(), user.ID, deviceInfo, ipAddress, userAgent)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to refresh session")
	}

	// Set new session cookie
	cookie := &http.Cookie{
		Name:     "session_token",
		Value:    session.SessionToken,
		Path:     "/",
		Domain:   h.service.config.CookieDomain,
		Expires:  session.ExpiresAt,
		Secure:   h.service.config.CookieSecure,
		HttpOnly: true,
	}

	switch strings.ToLower(h.service.config.CookieSameSite) {
	case "strict":
		cookie.SameSite = http.SameSiteStrictMode
	case "none":
		cookie.SameSite = http.SameSiteNoneMode
	default:
		cookie.SameSite = http.SameSiteLaxMode
	}

	c.SetCookie(cookie)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"user":    user,
		"token":   jwtToken,
		"message": "Session refreshed successfully",
	})
}

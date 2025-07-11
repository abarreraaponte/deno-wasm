package router

import (
	"net/http"

	"kitledger/internal/auth"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
)

func SetupAPIRoutes(g *echo.Group, db *sqlx.DB, authService *auth.Service) {
	// Public routes
	g.GET("/health", healthCheck)
	g.GET("/test-json", testJSONHandler)

	// Auth routes
	authHandlers := auth.NewHandlers(authService)
	authGroup := g.Group("/auth")
	authGroup.POST("/register", authHandlers.Register)
	authGroup.POST("/login", authHandlers.Login)
	authGroup.POST("/logout", authHandlers.Logout)

	// Protected routes that require authentication
	protected := g.Group("")
	protected.Use(authService.Middleware())

	// User routes
	protected.GET("/auth/me", authHandlers.Me)
	protected.POST("/auth/refresh", authHandlers.RefreshSession)

	// API token management (only for session-based auth)
	apiTokenGroup := protected.Group("/auth/tokens")
	apiTokenGroup.POST("", authHandlers.CreateAPIToken)
	apiTokenGroup.GET("", authHandlers.ListAPITokens)
	apiTokenGroup.DELETE("/:tokenId", authHandlers.RevokeAPIToken)
}

func healthCheck(c echo.Context) error {
	return c.String(http.StatusOK, "OK")
}

func testJSONHandler(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]interface{}{
		"count":  88,
		"status": "ok",
	})
}

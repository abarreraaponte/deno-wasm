package router

import (
	"io/fs"
	"net/http"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
)

// EmbeddedFS will be set by the main package after building the web assets
var EmbeddedFS fs.FS

func SetupAPIRoutes(g *echo.Group, db *sqlx.DB) {
	g.GET("/health", healthCheck)
	g.GET("/test-json", testJSONHandler)
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

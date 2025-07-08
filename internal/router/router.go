package router

import (
	"io/fs"
	"net/http"
	"path"
	"strings"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
)

// EmbeddedFS will be set by the main package after building the web assets
var EmbeddedFS fs.FS

func SetupAPIRoutes(g *echo.Group, db *sqlx.DB) {
	g.GET("/health", healthCheck)
	g.GET("/test-json", testJSONHandler)
}

func SetupWebRoutes(g *echo.Group, db *sqlx.DB) {
	g.GET("/", serveIndex)
	g.GET("/*", serveStaticAsset)
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

func serveIndex(c echo.Context) error {
	return serveStaticAsset(c)
}

func serveStaticAsset(c echo.Context) error {
	requestPath := c.Request().URL.Path

	// Remove the /web/ prefix
	requestPath = strings.TrimPrefix(requestPath, "/web/")
	if requestPath == "" {
		requestPath = "index.html"
	}

	// Try to get the file from embedded assets
	filePath := requestPath
	file, err := EmbeddedFS.Open(filePath)
	if err != nil {
		// If file not found, serve index.html for SPA routing
		filePath = "index.html"
		file, err = EmbeddedFS.Open(filePath)
		if err != nil {
			return c.String(http.StatusNotFound, "404 Not Found")
		}
	}
	defer file.Close()

	// Get file info to read content
	stat, err := file.Stat()
	if err != nil {
		return c.String(http.StatusInternalServerError, "Failed to get file info")
	}

	// Read file content
	content := make([]byte, stat.Size())
	_, err = file.Read(content)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Failed to read file")
	}

	// Determine content type
	ext := path.Ext(requestPath)
	var contentType string
	switch ext {
	case ".html":
		contentType = "text/html"
	case ".css":
		contentType = "text/css"
	case ".js":
		contentType = "application/javascript"
	case ".json":
		contentType = "application/json"
	case ".png":
		contentType = "image/png"
	case ".jpg", ".jpeg":
		contentType = "image/jpeg"
	case ".svg":
		contentType = "image/svg+xml"
	case ".ico":
		contentType = "image/x-icon"
	default:
		contentType = "application/octet-stream"
	}

	c.Response().Header().Set("Content-Type", contentType)
	return c.Blob(http.StatusOK, contentType, content)
}

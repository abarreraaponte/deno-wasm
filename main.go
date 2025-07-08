package main

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"
	"os"

	"kitledger/internal/config"
	"kitledger/internal/database"
	"kitledger/internal/router"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/sirupsen/logrus"
)

//go:embed web/public/*
var webAssets embed.FS

func main() {
	// Initialize logger
	logrus.SetFormatter(&logrus.JSONFormatter{})
	logrus.SetLevel(logrus.InfoLevel)

	// Set up embedded FS for router
	webFS, err := fs.Sub(webAssets, "web/public")
	if err != nil {
		logrus.Fatalf("Failed to create web filesystem: %v", err)
	}
	router.EmbeddedFS = webFS

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		logrus.Fatalf("Failed to load configuration: %v", err)
	}

	// Initialize database
	db, err := database.Init(cfg.Database)
	if err != nil {
		logrus.Fatalf("Failed to initialize database: %v", err)
	}
	defer db.Close()

	// Create Echo instance
	e := echo.New()
	e.HideBanner = true

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// Routes
	e.GET("/", func(c echo.Context) error {
		return c.Redirect(http.StatusMovedPermanently, "/web/")
	})
	e.GET("/web", func(c echo.Context) error {
		return c.Redirect(http.StatusMovedPermanently, "/web/")
	})

	// Setup routes
	router.SetupAPIRoutes(e.Group("/api"), db)
	router.SetupWebRoutes(e.Group("/web"), db)

	// Start server
	addr := fmt.Sprintf(":%d", cfg.Server.Port)
	logrus.Infof("Listening on http://0.0.0.0%s", addr)

	if err := e.Start(addr); err != nil && err != http.ErrServerClosed {
		logrus.Fatalf("Server failed to start: %v", err)
		os.Exit(1)
	}
}

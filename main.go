package main

import (
	"fmt"
	"net/http"
	"os"

	"kitledger/internal/config"
	"kitledger/internal/database"
	"kitledger/internal/router"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/sirupsen/logrus"
)

func main() {
	// Initialize logger
	logrus.SetFormatter(&logrus.JSONFormatter{})
	logrus.SetLevel(logrus.InfoLevel)

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

	// Setup routes
	router.SetupAPIRoutes(e.Group("/api"), db)

	// Start server
	addr := fmt.Sprintf(":%d", cfg.Server.Port)
	logrus.Infof("Listening on http://0.0.0.0%s", addr)

	if err := e.Start(addr); err != nil && err != http.ErrServerClosed {
		logrus.Fatalf("Server failed to start: %v", err)
		os.Exit(1)
	}
}

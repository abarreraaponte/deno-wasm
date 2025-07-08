package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type ServerConfig struct {
	Port int `json:"port"`
}

type DatabaseConfig struct {
	URL         string `json:"url"`
	PoolMaxSize int    `json:"pool_max_size"`
}

type AppConfig struct {
	Server   ServerConfig   `json:"server"`
	Database DatabaseConfig `json:"database"`
}

func Load() (*AppConfig, error) {
	// Load .env file if it exists
	_ = godotenv.Load()

	// Parse server port
	portStr := os.Getenv("KL_SERVER_PORT")
	if portStr == "" {
		portStr = "8000"
	}
	port, err := strconv.Atoi(portStr)
	if err != nil {
		return nil, fmt.Errorf("invalid KL_SERVER_PORT: %v", err)
	}

	// Parse database URL
	dbURL := os.Getenv("KL_DATABASE_URL")
	if dbURL == "" {
		return nil, fmt.Errorf("KL_DATABASE_URL not set")
	}

	// Parse database pool max size
	poolMaxSizeStr := os.Getenv("KL_DATABASE_POOL_MAX_SIZE")
	poolMaxSize := 10 // default
	if poolMaxSizeStr != "" {
		if parsed, err := strconv.Atoi(poolMaxSizeStr); err == nil {
			poolMaxSize = parsed
		} else {
			fmt.Println("⚠️ Warning: KL_DATABASE_POOL_MAX_SIZE not set or invalid. Defaulting to 10.")
		}
	} else {
		fmt.Println("⚠️ Warning: KL_DATABASE_POOL_MAX_SIZE not set or invalid. Defaulting to 10.")
	}

	return &AppConfig{
		Server: ServerConfig{
			Port: port,
		},
		Database: DatabaseConfig{
			URL:         dbURL,
			PoolMaxSize: poolMaxSize,
		},
	}, nil
}

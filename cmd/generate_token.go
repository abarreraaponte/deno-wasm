package cmd

import (
	"context"
	"fmt"
	"log"

	"kitledger/internal/auth"
	"kitledger/internal/config"
	"kitledger/internal/database"
	"kitledger/internal/models"

	"github.com/google/uuid"
	"github.com/spf13/cobra"
)

var generateTokenCmd = &cobra.Command{
	Use:   "generate-token [user_id]",
	Short: "Generate an API token for a user",
	Long: `Generate an API token for a user that can be used for machine-to-machine integrations.
The token will be displayed once and cannot be retrieved again.
User ID should be a valid UUID.`,
	Args: cobra.ExactArgs(1),
	Run:  runGenerateToken,
}

var tokenName string

func init() {
	generateTokenCmd.Flags().StringVarP(&tokenName, "name", "n", "", "Name/description for the token (required)")
	generateTokenCmd.MarkFlagRequired("name")
}

func runGenerateToken(cmd *cobra.Command, args []string) {
	// Parse user ID
	userID, err := uuid.Parse(args[0])
	if err != nil {
		log.Fatalf("Invalid user ID (must be a valid UUID): %v", err)
	}

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Initialize database
	db, err := database.Init(cfg.Database)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer db.Close()

	// Initialize Valkey cache
	cache, err := database.InitCache(cfg.Valkey)
	if err != nil {
		log.Fatalf("Failed to initialize Valkey cache: %v", err)
	}
	defer cache.Close()

	// Initialize auth service
	authService := auth.NewService(db, cache, cfg.Auth)

	// Check if user exists
	var exists bool
	err = db.Get(&exists, "SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)", userID)
	if err != nil {
		log.Fatalf("Failed to check user existence: %v", err)
	}
	if !exists {
		log.Fatalf("User with ID %s does not exist", userID)
	}

	// Create token request
	req := models.CreateAPITokenRequest{
		TokenName: tokenName,
		Scopes:    []string{}, // Empty scopes for now
	}

	// Generate token
	ctx := context.Background()
	tokenResponse, err := authService.CreateAPIToken(ctx, userID, req)
	if err != nil {
		log.Fatalf("Failed to generate token: %v", err)
	}

	// Display token information
	fmt.Printf("\n✓ API Token created successfully!\n\n")
	fmt.Printf("Token ID:     %s\n", tokenResponse.TokenID)
	fmt.Printf("Name:         %s\n", tokenResponse.TokenName)
	fmt.Printf("User ID:      %s\n", userID)
	if tokenResponse.ExpiresAt != nil {
		fmt.Printf("Expires:      %s\n", tokenResponse.ExpiresAt.Format("2006-01-02 15:04:05"))
	} else {
		fmt.Printf("Expires:      Never\n")
	}
	fmt.Printf("\nAPI Token:    %s\n\n", tokenResponse.Token)
	fmt.Printf("⚠️  Save this token securely - it cannot be retrieved again!\n")
	fmt.Printf("   Use it in the Authorization header: Bearer %s\n\n", tokenResponse.Token)
}

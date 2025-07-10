package database

import (
	"context"
	"fmt"
	"net/url"
	"strconv"
	"strings"
	"time"

	"kitledger/internal/config"

	"github.com/sirupsen/logrus"
	"github.com/valkey-io/valkey-go"
)

type Cache struct {
	client valkey.Client
}

func InitCache(cfg config.ValkeyConfig) (*Cache, error) {
	logrus.Infof("Connecting to Valkey at %s", cfg.URL)

	// Parse the Valkey URL
	parsedURL, err := url.Parse(cfg.URL)
	if err != nil {
		return nil, fmt.Errorf("invalid Valkey URL: %w", err)
	}

	// Extract password if present
	var password string
	if parsedURL.User != nil {
		password, _ = parsedURL.User.Password()
	}

	// Extract database number from path
	db := 0
	if parsedURL.Path != "" && parsedURL.Path != "/" {
		dbStr := strings.TrimPrefix(parsedURL.Path, "/")
		if dbStr != "" {
			if parsed, err := strconv.Atoi(dbStr); err == nil {
				db = parsed
			}
		}
	}

	// Build address (host:port)
	address := parsedURL.Host
	if parsedURL.Port() == "" {
		address = parsedURL.Hostname() + ":6379" // Default Valkey port
	}

	client, err := valkey.NewClient(valkey.ClientOption{
		InitAddress: []string{address},
		Password:    password,
		SelectDB:    db,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create Valkey client: %w", err)
	}

	// Test connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	ping := client.Do(ctx, client.B().Ping().Build())
	if err := ping.Error(); err != nil {
		return nil, fmt.Errorf("failed to connect to Valkey: %w", err)
	}

	logrus.Info("Connected to Valkey successfully")

	return &Cache{
		client: client,
	}, nil
}

func (c *Cache) Close() {
	c.client.Close()
}

// Set stores a key-value pair with optional TTL
func (c *Cache) Set(ctx context.Context, key string, value string, ttl time.Duration) error {
	var cmd valkey.Completed
	if ttl > 0 {
		cmd = c.client.B().Set().Key(key).Value(value).Ex(ttl).Build()
	} else {
		cmd = c.client.B().Set().Key(key).Value(value).Build()
	}

	return c.client.Do(ctx, cmd).Error()
}

// Get retrieves a value by key
func (c *Cache) Get(ctx context.Context, key string) (string, error) {
	cmd := c.client.B().Get().Key(key).Build()
	result := c.client.Do(ctx, cmd)

	if err := result.Error(); err != nil {
		if valkey.IsValkeyNil(err) {
			return "", fmt.Errorf("key not found")
		}
		return "", err
	}

	return result.ToString()
}

// Delete removes a key
func (c *Cache) Del(ctx context.Context, key string) error {
	cmd := c.client.B().Del().Key(key).Build()
	return c.client.Do(ctx, cmd).Error()
}

// Exists checks if a key exists
func (c *Cache) Exists(ctx context.Context, key string) (bool, error) {
	cmd := c.client.B().Exists().Key(key).Build()
	result := c.client.Do(ctx, cmd)

	if err := result.Error(); err != nil {
		return false, err
	}

	count, err := result.AsInt64()
	return count > 0, err
}

// SetNX sets a key only if it doesn't exist (atomic operation)
func (c *Cache) SetNX(ctx context.Context, key string, value string, ttl time.Duration) (bool, error) {
	var cmd valkey.Completed
	if ttl > 0 {
		cmd = c.client.B().Set().Key(key).Value(value).Nx().Ex(ttl).Build()
	} else {
		cmd = c.client.B().Set().Key(key).Value(value).Nx().Build()
	}

	result := c.client.Do(ctx, cmd)
	if err := result.Error(); err != nil {
		return false, err
	}

	// Check if the result is "OK" (key was set) or nil (key already exists)
	response, err := result.ToString()
	if err != nil {
		if valkey.IsValkeyNil(err) {
			return false, nil // Key already exists
		}
		return false, err
	}

	return response == "OK", nil
}

// AddToSet adds a member to a set
func (c *Cache) AddToSet(ctx context.Context, key string, member string) error {
	cmd := c.client.B().Sadd().Key(key).Member(member).Build()
	return c.client.Do(ctx, cmd).Error()
}

// RemoveFromSet removes a member from a set
func (c *Cache) RemoveFromSet(ctx context.Context, key string, member string) error {
	cmd := c.client.B().Srem().Key(key).Member(member).Build()
	return c.client.Do(ctx, cmd).Error()
}

// IsInSet checks if a member is in a set
func (c *Cache) IsInSet(ctx context.Context, key string, member string) (bool, error) {
	cmd := c.client.B().Sismember().Key(key).Member(member).Build()
	result := c.client.Do(ctx, cmd)

	if err := result.Error(); err != nil {
		return false, err
	}

	exists, err := result.AsInt64()
	return exists == 1, err
}

// SetTTL sets TTL for an existing key
func (c *Cache) SetTTL(ctx context.Context, key string, ttl time.Duration) error {
	cmd := c.client.B().Expire().Key(key).Seconds(int64(ttl.Seconds())).Build()
	return c.client.Do(ctx, cmd).Error()
}

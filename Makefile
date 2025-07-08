BINARY_NAME=kitledger
WEB_DIR=web
BUILD_DIR=bin

.PHONY: build clean web deps run test

# Default target
all: clean deps web build

# Install Go dependencies
deps:
	go mod tidy
	go mod download

# Build the web frontend
web:
	deno task bundle

# Build the Go binary for local development
build: web
	go build -o $(BUILD_DIR)/$(BINARY_NAME) .

# Run the application (builds first)
run: build
	./$(BUILD_DIR)/$(BINARY_NAME)

# Run tests
test:
	go test -v ./...

# Clean build artifacts
clean:
	rm -rf $(BUILD_DIR)
	rm -rf $(WEB_DIR)/dist

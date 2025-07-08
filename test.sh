#!/bin/bash

# Simple build test for KitLedger Go

echo "=== KitLedger Build Test ==="

# Clean previous builds
rm -rf bin/ web/public/

# Install dependencies
echo "📦 Installing dependencies..."
go mod tidy

# Build web assets
echo "🏗️  Building web assets..."
cd web && npm install && npm run build && cd ..

# Build Go binary
echo "🏗️  Building Go binary..."
go build -o bin/kitledger .

# Verify build
if [ -f "bin/kitledger" ]; then
    echo "✅ Build successful!"
    echo "Binary size: $(ls -lh bin/kitledger | awk '{print $5}')"
    echo ""
    echo "To run: KL_DATABASE_URL='your-db-url' ./bin/kitledger"
else
    echo "❌ Build failed!"
    exit 1
fi

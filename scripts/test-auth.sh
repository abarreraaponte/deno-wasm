#!/bin/bash

# Authentication Test Script for KitLedger
# This script demonstrates the authentication flow

set -e

API_URL="http://localhost:8000/api"
TEMP_DIR="/tmp/kitledger-auth-test"
COOKIE_JAR="$TEMP_DIR/cookies.txt"

# Create temp directory
mkdir -p "$TEMP_DIR"

echo "🚀 KitLedger Authentication Test"
echo "================================"
echo

# Function to make HTTP requests with cookies
make_request() {
    local method="$1"
    local endpoint="$2"
    local data="$3"
    local extra_headers="$4"
    
    if [ -n "$data" ]; then
        curl -s -X "$method" \
            -H "Content-Type: application/json" \
            -H "$extra_headers" \
            -b "$COOKIE_JAR" \
            -c "$COOKIE_JAR" \
            -d "$data" \
            "$API_URL$endpoint"
    else
        curl -s -X "$method" \
            -H "$extra_headers" \
            -b "$COOKIE_JAR" \
            -c "$COOKIE_JAR" \
            "$API_URL$endpoint"
    fi
}

# Test 1: Health Check
echo "📊 Testing health endpoint..."
response=$(curl -s "$API_URL/health")
echo "Response: $response"
echo

# Test 2: Register User
echo "👤 Registering new user..."
user_data='{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "testpassword123"
}'

register_response=$(make_request "POST" "/auth/register" "$user_data")
echo "Register response: $register_response"
echo

# Test 3: Login
echo "🔐 Logging in..."
login_data='{
    "email": "test@example.com",
    "password": "testpassword123"
}'

login_response=$(make_request "POST" "/auth/login" "$login_data")
echo "Login response: $login_response"

# Extract JWT token for API token testing
jwt_token=$(echo "$login_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "JWT Token: ${jwt_token:0:50}..."
echo

# Test 4: Get User Info (Session-based)
echo "👤 Getting user info (session-based)..."
me_response=$(make_request "GET" "/auth/me")
echo "Me response: $me_response"
echo

# Test 5: Create API Token
echo "🔑 Creating API token..."
api_token_data='{
    "token_name": "Test Integration",
    "scopes": ["read", "write"],
    "expires_at": "2025-12-31T23:59:59Z"
}'

api_token_response=$(make_request "POST" "/auth/tokens" "$api_token_data")
echo "API Token response: $api_token_response"

# Extract API token
api_token=$(echo "$api_token_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
token_id=$(echo "$api_token_response" | grep -o '"token_id":"[^"]*"' | cut -d'"' -f4)
echo "API Token: ${api_token:0:30}..."
echo "Token ID: $token_id"
echo

# Test 6: Use API Token
echo "🔐 Testing API token authentication..."
api_auth_response=$(curl -s -X GET \
    -H "Authorization: Bearer $api_token" \
    "$API_URL/auth/me")
echo "API token auth response: $api_auth_response"
echo

# Test 7: List API Tokens
echo "📋 Listing API tokens..."
tokens_response=$(make_request "GET" "/auth/tokens")
echo "Tokens response: $tokens_response"
echo

# Test 8: Refresh Session
echo "🔄 Refreshing session..."
refresh_response=$(make_request "POST" "/auth/refresh")
echo "Refresh response: $refresh_response"
echo

# Test 9: Revoke API Token
if [ -n "$token_id" ]; then
    echo "❌ Revoking API token..."
    revoke_response=$(make_request "DELETE" "/auth/tokens/$token_id")
    echo "Revoke response: $revoke_response"
    echo
fi

# Test 10: Test Revoked Token (should fail)
if [ -n "$api_token" ]; then
    echo "🚫 Testing revoked API token (should fail)..."
    revoked_test=$(curl -s -X GET \
        -H "Authorization: Bearer $api_token" \
        "$API_URL/auth/me" || echo "Request failed as expected")
    echo "Revoked token test: $revoked_test"
    echo
fi

# Test 11: Logout
echo "👋 Logging out..."
logout_response=$(make_request "POST" "/auth/logout")
echo "Logout response: $logout_response"
echo

# Test 12: Test Session After Logout (should fail)
echo "🚫 Testing session after logout (should fail)..."
post_logout_test=$(make_request "GET" "/auth/me" "" "" || echo "Request failed as expected")
echo "Post-logout test: $post_logout_test"
echo

# Cleanup
rm -rf "$TEMP_DIR"

echo "✅ Authentication test completed!"
echo
echo "Note: Some failures are expected and indicate proper security behavior."

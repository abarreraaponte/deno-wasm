import { getOauth2Provider } from "../services/auth/auth.js";
import { getAwsConfig } from "@/services/config/config.js";
import { redis } from "@/services/cache/redis.js";

const { cognito } = getAwsConfig();
const TEST_TOKEN_KEY = 'test:access_token';

export async function getAccessTokenForTest(): Promise<string> {
    // Try to get cached token
    const cached_token = await redis.get(TEST_TOKEN_KEY);
    if (cached_token) {
        return cached_token;
    }

    // If no cached token, generate new one
    const oauth2_provider = getOauth2Provider();
    const token_response = await oauth2_provider.generateToken(
        cognito.clientId, 
        cognito.clientSecret
    );

    // Cache the token with TTL slightly less than actual expiry
    // Assuming token expires in 1 hour, we cache for 55 minutes
    await redis.setEx(
        TEST_TOKEN_KEY,
        3300, // 55 minutes in seconds
        token_response.access_token
    );

    return token_response.access_token;
}
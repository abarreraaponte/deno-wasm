import { getOauth2Provider } from "../services/auth/auth.js";
import { getAwsConfig } from "@/services/config/config.js";
import { valkey } from "@/services/storage/primary/valkey.js";
import { TimeUnit } from "@valkey/valkey-glide";

const { cognito } = getAwsConfig();
const TEST_TOKEN_KEY = "test:access_token";

export async function getAccessTokenForTest(): Promise<string> {
	// Try to get cached token
	const cached_token = await valkey.get(TEST_TOKEN_KEY);
	if (cached_token) {
		return cached_token.toString();
	}

	// If no cached token, generate new one
	const oauth2_provider = getOauth2Provider();
	const token_response = await oauth2_provider.generateToken(cognito.clientId, cognito.clientSecret);

	// Cache the token with TTL slightly less than actual expiry
	// Assuming token expires in 1 hour, we cache for 55 minutes
	await valkey.set(TEST_TOKEN_KEY, token_response.access_token, {
		expiry: {
			type: TimeUnit.Seconds,
			count: 3300,
		},
	});

	return token_response.access_token;
}

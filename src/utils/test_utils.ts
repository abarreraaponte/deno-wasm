import { getOauth2Provider } from "../services/auth/auth.js";
import { getAwsConfig } from "@/services/config/config.js";

const { cognito } = getAwsConfig();

export async function getAccessTokenForTest(): Promise<string> {
	const oauth2_provider = getOauth2Provider();
	const token_response = await oauth2_provider.generateToken(cognito.clientId, cognito.clientSecret);

	return token_response.access_token;
}

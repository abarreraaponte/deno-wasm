import { getOauth2Provider } from "../services/auth/auth.js";

export async function getAccessTokenForTest(): Promise<string> {
	const oauth2_client_id = process.env.KL_AWS_COGNITO_CLIENT_ID || "";
	const oauth2_client_secret = process.env.KL_AWS_COGNITO_CLIENT_SECRET || "";
	const oauth2_provider = getOauth2Provider();
	const token_response = await oauth2_provider.generateToken(oauth2_client_id, oauth2_client_secret);

	return token_response.access_token;
}

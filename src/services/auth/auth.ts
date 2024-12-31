import { CognitoOAuth2Provider } from "./providers/cognito.js";
import { getAwsConfig, getAuthConfig } from "../config/config.js";

const { cognito, region } = getAwsConfig();

/**
 * Supported Oauth2 grant types
 */
export enum GRANT_TYPES {
	CLIENT_CREDENTIALS = "client_credentials",
}

/**
 * Common OAuth2 provider interface
 */
export interface OAuth2Provider {
	generateToken(clientId: string, clientSecret: string): Promise<TokenResponse>;
	validateToken(token: string): Promise<TokenClaims>;
}

/**
 * Token response from the OAuth2 provider
 */
export interface TokenResponse {
	access_token: string;
	token_type: "Bearer";
	expires_in: number;
	scope?: string[];
}

/**
 * Token claims
 */
export interface TokenClaims {
	sub: string;
	client_id: string;
	scope?: string[];
	exp: number;
	iat: number;
}

/**
 * Unauthorized error
 */
export class UnauthorizedError extends Error {
	constructor(message = "Unauthorized") {
		super(message);
		this.name = "UnauthorizedError";
	}
}

/**
 * Get the OAuth2 provider
 */
export function getOauth2Provider() {
	const { currentOauth2Provider } = getAuthConfig();

	switch (currentOauth2Provider) {
		case "COGNITO":
			return new CognitoOAuth2Provider({
				clientId: cognito.clientId,
				clientSecret: cognito.clientSecret,
				userPoolDomain: cognito.userPoolUrl,
				userPoolId: cognito.userPoolId,
				region: region,
			});
		default:
			throw new Error("Unsupported OAuth2 provider");
	}
}

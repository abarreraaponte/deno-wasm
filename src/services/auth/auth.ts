import { CognitoOAuth2Provider } from './providers/cognito.ts';

/**
 * Supported Oauth2 grant types
 */
export enum GRANT_TYPES {
	CLIENT_CREDENTIALS = 'client_credentials',
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
	token_type: 'Bearer';
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
	constructor(message = 'Unauthorized') {
		super(message);
		this.name = 'UnauthorizedError';
	}
}

/**
 * Get the OAuth2 provider
 */
export function getOauth2Provider() {
	return new CognitoOAuth2Provider({
		clientId: Deno.env.get('KL_AWS_COGNITO_CLIENT_ID') || '',
		clientSecret: Deno.env.get('KL_AWS_COGNITO_CLIENT_SECRET') || '',
		userPoolDomain: Deno.env.get('KL_AWS_COGNITO_USER_POOL_DOMAIN') || '',
		userPoolId: Deno.env.get('KL_AWS_COGNITO_USER_POOL_ID') || '',
		region: Deno.env.get('KL_AWS_REGION') || '',
	});
}

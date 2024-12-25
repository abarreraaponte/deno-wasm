import { Context, Next } from '@hono/hono';
import { CognitoOAuth2Provider } from './providers/cognito.ts';

export enum GRANT_TYPES {
	CLIENT_CREDENTIALS = 'client_credentials',
}

export interface OAuth2Provider {
	generateToken(clientId: string, clientSecret: string): Promise<TokenResponse>;
	validateToken(token: string): Promise<TokenClaims>;
}

export interface TokenResponse {
	access_token: string;
	token_type: 'Bearer';
	expires_in: number;
	scope?: string[];
}

export interface TokenClaims {
	sub: string;
	client_id: string;
	scope?: string[];
	exp: number;
	iat: number;
}

export class UnauthorizedError extends Error {
	constructor(message = 'Unauthorized') {
		super(message);
		this.name = 'UnauthorizedError';
	}
}

export function getOauth2Provider() {
	return new CognitoOAuth2Provider({
		clientId: Deno.env.get('KL_AWS_COGNITO_CLIENT_ID') || '',
		clientSecret: Deno.env.get('KL_AWS_COGNITO_CLIENT_SECRET') || '',
		userPoolDomain: Deno.env.get('KL_AWS_COGNITO_USER_POOL_DOMAIN') || '',
		userPoolId: Deno.env.get('KL_AWS_COGNITO_USER_POOL_ID') || '',
		region: Deno.env.get('KL_AWS_REGION') || '',
	});
}

// Middleware
export const authMiddleware = (provider: OAuth2Provider) => {
	return async (c: Context, next: Next) => {
		const authHeader = c.req.header('authorization');
		if (!authHeader?.startsWith('Bearer ')) {
			return c.json(
				{ error: 'invalid_token', error_description: 'Missing or invalid authorization header' },
				401,
				{
					'WWW-Authenticate': 'Bearer',
				},
			);
		}

		const token = authHeader.slice(7);
		try {
			const claims = await provider.validateToken(token);
			c.set('auth', claims);
			await next();
		} catch (error) {
			return c.json(
				{ error: 'invalid_token', error_description: String(error) },
				401,
				{
					'WWW-Authenticate': 'Bearer',
				},
			);
		}
	};
};

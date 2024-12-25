import { Context, Next } from '@hono/hono';

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

// Middleware
export const authMiddleware = (provider: OAuth2Provider) => {
	return async (c: Context, next: Next) => {
		const authHeader = c.req.header('authorization');
		if (!authHeader?.startsWith('Bearer ')) {
			throw new UnauthorizedError('Missing or invalid authorization header');
		}

		const token = authHeader.slice(7);
		try {
			const claims = await provider.validateToken(token);
			c.set('auth', claims);
			await next();
		} catch (error) {
			throw new UnauthorizedError(String(error));
		}
	};
};

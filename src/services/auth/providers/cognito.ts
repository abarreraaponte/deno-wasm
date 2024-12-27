import { GRANT_TYPES, OAuth2Provider, TokenClaims, TokenResponse, UnauthorizedError } from '../auth.ts';
import * as jose from 'jose';
import { encodeBase64 } from '@std/encoding';

/**
 * Cognito configuration
 */
interface CognitoConfig {
	clientId: string;
	clientSecret: string;
	userPoolDomain: string;
	userPoolId: string;
	region: string;
}

/**
 * JWK cache handler
 */
class JWKCache {
	private keys: jose.JWK[] = [];
	private lastFetch: number = 0;
	private readonly TTL = 3600 * 1000;

	async getKeys(jwksUri: string): Promise<jose.JWK[]> {

		if (Date.now() - this.lastFetch > this.TTL) {
			console.log('Fetching JWKs from', jwksUri);
			const response = await fetch(jwksUri);
			const jwks = await response.json();
			this.keys = jwks.keys;
			this.lastFetch = Date.now();
		}

		return this.keys;
	}
}

/**
 * Cognito OAuth2 provider
 */
export class CognitoOAuth2Provider implements OAuth2Provider {
	private jwkCache: JWKCache;

	constructor(private readonly config: CognitoConfig) {
		this.jwkCache = new JWKCache();
	}

	/**
	 * Generate a new token
	 */
	async generateToken(clientId: string, clientSecret: string): Promise<TokenResponse> {
		const tokenEndpoint = `${this.config.userPoolDomain}/oauth2/token`;

		const response = await fetch(tokenEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Basic ${encodeBase64(`${clientId}:${clientSecret}`)}`,
			},
			body: new URLSearchParams({
				grant_type: GRANT_TYPES.CLIENT_CREDENTIALS,
			}),
		});

		if (!response.ok) {
			throw new UnauthorizedError(`Token generation failed: ${response.statusText}`);
		}

		return response.json();
	}

	/**
	 * Validate a token
	 */
	async validateToken(token: string): Promise<TokenClaims> {
		try {
			const jwksUri = `https://cognito-idp.${this.config.region}.amazonaws.com/${this.config.userPoolId}/.well-known/jwks.json`;
			const keys = await this.jwkCache.getKeys(jwksUri);
			const JWKS = jose.createLocalJWKSet({ keys });

			const { payload } = await jose.jwtVerify(token, JWKS, {
				issuer: `https://cognito-idp.${this.config.region}.amazonaws.com/${this.config.userPoolId}`,
			});

			return {
				sub: payload.sub as string,
				client_id: payload.client_id as string,
				scope: payload.scope ? (payload.scope as string).split(' ') : undefined,
				exp: payload.exp as number,
				iat: payload.iat as number,
			};
		} catch (_error) {
			console.error('Token validation failed:', _error);
			throw new UnauthorizedError('Invalid token');
		}
	}
}

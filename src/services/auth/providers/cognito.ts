import { GRANT_TYPES, OAuth2Provider, TokenClaims, TokenResponse, UnauthorizedError } from "../auth.js";
import * as jose from "jose";
import { valkey } from "@/services/storage/primary/valkey.js";
import { TimeUnit } from "@valkey/valkey-glide";

interface CognitoConfig {
	clientId: string;
	clientSecret: string;
	userPoolDomain: string;
	userPoolId: string;
	region: string;
}

export class CognitoOAuth2Provider implements OAuth2Provider {
	constructor(private readonly config: CognitoConfig) {}

	private getJwksValkeyKey(): string {
		return `jwks:${this.config.userPoolId}`;
	}

	private async getJWKS(jwksUri: string): Promise<jose.JWK[]> {
		const valkeyKey = this.getJwksValkeyKey();

		// Try to get from cache first
		const cachedKeys = await valkey.get(valkeyKey);
		if (cachedKeys) {
			return JSON.parse(cachedKeys.toString());
		}

		// If not in cache, fetch and store
		const response = await fetch(jwksUri);
		const jwks = (await response.json()) as { keys: jose.JWK[] };

		// Cache for 1 hour
		await valkey.set(valkeyKey, JSON.stringify(jwks.keys), {
			expiry: { type: TimeUnit.Seconds, count: 3600 },
		});

		return jwks.keys;
	}

	async generateToken(clientId: string, clientSecret: string): Promise<TokenResponse> {
		const tokenEndpoint = `${this.config.userPoolDomain}/oauth2/token`;

		const response = await fetch(tokenEndpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
			},
			body: new URLSearchParams({
				grant_type: GRANT_TYPES.CLIENT_CREDENTIALS,
			}),
		});

		if (!response.ok) {
			throw new UnauthorizedError(`Token generation failed: ${response.statusText}`);
		}

		return response.json() as Promise<TokenResponse>;
	}

	async validateToken(token: string): Promise<TokenClaims> {
		try {
			const jwksUri = `https://cognito-idp.${this.config.region}.amazonaws.com/${this.config.userPoolId}/.well-known/jwks.json`;
			const keys = await this.getJWKS(jwksUri);
			const JWKS = jose.createLocalJWKSet({ keys });

			const { payload } = await jose.jwtVerify(token, JWKS, {
				issuer: `https://cognito-idp.${this.config.region}.amazonaws.com/${this.config.userPoolId}`,
			});

			return {
				sub: payload.sub as string,
				client_id: payload.client_id as string,
				scope: payload.scope ? (payload.scope as string).split(" ") : undefined,
				exp: payload.exp as number,
				iat: payload.iat as number,
			};
		} catch (_error) {
			console.error("Token validation failed:", _error);
			throw new UnauthorizedError("Invalid token");
		}
	}
}

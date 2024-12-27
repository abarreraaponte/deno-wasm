import { Context, Next } from '@hono/hono';
import { OAuth2Provider } from '../services/auth/auth.ts';

/**
 * Middleware to authenticate requests
 */
const authMiddleware = (provider: OAuth2Provider) => {
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

export default authMiddleware;
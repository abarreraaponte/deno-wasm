// routes/auth.ts
import { Hono } from '@hono/hono';
import { decodeBase64 } from '@std/encoding/base64';
import { getOauth2Provider, GRANT_TYPES, UnauthorizedError } from '../../../core/services/auth/auth.ts';

// Helper to parse Basic auth header
const parseBasicAuth = (authHeader: string | undefined): { clientId: string; clientSecret: string } => {
	if (!authHeader?.startsWith('Basic ')) {
		throw new UnauthorizedError('Invalid authorization header');
	}

	const base64Credentials = authHeader.slice(6); // Remove 'Basic ' prefix
	const credentials = new TextDecoder().decode(decodeBase64(base64Credentials));
	const [clientId, clientSecret] = credentials.split(':');

	if (!clientId || !clientSecret) {
		throw new UnauthorizedError('Invalid credentials format');
	}

	return { clientId, clientSecret };
};

const router = new Hono();
const provider = getOauth2Provider();

router.post('/token', async (c) => {
	const grantType = c.req.query('grant_type');
	if (grantType !== GRANT_TYPES.CLIENT_CREDENTIALS) {
		return c.json({ error: 'unsupported_grant_type' }, 400);
	}

	try {
		const { clientId, clientSecret } = parseBasicAuth(c.req.header('Authorization'));
		const token = await provider.generateToken(clientId, clientSecret);
		return c.json(token);
	} catch (error) {
		if (error instanceof UnauthorizedError) {
			return c.json({ error: 'invalid_client' }, 401);
		}
		// Log the error internally
		console.error('Token generation error:', error);
		return c.json({ error: 'server_error' }, 500);
	}
});

export default router;

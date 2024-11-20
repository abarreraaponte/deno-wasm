import { type Context, Hono } from '@hono/hono';
import CurrencyRouter from './CurrencyHttpHandler.ts';
import LedgerRouter from './LedgerHttpHandler.ts';
import AccountRouter from './AccountHttpHandler.ts';

const app = new Hono();

app.get('/health', (c: Context) => {
	return c.json({ status: 'ok' });
});

app.route('/api/accounts', AccountRouter);
app.route('/api/currencies', CurrencyRouter);
app.route('/api/ledgers', LedgerRouter);

// Export to use instance in testing client.
export const server = app;

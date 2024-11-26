import { type Context, Hono } from '@hono/hono';
import UomTypeRouter from './uom_type_http_handler.ts';
import LedgerRouter from './ledger_http_handler.ts';
import AccountRouter from './account_http_handler.ts';

const app = new Hono();

app.get('/health', (c: Context) => {
	return c.json({ status: 'ok' });
});

app.route('/api/accounts', AccountRouter);
app.route('/api/uom-types', UomTypeRouter);
app.route('/api/ledgers', LedgerRouter);

// Export to use instance in testing client.
export const server = app;

import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import CurrencyRouter from '@/handlers/CurrencyHttpHandler';
import LedgerRouter from '@/handlers/LedgerHttpHandler';
import AccountRouter from '@/handlers/AccountHttpHandler';
import { config } from 'dotenv';

config();

const app = new Hono();

app.get('/api/health', (c) => {
  return c.json({ status: 'ok' });
});

app.route('/api/accounts', AccountRouter);
app.route('/api/currencies', CurrencyRouter);
app.route('/api/ledgers', LedgerRouter);

const port = Number(process.env.API_PORT || 3001);
console.log(`Server is running on port ${port}`);

// Export to use instance in testing client.
export const server = app;

serve({
	fetch: app.fetch,
	port: port,
});

import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import CurrencyRouter from '@/handlers/CurrencyHttpHandler.js';
import LedgerRouter from '@/handlers/LedgerHttpHandler.js';
import AccountRouter from '@/handlers/AccountHttpHandler.js';
import { config } from 'dotenv';

config();

const app = new Hono();

app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

app.route('/api/accounts', AccountRouter);
app.route('/api/currencies', CurrencyRouter);
app.route('/api/ledgers', LedgerRouter);

const port = Number(process.env.SERVER_PORT || 3000);
console.log(`Server is running on port ${port}`);

// Export to use instance in testing client.
export const server = app;

serve({
	fetch: app.fetch,
	port: port,
});

import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import CurrencyRouter from '@/currencies/CurrencyHttpHandler';
import LedgerRouter from '@/ledgers/LedgerHttpHandler';
import AccountRouter from '@/accounts/AccountHttpHandler';
import { config } from 'dotenv';

config();

const app = new Hono();

app.get('/', (c) => {
	return c.text(`Hello`);
});

app.get('/health', (c) => {
  return c.text('UP');
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

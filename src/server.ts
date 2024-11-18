import { Hono, type Context } from '@hono/hono';
import CurrencyRouter from './handlers/CurrencyHttpHandler.ts';
import LedgerRouter from './handlers/LedgerHttpHandler.ts';
import AccountRouter from './handlers/AccountHttpHandler.ts';

const app = new Hono();

app.get('/health', (c: Context) => {
  return c.json({ status: 'ok' });
});

app.route('/api/accounts', AccountRouter);
app.route('/api/currencies', CurrencyRouter);
app.route('/api/ledgers', LedgerRouter);

// Export to use instance in testing client.
export const server = app;

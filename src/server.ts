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

// Export to use instance in testing client.
export const server = app;

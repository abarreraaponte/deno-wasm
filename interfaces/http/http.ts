import { type Context, Hono } from '@hono/hono';
import UnitTypeRouter from './unit_type_http_handler.ts';
import LedgerRouter from './ledger_http_handler.ts';
import AccountRouter from './account_http_handler.ts';
import EntityModelRouter from './entity_model_http_handler.ts'; 
import TransactionModelRouter from './transaction_model_http_handler.ts';

const app = new Hono();

app.get('/health', (c: Context) => {
	return c.json({ status: 'ok' });
});

app.route('/api/accounts', AccountRouter);
app.route('/api/unit-types', UnitTypeRouter);
app.route('/api/ledgers', LedgerRouter);
app.route('/api/entity-models', EntityModelRouter);
app.route('/api/transaction-models', TransactionModelRouter);

// Export to use instance in testing client.
export const server = app;

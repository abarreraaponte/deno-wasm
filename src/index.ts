import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import ApiV1Router from '@/core/routers/apiv1';
import { config } from 'dotenv';

config();

const app = new Hono();

app.get('/', (c) => {
	return c.text(`Hello`);
});

app.get('/health', (c) => {
  return c.text('UP');
});

app.route('/api/v1', ApiV1Router);

const port = Number(process.env.SERVER_PORT || 3000);
console.log(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port: port,
});

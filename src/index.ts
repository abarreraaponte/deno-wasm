import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { z } from 'zod';

import { config } from 'dotenv';

config();

const app = new Hono();

app.get('/', (c) => {
  	return c.text(`Hello`);
});

app.get('/health', (c) => {
	return c.text('UP');
});

const port = Number(process.env.SERVER_PORT || 3000);
console.log(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port: port,
});

import { serve } from '@hono/node-server';
import { server } from './server.js';
import { config } from 'dotenv';

config();

const port = Number(process.env.SERVER_PORT || 3000);
console.log(`Server is running on port ${port}`);

serve({
	fetch: server.fetch,
	port: port,
});
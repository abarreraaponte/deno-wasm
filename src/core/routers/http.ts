import { Hono } from 'hono'
import { cors } from 'hono/cors';

const app = new Hono();

app.get('/', (c) => {
  	return c.text(`Hello`);
});

app.get('/health', (c) => {
	return c.text('UP');
});

export default app;
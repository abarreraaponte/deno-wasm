import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors';
// TRPC
import { router, publicProcedure } from '../../shared/trpc';
import { trpcServer } from '@hono/trpc-server';
import { z } from 'zod';

import { config } from 'dotenv';

config();

const app = new Hono();

const trpcRouter = router({
	hello: publicProcedure
		.input(z.object({ name: z.string() }))
		.query(({ input }) => {
			return `Hello ${input.name}!`;
		}),
  });
  
export type TRPCRouter = typeof trpcRouter;

app.get('/', (c) => {
  	return c.text(`Hello ${process.env.NAME || 'world'}!`);
});

app.use('/trpc/*', cors({
	origin: '*',
	allowMethods: ['POST'],
	credentials: true,
}));
app.use('/trpc/*', trpcServer({ router: trpcRouter }));

const port = Number(process.env.PORT || 3000);
console.log(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port: port,
});

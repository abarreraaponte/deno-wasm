import { serve } from '@hono/node-server'
import { Hono } from 'hono'
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

app.use('/trpc/*', trpcServer({ router: trpcRouter }));

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port
});

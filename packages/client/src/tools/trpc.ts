import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { TRPCRouter } from "../../../server/src/index";

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;

export const trpc = createTRPCProxyClient<TRPCRouter>({
	links: [
	  httpBatchLink({
		url: 'http://localhost:3000/trpc',
	  }),
	],
  });
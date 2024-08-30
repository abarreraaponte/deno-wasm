import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { TRPCRouter } from "../../../server/src/index";

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
const TRPC_PATH = import.meta.env.VITE_TRPC_PATH as string;

export const trpc = createTRPCProxyClient<TRPCRouter>({
	links: [
		httpBatchLink({
			url: `${SERVER_URL}${TRPC_PATH}`,
		}),
	],
});
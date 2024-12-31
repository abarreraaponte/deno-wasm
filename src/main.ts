import { server } from "./router.js";
import { serve } from "@hono/node-server";
import { getHttpServerConfig } from "./services/config/config.js";

const { port } = getHttpServerConfig();

console.log(`Kitledger HTTP Server is running on port ${port}`);

serve({
	fetch: server.fetch,
	port: port,
});

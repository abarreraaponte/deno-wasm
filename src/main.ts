import { server } from "./router.js";
import { config } from "dotenv";
import { serve } from "@hono/node-server";

config();

const port = Number(process.env.KL_SERVER_PORT || 3000);
console.log(`Server is running on port ${port}`);

serve({
	fetch: server.fetch,
	port: port,
});

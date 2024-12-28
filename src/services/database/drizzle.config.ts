import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config();

const user = process.env.KL_PG_USER || "";
const password = process.env.KL_PG_PASSWORD || "";
const host = process.env.KL_PG_HOST || "localhost";
const port = parseInt(process.env.KL_PG_PORT || "5432");
const database = process.env.KL_PG_NAME || "kitledger";

export const postgresUrl = `postgres://${user}:${password}@${host}:${port}/${database}`;

export default defineConfig({
	dbCredentials: {
		url: postgresUrl,
	},
	schema: "./src/services/database/schema.ts",
	out: "./src/services/database/migrations",
	dialect: "postgresql",
	verbose: true,
	strict: true,
	migrations: {
		table: "migrations",
		schema: "public",
	},
});

import { defineConfig } from 'drizzle-kit'

const user = Deno.env.get('DB_USER') || '';
const password = Deno.env.get('DB_PASSWORD') || '';
const host = Deno.env.get('DB_HOST') || 'localhost';
const port = parseInt(Deno.env.get('DB_PORT') || '5432');
const database = Deno.env.get('DB_NAME') || 'kitledger';

export const postgresUrl = `postgres://${user}:${password}@${host}:${port}/${database}`;

export default defineConfig({
	dbCredentials: {
		url: postgresUrl,
	},
 	schema: "./src/services/database/schema.ts",
	out: "./migrations",
	dialect: "postgresql",
	verbose: true,
	strict: true,
});
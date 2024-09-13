import { defineConfig } from 'drizzle-kit'

const user = process.env.DB_USER || '';
const password = process.env.DB_PASSWORD || '';
const host = process.env.DB_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT || '5432');
const database = process.env.DB_NAME || 'nschat';

export const postgresUrl = `postgres://${user}:${password}@${host}:${port}/${database}`;

export default defineConfig({
	dbCredentials: {
		url: postgresUrl,
	},
 	schema: "./packages/core/database/schema.ts",
	out: "./migrations",
	dialect: "postgresql",
	verbose: true,
	strict: true,
});
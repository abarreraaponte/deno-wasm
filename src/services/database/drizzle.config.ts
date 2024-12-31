import { defineConfig } from "drizzle-kit";
import { getPostgresConfig } from "../config/config.js";

const { url } = getPostgresConfig();

export default defineConfig({
	dbCredentials: {
		url: url,
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

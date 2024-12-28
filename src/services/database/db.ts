import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema.js";
import postgres from "postgres";
import { config } from "dotenv";

config();

const user = process.env.KL_PG_USER || "";
const password = process.env.KL_PG_PASSWORD || "";
const host = process.env.KL_PG_HOST || "localhost";
const port = parseInt(process.env.KL_PG_PORT || "5432");
const database = process.env.KL_PG_NAME || "kitledger";
const max_connections = parseInt(process.env.KL_PG_MAX_CONNECTIONS || "10");

export const postgresUrl = `postgres://${user}:${password}@${host}:${port}/${database}`;

const queryClient = postgres(postgresUrl, { max: max_connections });

export const db = drizzle(queryClient, { schema: schema });

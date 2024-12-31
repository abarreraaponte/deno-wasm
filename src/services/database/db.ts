import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema.js";
import postgres from "postgres";
import { getPostgresConfig } from "../config/config.js";

const { url, max_connections } = getPostgresConfig();

const queryClient = postgres(url, { max: max_connections });

export const db = drizzle(queryClient, { schema: schema });

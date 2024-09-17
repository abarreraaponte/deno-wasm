import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from "./schema";
import postgres from 'postgres';
import "dotenv/config";

const user = process.env.DB_USER || '';
const password = process.env.DB_PASSWORD || '';
const host = process.env.DB_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT || '5432');
const database = process.env.DB_NAME || 'entropydb';

export const postgresUrl = `postgres://${user}:${password}@${host}:${port}/${database}`;

const queryClient = postgres(postgresUrl);

export const db = drizzle(queryClient, { schema: schema});


// Read Only User
const read_user = process.env.DB_READ_USER || '';
const read_password = process.env.DB_READ_PASSWORD || '';

export const readOnlyPostgresUrl = `postgres://${read_user}:${read_password}@${host}:${port}/${database}`;

export const readOnlyDb = drizzle(queryClient, { schema: schema});
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema.ts';
import postgres from 'postgres';

const user = Deno.env.get('KL_PG_USER') || '';
const password = Deno.env.get('KL_PG_PASSWORD') || '';
const host = Deno.env.get('KL_PG_HOST') || 'localhost';
const port = parseInt(Deno.env.get('KL_PG_PORT') || '5432');
const database = Deno.env.get('KL_PG_NAME') || 'kitledger';
const max_connections = parseInt(Deno.env.get('KL_PG_MAX_CONNECTIONS') || '10');

export const postgresUrl = `postgres://${user}:${password}@${host}:${port}/${database}`;

const queryClient = postgres(postgresUrl, { max: max_connections });

export const db = drizzle(queryClient, { schema: schema });

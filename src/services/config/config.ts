import type { AuthConfig, AwsConfig, HttpServerConfig, PostgresConfig, RedisConfig } from "./types.js";
import { config } from "dotenv";

config();

export function getAuthConfig(): AuthConfig {
	// For now, we only support Cognito. Later we can expand this to support other providers configurable with a new environment variable.
	return {
		currentOauth2Provider: "COGNITO",
	};
}

export function getAwsConfig(): AwsConfig {
	return {
		accessKeyId: process.env.KL_AWS_ACCESS_KEY_ID || "",
		secretAccessKey: process.env.KL_AWS_SECRET_ACCESS_KEY || "",
		region: process.env.KL_AWS_REGION || "",
		cognito: {
			userPoolId: process.env.KL_AWS_COGNITO_USER_POOL_ID || "",
			userPoolUrl: process.env.KL_AWS_COGNITO_USER_POOL_URL || "",
			clientId: process.env.KL_AWS_COGNITO_CLIENT_ID || "",
			clientSecret: process.env.KL_AWS_COGNITO_CLIENT_SECRET || "",
		},
	};
}

export function getHttpServerConfig(): HttpServerConfig {
	return {
		port: parseInt(process.env.KL_SERVER_PORT || "3000"),
	};
}

export function getPostgresConfig(): PostgresConfig {
	const ssl_mode = process.env.KL_PG_SSL_MODE || "disable";
	const url = `postgres://${process.env.KL_PG_USER}:${process.env.KL_PG_PASSWORD}@${process.env.KL_PG_HOST}:${process.env.KL_PG_PORT}/${process.env.KL_PG_NAME}`;

	return {
		user: process.env.KL_PG_USER || "",
		password: process.env.KL_PG_PASSWORD || "",
		host: process.env.KL_PG_HOST || "",
		port: parseInt(process.env.KL_PG_PORT || "5432"),
		database: process.env.KL_PG_NAME || "",
		ssl_mode: ssl_mode,
		max_connections: parseInt(process.env.KL_PG_MAX_CONNECTIONS || "10"),
		url: url,
	};
}

export function getRedisConfig(): RedisConfig {

	const user = process.env.KL_REDIS_USER || "";
	const password = process.env.KL_REDIS_PASSWORD || "";
	const db = parseInt(process.env.KL_REDIS_DB || "0");

	// Build URL but with optional user and passsword.
	const url = `redis://${user ? user + ":" + password + "@" : ""}${process.env.KL_REDIS_HOST}:${process.env.KL_REDIS_PORT}/${db}`;

	return {
		host: process.env.KL_REDIS_HOST || "",
		port: parseInt(process.env.KL_REDIS_PORT || "6379"),
		user: user,
		password: password,
		db: db,
		url: url,
	};
}

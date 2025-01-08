import type { AuthConfig, AwsConfig, HttpServerConfig, ValkeyConfig } from "./types.js";
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

export function getValkeyConfig(): ValkeyConfig {
	const primary_host = process.env.KL_VALKEY_PRIMARY_HOST || "localhost";
	const primary_port = process.env.KL_VALKEY_PRIMARY_PORT || "6379";
	const replica_hosts_string = process.env.KL_VALKEY_REPLICA_HOSTS || "";
	const replica_ports_string = process.env.KL_VALKEY_REPLICA_PORTS || "";

	const replica_hosts = replica_hosts_string.length > 0 ? replica_hosts_string.split(",") : [];
	const replica_ports =
		replica_ports_string.length > 0 ? replica_ports_string.split(",").map((port) => parseInt(port)) : [];

	// Return an array of addresses with the type host:string, port: numner where the first one is the primary and the others are replicas, if they exist. For every replica if the port is not provided, it will default to the primary port.
	const addresses = [
		{
			host: primary_host,
			port: Number(primary_port),
		},
		...replica_hosts.map((host, index) => ({
			host: host,
			port: Number(replica_ports[index] || primary_port),
		})),
	];

	return {
		addresses: addresses,
	};
}

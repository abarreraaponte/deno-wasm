import type { BaseClientConfiguration } from "@valkey/valkey-glide";

export type HttpServerConfig = {
	port: number;
};

export type AwsConfig = {
	accessKeyId: string;
	secretAccessKey: string;
	region: string;
	cognito: {
		userPoolId: string;
		userPoolUrl: string;
		clientId: string;
		clientSecret: string;
	};
};

export type AuthConfig = {
	currentOauth2Provider: "COGNITO";
};

export type ValkeyConfig = BaseClientConfiguration;

export type PostgresConfig = {
	user: string;
	password: string;
	host: string;
	port: number;
	database: string;
	max_connections: number;
	url: string;
}

export type HttpServerConfig = {
	port: number;
}

export type AwsConfig = {
	accessKeyId: string;
	secretAccessKey: string;
	region: string;
	cognito: {
		userPoolId: string;
		userPoolUrl: string;
		clientId: string;
		clientSecret: string;
	}
}
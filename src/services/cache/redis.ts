import { createClient } from "redis";
import { getRedisConfig } from "../config/config.js";

const { url } = getRedisConfig();

export const redis = createClient({
	url: url,
});

redis.connect().catch((err) => {
	console.error("Failed to connect to Redis", err);
	process.exit(1);
});
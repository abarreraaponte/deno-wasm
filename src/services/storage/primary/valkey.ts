import { GlideClient } from "@valkey/valkey-glide";
import { getValkeyConfig } from "../../config/config.js";

const { addresses } = getValkeyConfig();

export const valkey = await GlideClient.createClient({
	addresses: addresses,
});

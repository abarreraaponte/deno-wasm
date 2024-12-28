import { type Context, Hono } from "hono";
import UnitTypeRouter from "./handlers/unit_type_api_handler.js";
import LedgerRouter from "./handlers/ledger_api_handler.js";
import AccountRouter from "./handlers/account_api_handler.js";
import EntityModelRouter from "./handlers/entity_model_api_handler.js";
import TransactionModelRouter from "./handlers/transaction_model_api_handler.js";
import Oauth2Router from "./handlers/oauth2_handler.js";
import { getOauth2Provider } from "./services/auth/auth.js";
import authMiddleware from "./middleware/auth_middleware.js";

const app = new Hono();
const oauth2Provider = getOauth2Provider();

app.get("/health", (c: Context) => {
	return c.json({ status: "ok" });
});

app.route("/oauth2", Oauth2Router);

app.use("/api/*", authMiddleware(oauth2Provider));

app.route("/api/accounts", AccountRouter);
app.route("/api/unit-types", UnitTypeRouter);
app.route("/api/ledgers", LedgerRouter);
app.route("/api/entity-models", EntityModelRouter);
app.route("/api/transaction-models", TransactionModelRouter);

// Export to use instance in testing client.
export const server = app;

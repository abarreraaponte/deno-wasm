import { describe, it, expect, beforeAll } from "vitest";
import { server } from "../../src/router.js";
import { AccountFactory, LedgerFactory, UnitTypeFactory } from "../../src/services/storage/factories.js";
import { create } from "../../src/actions/ledger_actions.js";
import { create as createUnitType } from "../../src/actions/unit_type_actions.js";
import { Account } from "../../src/services/storage/types.js";
import { getAccessTokenForTest } from "../../src/utils/test_utils.js";
import { getHttpServerConfig } from "../../src/services/config/config.js";

const { port } = getHttpServerConfig();

let access_token: string;
let ledger: any; // Adjust type as needed
const SUCCESS_REF_ID = `T${Math.floor(Math.random() * 99)}`;

async function makeRequest(data: Account.New | Account.Model, method: string, endpoint: string): Promise<Response> {
	const req = new Request(`http://localhost:${port}${endpoint}`, {
		method: method,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${access_token}`,
		},
		body: JSON.stringify(data),
	});

	return await server.fetch(req);
}

beforeAll(async () => {
	access_token = await getAccessTokenForTest();

	const sample_ledger_data = new LedgerFactory().make();
	const uom_type = await createUnitType(new UnitTypeFactory().make());
	sample_ledger_data.unit_type_id = uom_type[0].id;
	ledger = await create(sample_ledger_data);
});

describe("Account API", () => {
	it("should create a valid account", async () => {
		const test_data = new AccountFactory().make();
		test_data.ref_id = SUCCESS_REF_ID;
		test_data.ledger_id = ledger[0].id;

		const res = await makeRequest(test_data, "POST", "/api/accounts");
		const json: Account.Model = (await res.json()) as Account.Model;

		expect(res.status).toBe(200);
		expect(json.id).toHaveLength(36);
	});

	it("should fail validation with invalid name", async () => {
		const test_data = new AccountFactory().make();
		test_data.name = "A".repeat(256);
		test_data.ledger_id = ledger[0].id;

		const res = await makeRequest(test_data, "POST", "/api/accounts");

		expect(res.status).toBe(422);
	});

	it("should fail validation with repeated Ref ID", async () => {
		const test_data = new AccountFactory().make();
		test_data.ref_id = SUCCESS_REF_ID;
		test_data.ledger_id = ledger[0].id;

		const res = await makeRequest(test_data, "POST", "/api/accounts");

		expect(res.status).toBe(422);
	});
});

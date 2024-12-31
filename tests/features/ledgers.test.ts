import { describe, it, expect, beforeAll } from "vitest";
import { server } from "../../src/router.js";
import { LedgerFactory, UnitTypeFactory } from "../../src/services/database/factories.js";
import { create } from "../../src/actions/unit_type_actions.js";
import { Ledger, NewLedger } from "../../src/types/index.js";
import { getAccessTokenForTest } from "../../src/utils/test_utils.js";
import { getHttpServerConfig } from "@/services/config/config.js";

const { port } = getHttpServerConfig();

let access_token: string;
let uom_type: any; // Adjust type as needed
const SUCCESS_REF_ID = `T${Math.floor(Math.random() * 99)}`;

async function makeRequest(data: NewLedger | Ledger, method: string, endpoint: string): Promise<Response> {
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
	uom_type = await create(new UnitTypeFactory().make());
});

describe("Ledger API", () => {
	it("should create a valid ledger", async () => {
		const test_data = new LedgerFactory().make();
		test_data.ref_id = SUCCESS_REF_ID;
		test_data.unit_type_id = uom_type[0].id;

		const res = await makeRequest(test_data, "POST", "/api/ledgers");
		const json: Ledger = (await res.json()) as Ledger;

		expect(res.status).toBe(200);
		expect(json.id).toHaveLength(36);
	});

	it("should fail validation with invalid name", async () => {
		const test_data = new LedgerFactory().make();
		test_data.name = "A".repeat(256);
		test_data.unit_type_id = uom_type[0].id;

		const res = await makeRequest(test_data, "POST", "/api/ledgers");

		expect(res.status).toBe(422);
	});

	it("should fail validation with repeated Ref ID", async () => {
		const test_data = new LedgerFactory().make();
		test_data.ref_id = SUCCESS_REF_ID;
		test_data.unit_type_id = uom_type[0].id;

		const res = await makeRequest(test_data, "POST", "/api/ledgers");

		expect(res.status).toBe(422);
	});
});

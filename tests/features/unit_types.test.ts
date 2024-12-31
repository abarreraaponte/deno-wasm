import { describe, it, expect, beforeAll } from "vitest";
import { server } from "../../src/router.js";
import { UnitTypeFactory } from "../../src/services/database/factories.js";
import { NewUnitType, UnitType } from "../../src/types/index.js";
import { getAccessTokenForTest } from "../../src/utils/test_utils.js";
import { getHttpServerConfig } from "@/services/config/config.js";

const { port } = getHttpServerConfig();

let access_token: string;
const SUCCESS_REF_ID = `T${Math.floor(Math.random() * 99)}`;

async function makeRequest(data: NewUnitType | UnitType, method: string, endpoint: string): Promise<Response> {
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
});

describe("Unit Type API", () => {
	it("should create a valid unit type", async () => {
		const test_data = new UnitTypeFactory().make();
		test_data.ref_id = SUCCESS_REF_ID;

		const res = await makeRequest(test_data, "POST", "/api/unit-types");
		const json: UnitType = (await res.json()) as UnitType;

		expect(res.status).toBe(200);
		expect(json.id).toHaveLength(36);
	});

	it("should fail validation with invalid name", async () => {
		const test_data = new UnitTypeFactory().make();
		test_data.name = "A".repeat(256);

		const res = await makeRequest(test_data, "POST", "/api/unit-types");

		expect(res.status).toBe(422);
	});

	it("should fail validation with repeated Ref ID", async () => {
		const test_data = new UnitTypeFactory().make();
		test_data.ref_id = SUCCESS_REF_ID;

		const res = await makeRequest(test_data, "POST", "/api/unit-types");

		expect(res.status).toBe(422);
	});
});

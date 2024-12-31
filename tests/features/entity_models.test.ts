import { describe, it, expect, beforeAll } from "vitest";
import { server } from "../../src/router.js";
import { EntityModelFactory } from "../../src/services/database/factories.js";
import { EntityModel, NewEntityModel } from "../../src/types/index.js";
import { getAccessTokenForTest } from "../../src/utils/test_utils.js";
import { getHttpServerConfig } from "@/services/config/config.js";

const { port } = getHttpServerConfig();

let access_token: string;
const SUCCESS_REF_ID = `T${Math.floor(Math.random() * 99)}`;

async function makeRequest(data: NewEntityModel | EntityModel, method: string, endpoint: string): Promise<Response> {
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

describe("Entity Model API", () => {
	it("should create a valid entity model", async () => {
		const test_data = new EntityModelFactory().make();
		test_data.ref_id = SUCCESS_REF_ID;

		const res = await makeRequest(test_data, "POST", "/api/entity-models");
		const json: EntityModel = (await res.json()) as EntityModel;

		expect(res.status).toBe(200);
		expect(json.id).toHaveLength(36);
	});

	it("should fail validation with invalid name", async () => {
		const test_data = new EntityModelFactory().make();
		test_data.name = "A".repeat(256);

		const res = await makeRequest(test_data, "POST", "/api/entity-models");

		expect(res.status).toBe(422);
	});

	it("should fail validation with repeated Ref ID", async () => {
		const test_data = new EntityModelFactory().make();
		test_data.ref_id = SUCCESS_REF_ID;

		const res = await makeRequest(test_data, "POST", "/api/entity-models");

		expect(res.status).toBe(422);
	});
});

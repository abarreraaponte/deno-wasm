import { describe, it, expect, beforeAll } from "vitest";
import { server } from "../../src/router.js";
import { TransactionModelFactory } from "../../src/services/database/factories.js";
import { NewTransactionModel, TransactionModel } from "../../src/types/index.js";
import { getAccessTokenForTest } from "../../src/utils/test_utils.js";

let access_token: string;
const SUCCESS_REF_ID = `T${Math.floor(Math.random() * 99)}`;

async function makeRequest(
	data: NewTransactionModel | TransactionModel,
	method: string,
	endpoint: string,
): Promise<Response> {
	const req = new Request(`http://localhost:${process.env.KL_SERVER_PORT}${endpoint}`, {
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

describe("Transaction Model API", () => {
	it("should create a valid transaction model", async () => {
		const test_data = new TransactionModelFactory().make();
		test_data.ref_id = SUCCESS_REF_ID;

		const res = await makeRequest(test_data, "POST", "/api/transaction-models");
		const json: TransactionModel = (await res.json()) as TransactionModel;

		expect(res.status).toBe(200);
		expect(json.id).toHaveLength(36);
	});

	it("should fail validation with invalid name", async () => {
		const test_data = new TransactionModelFactory().make();
		test_data.name = "A".repeat(256);

		const res = await makeRequest(test_data, "POST", "/api/transaction-models");

		expect(res.status).toBe(422);
	});

	it("should fail validation with repeated Ref ID", async () => {
		const test_data = new TransactionModelFactory().make();
		test_data.ref_id = SUCCESS_REF_ID;

		const res = await makeRequest(test_data, "POST", "/api/transaction-models");

		expect(res.status).toBe(422);
	});
});

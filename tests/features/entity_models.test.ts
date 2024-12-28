import { assertEquals } from '@std/assert/equals';
import { server } from '../../src/router.ts';
import { EntityModelFactory } from '../../src/services/database/factories.ts';
import { EntityModel, NewEntityModel } from '../../src/types/index.ts';
import { getAccessTokenForTest } from '../../src/utils/test_utils.ts';

const access_token = await getAccessTokenForTest();

async function makeRequest(data: NewEntityModel | EntityModel, method: string, endpoint: string): Promise<Response> {
	const req = new Request(
		`http://localhost:${Deno.env.get('KL_SERVER_PORT')}${endpoint}`,
		{
			method: method,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
			body: JSON.stringify(data),
		},
	);

	return await server.fetch(req);
}

const SUCCESS_REF_ID = `T${Math.floor(Math.random() * 99)}`;

Deno.test({
	name: 'Create a valid entity model',
	async fn() {
		const test_data = (new EntityModelFactory()).make();
		test_data.ref_id = SUCCESS_REF_ID;

		const res = await makeRequest(test_data, 'POST', '/api/entity-models');
		const json: EntityModel = await res.json();

		assertEquals(res.status, 200);
		assertEquals(json.id.length, 36);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});

Deno.test({
	name: 'Invalid name fails validation',
	async fn() {
		const test_data = (new EntityModelFactory()).make();
		test_data.name = 'A'.repeat(256);

		const res = await makeRequest(test_data, 'POST', '/api/entity-models');

		assertEquals(res.status, 422);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});

Deno.test({
	name: 'Repeated Ref ID fails validation',
	async fn() {
		const test_data = (new EntityModelFactory()).make();
		test_data.ref_id = SUCCESS_REF_ID;

		const res = await makeRequest(test_data, 'POST', '/api/entity-models');

		assertEquals(res.status, 422);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});

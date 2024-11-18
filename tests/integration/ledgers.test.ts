import { assertEquals } from '@std/assert/equals';
import { server } from '../../src/server.ts';
import { LedgerFactory, CurrencyFactory } from '../../src/database/factories.ts';
import CurrencyManager from '../../src/services/currencies/CurrencyManager.ts';

const currency = await (new CurrencyManager).create((new CurrencyFactory).make());

async function makeRequest(data: any, method: string, endpoint: string) : Promise<any>
{
	const req = new Request(`http://localhost:${Deno.env.get('KL_SERVER_PORT')}${endpoint}`, {
		method: method,
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	return await server.fetch(req);
}

const SUCCESS_REF_ID = `T${Math.floor(Math.random() * 99)}`;

Deno.test({
	name: 'Create a valid ledger',
	async fn() {
		const test_data = (new LedgerFactory).make();
		test_data.ref_id = SUCCESS_REF_ID;
		test_data.currency_id = currency[0].id;
		
		const res = await makeRequest(test_data, 'POST', '/api/ledgers');
		const json :any = await res.json();

		assertEquals(res.status, 200);
		assertEquals(json.id.length, 36);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});

Deno.test({
	name: 'Invalid name fails validation',
	async fn() {
		const test_data = (new LedgerFactory).make();
		test_data.name = 'A'.repeat(256);
		test_data.currency_id = currency[0].id;
		
		const res = await makeRequest(test_data, 'POST', '/api/ledgers');

		assertEquals(res.status, 422)
	},
	sanitizeOps: false,
});

Deno.test({
	name: 'Repeated Ref ID fails validation',
	async fn() {
		const test_data = (new LedgerFactory).make();
		test_data.ref_id = SUCCESS_REF_ID;
		test_data.currency_id = currency[0].id;

		const res = await makeRequest(test_data, 'POST', '/api/ledgers');

		assertEquals(res.status, 422);
	},
	sanitizeOps: false,
});
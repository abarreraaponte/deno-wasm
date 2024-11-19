import { assertEquals } from '@std/assert/equals';
import { server } from '../../src/handlers/http/http.ts';
import { LedgerFactory, AccountFactory, CurrencyFactory } from '../../src/services/database/factories.ts';
import { create } from '../../src/managers/LedgerManager.ts';
import { create as createCurrency } from '../../src/managers/CurrencyManager.ts';

const sameple_ledger_data = (new LedgerFactory()).make();
const currency = await createCurrency(
	(new CurrencyFactory()).make(),
);
sameple_ledger_data.currency_id = currency[0].id;
const ledger = await create(sameple_ledger_data);

async function makeRequest(
	data: any,
	method: string,
	endpoint: string,
): Promise<any> {
	const req = new Request(
		`http://localhost:${Deno.env.get('KL_SERVER_PORT')}${endpoint}`,
		{
			method: method,
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		},
	);

	return await server.fetch(req);
}

const SUCCESS_REF_ID = `T${Math.floor(Math.random() * 99)}`;

Deno.test({
	name: 'Create a valid account',
	async fn() {
		const test_data = (new AccountFactory()).make();
		test_data.ref_id = SUCCESS_REF_ID;
		test_data.ledger_id = ledger[0].id;

		const res = await makeRequest(test_data, 'POST', '/api/accounts');
		const json: any = await res.json();

		assertEquals(res.status, 200);
		assertEquals(json.id.length, 36);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});

Deno.test({
	name: 'Invalid name fails validation',
	async fn() {
		const test_data = (new AccountFactory()).make();
		test_data.name = 'A'.repeat(256);
		test_data.ledger_id = ledger[0].id;

		const res = await makeRequest(test_data, 'POST', '/api/accounts');

		assertEquals(res.status, 422);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});

Deno.test({
	name: 'Repeated Ref ID fails validation',
	async fn() {
		const test_data = (new AccountFactory()).make();
		test_data.ref_id = SUCCESS_REF_ID;
		test_data.ledger_id = ledger[0].id;

		const res = await makeRequest(test_data, 'POST', '/api/accounts');

		assertEquals(res.status, 422);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});


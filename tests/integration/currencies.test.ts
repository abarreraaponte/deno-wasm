import { assertEquals } from "@std/assert";
import { server } from '../../src/server.ts';
import { CurrencyFactory } from '../../src/database/factories.ts';

const SUCCESS_ISO_CODE = `T${Math.floor(Math.random() * 99)}`;

async function makeRequest(data: any, method: string, endpoint: string) : Promise<any>
{

	console.table(Deno.env.toObject());

	const req = new Request(`http://localhost:${Deno.env.get('KL_SERVER_PORT')}${endpoint}`, {
		method: method,
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	return await server.fetch(req);
}

Deno.test({
	name: 'Create a valid currency',
	async fn() {
		const test_data = (new CurrencyFactory).make();
		test_data.iso_code = SUCCESS_ISO_CODE;
		
		const res = await makeRequest(test_data, 'POST', '/api/currencies');
		const json :any = await res.json();

		assertEquals(json.iso_code, SUCCESS_ISO_CODE);
		assertEquals(String(json.id).length, 36);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});

Deno.test({
	name: 'Invalid separators fail validation',
	async fn() {
		const test_data = (new CurrencyFactory).make();
		test_data.iso_code = SUCCESS_ISO_CODE;
		test_data.decimal_separator = "-";
		test_data.thousands_separator = "#";
		
		const res = await makeRequest(test_data, 'POST', '/api/currencies');

		assertEquals(res.status, 422)
	},
	sanitizeOps: false,
});

Deno.test({
	name: 'Repeated ISO Code fails validation',
	async fn() {
		const test_data = (new CurrencyFactory).make();
		test_data.iso_code = SUCCESS_ISO_CODE;

		const res = await makeRequest(test_data, 'POST', '/api/currencies');

		assertEquals(res.status, 422);
	},
	sanitizeOps: false,
});
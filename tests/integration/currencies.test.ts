import { describe, expect, test, afterAll } from 'vitest'
import { config } from 'dotenv';
import { server } from '@/server.js';
import { CurrencyFactory } from '@/database/factories.js';

config();

describe('Currency endpoints and common actions', () => {

	async function makeRequest(data: any, method: string, endpoint: string) : Promise<any>
	{
		const req = new Request(`http://localhost:${process.env.SERVER_PORT}${endpoint}`, {
			method: method,
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
	
		return await server.fetch(req);
	}

	const SUCCESS_ISO_CODE = `T${Math.floor(Math.random() * 99)}`;

	test('Create a valid currency', async () => {
		const test_data = (new CurrencyFactory).make();
		test_data.iso_code = SUCCESS_ISO_CODE;
		
		const res = await makeRequest(test_data, 'POST', '/api/currencies');
		const json :any = await res.json();
	
		expect(res.status).toBe(200);
		expect(json.id).toHaveLength(36);
	});

	test('Invalid separators fail validation', async () => {
		const test_data = (new CurrencyFactory).make();
		test_data.iso_code = SUCCESS_ISO_CODE;
		test_data.decimal_separator = "-";
		test_data.thousands_separator = "#";
		
		const res = await makeRequest(test_data, 'POST', '/api/currencies');
	
		expect(res.status).toBe(422);
	});

	test('Repeated ISO Code fails validation', async () => {
		const test_data = (new CurrencyFactory).make();
		test_data.iso_code = SUCCESS_ISO_CODE;
	
		const res = await makeRequest(test_data, 'POST', '/api/currencies');
	
		expect(res.status).toBe(422);
	});
});
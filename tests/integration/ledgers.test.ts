import { describe, expect, test } from 'vitest'
import { config } from 'dotenv';
import { server } from '@/server.js';
import { LedgerFactory, CurrencyFactory } from '@/database/factories.js';
import CurrencyManager from '@/services/currencies/CurrencyManager.js';

config();

describe('Ledger endpoints and common actions', async () => {

	const currency = await (new CurrencyManager).create((new CurrencyFactory).make());

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

	const SUCCESS_REF_ID = `T${Math.floor(Math.random() * 99)}`;

	test('Create a valid ledger', async () => {
		const test_data = (new LedgerFactory).make();
		test_data.ref_id = SUCCESS_REF_ID;
		test_data.currency_id = currency[0].id;
		
		const res = await makeRequest(test_data, 'POST', '/api/ledgers');
		const json :any = await res.json();
	
		expect(res.status).toBe(200);
		expect(json.id).toHaveLength(36);
	});

	test('Invalid name fails validation', async () => {
		const test_data = (new LedgerFactory).make();
		test_data.name = 'A'.repeat(256);
		test_data.currency_id = currency[0].id;
		
		const res = await makeRequest(test_data, 'POST', '/api/ledgers');
	
		expect(res.status).toBe(422);
	});

	test('Repeated Ref ID fails validation', async () => {
		const test_data = (new LedgerFactory).make();
		test_data.ref_id = SUCCESS_REF_ID;
		test_data.currency_id = currency[0].id;
	
		const res = await makeRequest(test_data, 'POST', '/api/ledgers');
	
		expect(res.status).toBe(422);
	});
});
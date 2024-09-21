import { describe, expect, test } from 'vitest'
import { config } from 'dotenv';
import { server } from '@/server';
import { ulid } from 'ulidx';

config();

describe('Currency endpoints and common actions', () => {
	test('Create a valid currency', async () => {
		const test_data = {
			"name": `Test currency ${ulid()}`,
			"symbol": "$",
			"iso_code": `T${Math.floor(Math.random() * 99999)}`,
			"precision": Math.floor(Math.random() * 9),
			"decimal_separator": ".",
			"thousands_separator": ","
		};
	
		const req = new Request(`http://localhost:${process.env.SERVER_PORT}/api/currencies`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(test_data),
		});
	
		const res = await server.fetch(req);
	
		const json :any = await res.json();
	
		expect(res.status).toBe(200);
		expect(json.id).toHaveLength(26);
	});
});
import { Hono } from 'hono'
import CurrencyManager from '@/currencies/CurrencyManager';
import { ulid } from 'ulidx';

const router = new Hono();

router.post('/currencies', async (c) => {
	const currencyManager = new CurrencyManager();
	const body = await c.req.json();
	body.id = ulid();

	const validated_data = await currencyManager.validateCurrencyCreation(body);

	// Return 422 if Zod Error
	if(validated_data.success === false)
	{
		return c.json(validated_data.error.issues, 422);
	}

	try {
		const result = await currencyManager.createCurrency(validated_data.data);
		return c.json(result[0]);
	}
	
	catch (error) {
		// IMPLEMENT_LOGGER
		console.error(error);
		return c.json({ message: 'An unknown error occurred' }, 500);
	}
});

export default router;
import { Hono } from 'hono'
import CurrencyManager from '@/currencies/CurrencyManager';
import { ulid } from 'ulidx';

const router = new Hono();
const GENERIC_ERROR_MESSAGE = 'Internal server error';

router.post('/currencies', async (c) => {
	const currencyManager = new CurrencyManager();
	const body = await c.req.json();
	body.id = ulid();

	const validation_result = await currencyManager.validateCurrencyCreation(body);

	// Return 422 if Zod Error
	if(!validation_result.success)
	{
		return c.json(validation_result.error.issues, 422);
	}

	try {
		const result = await currencyManager.createCurrency(validation_result.data);
		return c.json(result[0]);
	}
	
	catch (error) {
		// IMPLEMENT_LOGGER
		console.error(error);
		return c.json({ message: GENERIC_ERROR_MESSAGE }, 500);
	}
});

export default router;
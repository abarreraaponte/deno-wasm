import { Hono } from 'hono'
import LedgerManager from '@/ledgers/LedgerManager';
import { ulid } from 'ulidx';

const router = new Hono();
const GENERIC_ERROR_MESSAGE = 'Internal server error';

router.post('/ledgers', async (c) => {
	const ledgerManager = new LedgerManager();
	const body = await c.req.json();
	body.id = ulid();

	const validation_result = await ledgerManager.validateLedgerCreation(body);

	if(!validation_result.success)
	{
		return c.json(validation_result.error.issues, 422);
	}

	try {
		const result = await ledgerManager.createLedger(validation_result.data);
		return c.json(result[0]);
	}

	catch(error) {
		// IMPLEMENT_LOGGER
		console.error(error);
		return c.json({ message: GENERIC_ERROR_MESSAGE }, 500);
	}
});

export default router;
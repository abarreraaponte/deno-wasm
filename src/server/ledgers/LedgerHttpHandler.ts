import { Hono } from 'hono'
import LedgerManager from '@server/ledgers/LedgerManager';
import { v7 as uuid } from 'uuid';

const router = new Hono();
const GENERIC_ERROR_MESSAGE = 'Internal server error';

router.post('/', async (c) => {
	const ledgerManager = new LedgerManager();
	const body = await c.req.json();
	body.id = uuid();

	const validation_result = await ledgerManager.validateCreation(body);

	if(!validation_result.success)
	{
		return c.json(validation_result.error.issues, 422);
	}

	try {
		const result = await ledgerManager.create(validation_result.data);
		return c.json(result[0]);
	}

	catch(error) {
		// IMPLEMENT_LOGGER
		console.error(error);
		return c.json({ message: GENERIC_ERROR_MESSAGE }, 500);
	}
});

export default router;
import { Hono } from "hono";
import AccountManager, { NewAccount } from "@/accounts/AccountManager";
import { ulid } from "ulidx";

const router = new Hono();
const GENERIC_ERROR_MESSAGE = 'Internal server error';

router.post('/', async (c) => {
	const accountManager = new AccountManager();
	const body = await c.req.json();
	body.id = ulid();

	const validation_result = await accountManager.validateCreation(body);

	// Return 422 if Zod Error
	if(!validation_result.success)
	{
		return c.json(validation_result.error.issues, 422);
	}

	try {
		const result = await accountManager.create(validation_result.data as NewAccount);
		return c.json(result[0]);
	}
	
	catch (error) {
		// IMPLEMENT_LOGGER
		console.error(error);
		return c.json({ message: GENERIC_ERROR_MESSAGE }, 500);
	}
});

export default router;
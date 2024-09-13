import { users, organizations } from "@core/database/schema";
import { db } from "@core/database/db";
import { eq, InferInsertModel, InferSelectModel } from "drizzle-orm";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Organization = InferSelectModel<typeof organizations>;

export async function getAuthenticatedUser() {
	const user_id = '01J74QGCRBCW3A1TX1MPNP03CK';

	return db.query.users.findFirst({
		where: eq(users.id, user_id),
		with: {
			organization_users: {
				with: {
					organization: true
				}
			},

		}
	});

	// write the query with the select syntax, include organizations through the organization_users table.
	/*return await db
		.select({
		user: users,
		organization: organizations,
		})
		.from(users)
		.leftJoin(
		organization_users,
		eq(users.id, organization_users.user_id)
		)
		.leftJoin(
		organizations,
		eq(organization_users.organization_id, organizations.id)
		)
		.where(eq(users.id, user_id));*/
}
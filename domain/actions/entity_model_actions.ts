import { db } from '../../infrastructure/database/db.ts';
import { entity_models } from '../../infrastructure/database/schema.ts';
import z from 'zod';
import { eq, InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { value_is_available } from '../../infrastructure/database/validation.ts';

export type EntityModel = InferSelectModel<typeof entity_models>;
export type NewEntityModel = InferInsertModel<typeof entity_models>;
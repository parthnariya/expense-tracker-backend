import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const spaces = pgTable('spaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Space = typeof spaces.$inferSelect;
export type NewSpace = typeof spaces.$inferInsert;

import { sql } from 'drizzle-orm';
import { serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createTable } from 'src/common/utils/create-table';

export const BookmarkSchema = createTable('bookmark', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 256 }).notNull(),
  url: varchar('url', { length: 256 }).notNull(),
  title: varchar('title', { length: 512 }).notNull(),
  description: varchar('description', { length: 4000 }),
  faviconUrl: varchar('favicon_url', { length: 512 }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .$onUpdate(() => new Date())
    .notNull(),
});

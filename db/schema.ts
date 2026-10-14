import {sqliteTable,text,index} from 'drizzle-orm/sqlite-core';
export const inquiries=sqliteTable('inquiries',{
  id:text('id').primaryKey(), reference:text('reference').notNull(), createdAt:text('created_at').notNull(),
  name:text('name').notNull(),contact:text('contact').notNull(),goal:text('goal').notNull(),
  budget:text('budget').notNull(),message:text('message').notNull(),selectionJson:text('selection_json').notNull(),
  status:text('status').notNull().default('new'),
},table=>[index('inquiries_contact_created').on(table.contact,table.createdAt)]);

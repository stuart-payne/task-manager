import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tasksTable = sqliteTable("Tasks", {
	id: integer().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	description: text().notNull(),
	statusId: integer().references(() => taskStatusTable.id),
	dateCreated: integer({ mode: 'timestamp' }),
});

export const taskStatusTable = sqliteTable("TaskStatus", {
	id: integer().primaryKey({ autoIncrement: true }),
	status: text().notNull(),
});

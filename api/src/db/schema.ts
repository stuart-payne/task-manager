import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tasksTable = sqliteTable("Task", {
	id: integer().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	description: text().notNull(),
	statusId: integer().references(() => taskStatusTable.id),
	priorityId: integer().references(() => priorityTable.id),
	effort: integer(),
	dateCreated: integer({ mode: 'timestamp' }),
});

export const taskStatusTable = sqliteTable("TaskStatus", {
	id: integer().primaryKey({ autoIncrement: true }),
	status: text().notNull(),
});

export const priorityTable = sqliteTable("Priority", {
	id: integer().primaryKey({ autoIncrement: true }),
	priority: text().notNull(),
});

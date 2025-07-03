import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { priorityTable, tasksTable, taskStatusTable } from './db/schema'
import { or, like, eq, and } from 'drizzle-orm';
import express from 'express';
import * as z from 'zod/v4';

const db = drizzle(process.env.DB_FILE_NAME!);

const app = express();
app.use(express.json());
const port = 3000;

const zValidateIdString = z.preprocess((val) => {
	if (typeof val === "string") {
		return Number.parseInt(val);
	}
	return val;
}, z.int());

const getQuerySchema = z.object({
	search: z.optional(z.string()),
	statusId: z.optional(zValidateIdString),
	priorityId: z.optional(zValidateIdString),
})

app.get("/api/taskStatuses", async (_, res) => {

	try {
		const taskStatuses = await db.select().from(taskStatusTable);
		res.json(taskStatuses.map((s) => ({ id: s.id, name: s.status })));
		return;
	} catch (err) {
		console.log(err);
		res.status(500).send();
		return;
	}
});

app.get("/api/priorities", async (_, res) => {

	try {
		const priorities = await db.select().from(priorityTable);
		res.json(priorities.map(p => ({ id: p.id, name: p.priority })));
		return;
	} catch (err) {
		console.log(err);
		res.status(500).send();
		return;
	}
});

app.get("/api/task", async (req, res) => {
	const parsedQuery = getQuerySchema.safeParse(req.query);
	if (!parsedQuery.success) {
		res.status(400).send();
		return;
	}

	const { search, statusId, priorityId } = parsedQuery.data;

	try {
		const tasks = await db.select({
			id: tasksTable.id,
			name: tasksTable.name,
			description: tasksTable.description,
			priorityId: tasksTable.priorityId,
			statusId: tasksTable.statusId,
			effort: tasksTable.effort,
			status: taskStatusTable.status,
			priority: priorityTable.priority,
		})
			.from(tasksTable)
			.leftJoin(taskStatusTable, eq(tasksTable.statusId, taskStatusTable.id))
			.leftJoin(priorityTable, eq(tasksTable.priorityId, priorityTable.id))
			.where(
				and(
					search ? or(
						like(tasksTable.name, `%${search}%`),
						like(tasksTable.description, `%${search}%`)
					) : undefined,
					statusId ? eq(tasksTable.statusId, statusId) : undefined,
					priorityId ? eq(tasksTable.priorityId, priorityId) : undefined,
				)
			)
		res.json(tasks);
		return;
	} catch (err) {
		console.log(err);
		res.status(500).send();
		return;
	}
});


const paramSchema = zValidateIdString;
const postBodySchema = z.object({
	name: z.string(),
	description: z.string(),
	statusId: zValidateIdString,
	effort: z.int(),
	priorityId: zValidateIdString,
});

app.post("/api/task/", async (req, res) => {
	console.log(req.body);
	const parsedBody = postBodySchema.safeParse(req.body);
	if (!parsedBody.success) {
		console.log(parsedBody.error);
		res.status(400).send();
		return;
	}


	try {
		await db.insert(tasksTable).values(parsedBody.data);
		res.status(200).send();
	} catch (err) {
		console.log(err);
		res.status(500).send();
		return;
	}
});


const putBodySchema = z.object({
	statusId: zValidateIdString,
	name: z.string(),
	description: z.string(),
	priorityId: zValidateIdString,
	effort: z.int(),
});

app.put("/api/task/:id", async (req, res) => {
	const parsedParam = paramSchema.safeParse(req.params.id);
	if (!parsedParam.success) {
		res.status(400).send();
		return;
	}

	const parsedBody = putBodySchema.safeParse(req.body);
	if (!parsedBody.success) {
		res.status(400).send();
		return;
	}

	const { name, description, statusId, priorityId, effort } = parsedBody.data;

	try {
		await db.update(tasksTable).set({ name, description, statusId, priorityId, effort }).where(eq(tasksTable.id, parsedParam.data));
		res.status(200).send();
	} catch (err) {
		console.log(err);
		res.status(500).send();
		return;
	}
});


app.delete("/api/task/:id", async (req, res) => {
	const parsedParam = paramSchema.safeParse(req.params.id);
	if (!parsedParam.success) {
		res.status(400).send();
		return;
	}
	try {
		await db.delete(tasksTable).where(eq(tasksTable.id, parsedParam.data));
		res.status(200).send();
	} catch (err) {
		console.log(err);
		res.status(500).send();
		return;
	}
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
})

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { tasksTable, taskStatusTable } from './db/schema'
import { or, like, eq } from 'drizzle-orm';
import express from 'express';
import * as z from 'zod/v4';

const db = drizzle(process.env.DB_FILE_NAME!);

const app = express();
const port = 3000;

const getQuerySchema = z.object({
	search: z.optional(z.string()),
})

app.get("/taskStatuses", async (_, res) => {

	try {
		const taskStatuses = await db.select().from(taskStatusTable);
		res.send(taskStatuses);
		return;
	} catch (err) {
		// proper logging for a production app
		console.log(err);
		res.status(500).send();
		return;
	}
});

app.get("/task", async (req, res) => {
	const parsedQuery = getQuerySchema.safeParse(req.query);
	if (!parsedQuery.success) {
		res.status(400).send();
		return;
	}

	try {
		if (parsedQuery.data.search !== undefined) {
			const tasks = await db.select()
				.from(tasksTable)
				.leftJoin(taskStatusTable, eq(tasksTable.statusId, taskStatusTable.id))
				.where(
					or(
						like(tasksTable.name, parsedQuery.data.search),
						like(tasksTable.description, parsedQuery.data.search)
					)
				);
			res.send(tasks);
			return;
		} else {
			const tasks = await db.select()
				.from(tasksTable)
				.leftJoin(taskStatusTable, eq(tasksTable.statusId, taskStatusTable.id));

			res.send(tasks);
			return;
		}
	} catch (err) {
		console.log(err);
		res.status(500).send();
		return;
	}
});


const paramSchema = z.int();
const postBodySchema = z.object({
	name: z.string(),
	description: z.string(),
});

app.post("/task/:id", async (req, res) => {
	const parsedQuery = paramSchema.safeParse(req.params.id);
	if (!parsedQuery.success) {
		res.status(400).send();
		return;
	}

	const parsedBody = postBodySchema.safeParse(req.body);
	if (!parsedBody.success) {
		res.status(400).send();
		return;
	}

	const { name, description } = parsedBody.data;

	try {
		await db.insert(tasksTable).values({ name, description })
	} catch (err) {
		console.log(err);
		res.status(500).send();
		return;
	}
});


const putBodySchema = z.object({
	statusId: z.int(),
	name: z.string(),
	description: z.string(),
});

app.put("/task/:id", async (req, res) => {
	const parsedQuery = paramSchema.safeParse(req.params.id);
	if (!parsedQuery.success) {
		res.status(400).send();
		return;
	}

	const parsedBody = putBodySchema.safeParse(req.body);
	if (!parsedBody.success) {
		res.status(400).send();
		return;
	}

	const { name, description, statusId } = parsedBody.data;

	try {
		await db.update(tasksTable).set({ name, description, statusId })
	} catch (err) {
		console.log(err);
		res.status(500).send();
		return;
	}
});


app.delete("/task/:id", async (req, res) => {
	const parsedQuery = paramSchema.safeParse(req.params.id);
	if (!parsedQuery.success) {
		res.status(400).send();
		return;
	}

	const parsedBody = putBodySchema.safeParse(req.body);
	if (!parsedBody.success) {
		res.status(400).send();
		return;
	}

	const { name, description, statusId } = parsedBody.data;

	try {
		await db.update(tasksTable).set({ name, description, statusId })
	} catch (err) {
		console.log(err);
		res.status(500).send();
		return;
	}
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
})

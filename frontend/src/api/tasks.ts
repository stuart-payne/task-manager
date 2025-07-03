const baseUrl = `${import.meta.env.VITE_HOSTNAME}`;

export type GetTasksParams = { search: string | null, statusId: string | null, priorityId: string | null };

const headers = {
	"Content-Type": "application/json"
};

export const getTasks = async ({ search, statusId, priorityId }: GetTasksParams
) => {
	const url = new URL("/api/task", baseUrl);
	if (search !== null && search !== '') {
		url.searchParams.set("search", search);
	}
	if (statusId !== null && statusId !== "-1") {
		url.searchParams.set("statusId", statusId);
	}
	if (priorityId !== null && priorityId !== "-1") {
		url.searchParams.set("priorityId", priorityId);
	}
	const response = await fetch(url, { headers });
	if (!response.ok) {
		throw new Error("Get tasks failed");
	}

	return response.json();
};

export type PostTaskParams = { name: string, description: string, effort: string, priorityId: string };

export const postTasks = async (params: PostTaskParams) => {
	const url = new URL("/api/task", baseUrl);
	const response = await fetch(url, {
		method: "POST",
		body: JSON.stringify({ ...params, effort: Number.parseInt(params.effort) }),
		headers
	});
	if (!response.ok) {
		throw new Error('Post task failed');
	}
	return;
};

export type PutTaskParams = {
	id: number,
	name: string,
	description: string,
	effort: string,
	priorityId: string,
	statusId: string
};

export const putTasks = async ({ id, name, description, effort, priorityId, statusId }: PutTaskParams) => {
	const url = new URL(`/api/task/${id}`, baseUrl);
	const response = await fetch(url, {
		method: "PUT",
		body: JSON.stringify({ name, description, priorityId, statusId, effort: Number.parseInt(effort) }),
		headers
	});
	if (!response.ok) {
		throw new Error('Post task failed');
	}
	return;
};

export type DeleteTaskParams = { id: number };

export const deleteTasks = async ({ id }: DeleteTaskParams) => {
	const url = new URL(`/api/task/${id}`, baseUrl);
	const response = await fetch(url, {
		method: "DELETE",
	});
	if (!response.ok) {
		throw new Error('Post task failed');
	}
	return;
};

export const getTaskStatuses = async () => {
	const url = new URL(`/api/taskStatuses`, baseUrl);
	const response = await fetch(url, { headers });
	if (!response.ok) {
		throw new Error("Get statuses failed");
	}

	return response.json();
};

export const getPriorities = async () => {
	const url = new URL(`/api/priorities`, baseUrl);
	const response = await fetch(url, { headers });
	if (!response.ok) {
		throw new Error("Get priorities failed");
	}

	return response.json();
}; 

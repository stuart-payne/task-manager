const baseUrl = `${process.env.HOSTNAME}`;

export type GetTasksParams = { search: string | null, statusId: number | null };

export const getTasks = async ({ search, statusId }: GetTasksParams
) => {
	const url = new URL("/task", baseUrl);
	if (search !== null) {
		url.searchParams.set("search", search);
	}
	if (statusId !== null) {
		url.searchParams.set("statusId", statusId.toString());
	}
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error("Get tasks failed");
	}

	return response.json();
};

export type PostTaskParams = { name: string, description: string, effort: number, priorityId: string };

export const postTasks = async (params: PostTaskParams) => {
	const url = new URL("/task", baseUrl);
	return await fetch(url, {
		method: "POST",
		body: JSON.stringify(params)
	});
};

export type PutTaskParams = { id: number, name: string, description: string, effort: number, priorityId: string };

export const putTasks = async ({ id, name, description, effort, priorityId }: PutTaskParams) => {
	const url = new URL(`/task/${id}`, baseUrl);
	return fetch(url, {
		method: "PUT",
		body: JSON.stringify({ name, description, effort, priorityId })
	});
};

export type DeleteTaskParams = { id: number };

export const deleteTasks = async ({ id }: DeleteTaskParams) => {
	const url = new URL(`/task/${id}`, baseUrl);
	return fetch(url, {
		method: "DELETE",
	});
};

export const getTaskStatuses = async () => {
	const url = new URL(`/taskStatuses`, baseUrl);
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error("Get statuses failed");
	}

	return response.json();
};

export const getPriorities = async () => {
	const url = new URL(`/priorities`, baseUrl);
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error("Get priorities failed");
	}

	return response.json();
}; 

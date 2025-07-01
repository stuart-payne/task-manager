import type { Task } from '../types';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod/v4';
import { postTasks, putTasks } from '../api/tasks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PriorityDropdown } from './Dropdowns';


type Props = { mode: 'edit', task: Task } | { mode: 'create', task: undefined }

const formSchema = z.object({
	name: z.string().min(1).max(30),
	description: z.string().min(1).max(1000),
	statusId: z.string(),
	priorityId: z.string(),
	effort: z.int().max(5).min(1),
});

function TaskForm({ mode, task }: Props) {
	const queryClient = useQueryClient();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: mode === "create" ? {
			name: "",
			description: "",
			statusId: "1",
			priorityId: "1",
			effort: 1,
		} : {
			name: task.name,
			description: task.description,
			statusId: task.statusId.toString(),
			priorityId: task.priorityId.toString(),
			effort: task.effort,
		},
	});

	const taskCreate = useMutation({
		mutationFn: postTasks,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['task'] });
		}
	});

	const taskUpdate = useMutation({
		mutationFn: putTasks,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['task'] });
		}
	});

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		if (mode === 'edit') {
			taskUpdate.mutate({ id: task.id, ...values });
		} else {
			taskCreate.mutate(values);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="Title" {...field} />
							</FormControl>
							<FormDescription>
								Task title.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="Title" {...field} />
							</FormControl>
							<FormDescription>
								Task title.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}

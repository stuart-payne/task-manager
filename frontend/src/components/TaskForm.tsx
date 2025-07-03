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
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PriorityDropdown, StatusDropdown } from './Dropdowns';
import { toast } from "sonner"

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"


type FormProps = { mode: 'edit', task: Task, onSuccess: () => void } | { mode: 'create', task: undefined, onSuccess: () => void };

const formSchema = z.object({
	name: z.string().min(1).max(30),
	description: z.string().min(1).max(1000),
	statusId: z.string(),
	priorityId: z.string(),
	effort: z.string(),
});

export function TaskForm({ mode, task, onSuccess }: FormProps) {
	const queryClient = useQueryClient();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: mode === "create" ? {
			name: "",
			description: "",
			statusId: "1",
			priorityId: "1",
			effort: "1",
		} : {
			name: task.name,
			description: task.description,
			statusId: task.statusId.toString(),
			priorityId: task.priorityId.toString(),
			effort: task.effort.toString(),
		},
	});

	const taskCreate = useMutation({
		mutationFn: postTasks,
		onError: () => {
			toast("Task creation failed. Please try again.");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['task'] });
			toast("Task successfully created.");
		}
	});

	const taskUpdate = useMutation({
		mutationFn: putTasks,
		onError: () => {
			toast("Task failed to update.");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['task'] });
			onSuccess();
			toast("Task successfully updated.");
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
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea placeholder="description" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex flex-row flex-start gap-12">
					<FormField
						control={form.control}
						name="priorityId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Priority</FormLabel>
								<FormControl>
									<PriorityDropdown {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="statusId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Status</FormLabel>
								<FormControl>
									<StatusDropdown {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name="effort"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Effort</FormLabel>
							<FormControl>
								<Input className="w-[180px]" type="number" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">{mode === "create" ? "Create" : "Update"}</Button>
			</form>
		</Form>
	);
}

type TaskDialogProps = {
	open: boolean;
	onClose: () => void;
} & FormProps;

export function TaskDialog({ open, onClose, ...formProps }: TaskDialogProps) {
	return (
		<Dialog open={open} onOpenChange={open => { if (!open) onClose(); return; }}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Task</DialogTitle>
					<DialogDescription>
						{formProps.mode === "create" ? "Create a task" : "Edit task"}
					</DialogDescription>
					<TaskForm {...formProps} />
				</DialogHeader>
			</DialogContent>
		</Dialog >
	);
}


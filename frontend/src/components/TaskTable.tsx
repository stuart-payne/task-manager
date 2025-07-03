import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import type { Task } from "@/types";
import { Button } from "@/components/ui/button"
import { PencilIcon, TrashIcon } from "lucide-react"
import { deleteTasks } from '../api/tasks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type Props = { editTask: (task: Task) => void, data: Task[] };

export function TaskTable({ data, editTask }: Props) {
	const queryClient = useQueryClient();
	const deleteTask = useMutation({
		mutationFn: deleteTasks,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['task'] });
			toast("Task successfully deleted");
		}
	});
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="text-center">Title</TableHead>
					<TableHead className="text-center">Status</TableHead>
					<TableHead className="text-center">Priority</TableHead>
					<TableHead className="text-center">Effort</TableHead>
					<TableHead className="text-center">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((t) => {
					return (
						<TableRow key={t.id}>
							<TableCell className="text-center">{t.name}</TableCell>
							<TableCell className="text-center">{t.status}</TableCell>
							<TableCell className="text-center">{t.priority}</TableCell>
							<TableCell className="text-center">{t.effort}</TableCell>
							<TableCell className="w-[120px]">
								<div className="flex flex-row gap-2">
									<Button variant="secondary" className="size-8" size="icon" onClick={() => editTask(t)}>
										<PencilIcon />
									</Button>
									<Button variant="destructive" className="size-8" size="icon" onClick={() => deleteTask.mutate({ id: t.id })}>
										<TrashIcon />
									</Button>
								</div>
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}

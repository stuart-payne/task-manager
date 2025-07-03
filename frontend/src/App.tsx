import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTasks } from './api/tasks';
import './App.css'
import { PriorityDropdown, StatusDropdown } from './components/Dropdowns';
import { TaskTable } from './components/TaskTable';
import { LoaderIcon } from "lucide-react"
import type { Task } from './types';
import { TaskDialog } from './components/TaskForm';
import { Input } from './components/ui/input';
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"

type FormState = {
	mode: 'edit',
	task: Task,
} | {
	mode: 'create',
	task: undefined,
} | null;

import { Button } from "@/components/ui/button"

function App() {
	const queryClient = useQueryClient();

	const [searchTerm, setSearchTerm] = useState('');
	const [filteredStatusId, setFilteredStatusId] = useState<string | null>(null);
	const [filteredPriorityId, setFilteredPriorityId] = useState<string | null>(null);
	const [formState, setFormState] = useState<FormState>(null);

	const { isFetching, data, isError, isSuccess } = useQuery<Task[]>({
		queryKey: ['task'],
		queryFn: () => getTasks({ search: searchTerm, statusId: filteredStatusId, priorityId: filteredPriorityId }),
	});

	useEffect(() => {
		queryClient.invalidateQueries({ queryKey: ['task'] });
	}, [filteredStatusId, filteredPriorityId, searchTerm]);


	return (
		<div className="w-full">
			<div className="w-full flex flex-row items-center justify-center gap-8">
				<div className="grid w-full max-w-sm items-center gap-3">
					<Input
						placeholder="Search"
						className="w-[240px]"
						value={searchTerm}
						onChange={(e) => {
							setSearchTerm(e.target.value);
						}}
					/>
				</div>
				<PriorityDropdown
					onChange={(p) => {
						setFilteredPriorityId(p);
					}} value={filteredPriorityId}
				/>
				<StatusDropdown
					onChange={(s) => {
						setFilteredStatusId(s);
					}}
					value={filteredStatusId}
				/>
				<Button onClick={() => { setFormState({ mode: 'create', task: undefined }) }}>Add Task</Button>
			</div>
			<div className="mt-12 flex flex-row justify-center">
				{isFetching && (
					<LoaderIcon className="animate-spin" />
				)
				}
				{isSuccess && data.length > 0 && (
					<TaskTable data={data} editTask={(task: Task) => setFormState({ mode: 'edit', task, })} />
				)}
				{formState !== null && (
					<TaskDialog onClose={() => setFormState(null)} onSuccess={() => setFormState(null)} open={formState !== null} {...formState} />
				)}
				{isError && (
					<Alert className="w-[480px]" variant="destructive">
						<AlertCircleIcon />
						<AlertTitle>Failed to fetch tasks</AlertTitle>
					</Alert>
				)}
				{
					!isError && data !== undefined && data.length === 0 && (
						<Alert className="w-[320px]" variant="default">
							<AlertDescription>
								No tasks found
							</AlertDescription>
						</Alert>
					)
				}
			</div>
		</div>
	)
}

export default App

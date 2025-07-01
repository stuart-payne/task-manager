import { useState } from 'react'
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getTasks, getTaskStatuses, postTasks, putTasks, deleteTasks } from './api/tasks';
import './App.css'


const appQueryClient = new QueryClient();

function App() {
	const queryClient = useQueryClient();

	const [searchTerm, setSearchTerm] = useState('');
	const [filteredStatusId, setFilteredStatusId] = useState(null);
	const [filteredPriority, setFilteredPriorityId] = useState(null);

	const { isFetching, data, isError } = useQuery({
		queryKey: ['task'],
		queryFn: () => getTasks({ search: searchTerm, statusId: filteredStatusId }),
	});



	return (
		<QueryClientProvider client={appQueryClient}>
			<div className="w-full">
				<div className="flex flex-row items-center">

				</div>
			</div>
		</QueryClientProvider>
	)
}

export default App

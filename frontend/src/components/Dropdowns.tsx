import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { getTaskStatuses, getPriorities } from '../api/tasks';
import { LoaderIcon } from "lucide-react"

import type { DropdownOption } from "@/types";
import { useQuery } from '@tanstack/react-query';

type DropdownProps = { onChange: (id: string) => void, value: string };

export function StatusDropdown({ onChange, value }: DropdownProps) {
	const { isFetching, data } = useQuery<DropdownOption[]>({
		queryKey: ['statuses'],
		queryFn: () => getTaskStatuses(),
	});

	return (
		<Dropdown data={data} isFetching={isFetching} onChange={onChange} placeholder="Status" value={value} />
	);
};

export function PriorityDropdown({ onChange, value }: DropdownProps) {
	const { isFetching, data } = useQuery<DropdownOption[]>({
		queryKey: ['priorities'],
		queryFn: () => getPriorities(),
	});

	return (
		<Dropdown data={data} isFetching={isFetching} onChange={onChange} placeholder="Priority" value={value} />
	);
};

function Dropdown({
	data,
	onChange,
	isFetching,
	placeholder,
	value,
}: {
	data: DropdownOption[] | undefined,
	onChange: (id: string) => void,
	isFetching: boolean,
	placeholder: string,
	value: string,
}) {
	return (
		<Select onValueChange={onChange} value={value}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder={placeholder} />
				{isFetching && (
					<LoaderIcon className="animate-spin" />
				)}
			</SelectTrigger>
			<SelectContent>
				{data?.map((status) => (
					<SelectItem value={status.id.toString()}>{status.name}</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

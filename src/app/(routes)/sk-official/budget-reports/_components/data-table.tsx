"use client";

import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings2,
} from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
	[]
  );
  const [columnVisibility, setColumnVisibility] =
	React.useState<VisibilityState>({});

  const [search, setSearch] = React.useState("");

  const table = useReactTable({
	data,
	columns,
	getCoreRowModel: getCoreRowModel(),
	getPaginationRowModel: getPaginationRowModel(),
	onSortingChange: setSorting,
	getSortedRowModel: getSortedRowModel(),
	onColumnFiltersChange: setColumnFilters,
	getFilteredRowModel: getFilteredRowModel(),
	onColumnVisibilityChange: setColumnVisibility,
	state: {
	  sorting,
	  columnFilters,
	  columnVisibility,
	},
	initialState: {
	  pagination: {
		pageSize: 5,
	  },
	},
  });

  React.useEffect(() => {
	const timeout = setTimeout(() => {
	  table.getColumn("user")?.setFilterValue(search);
	}, 100);
	return () => clearTimeout(timeout);
  }, [search, table]);

  return (
	<div>
	  <div className="flex items-center py-4">
		<Input
		  placeholder="Filter file ID or file name"
		  value={search}
		  onChange={(e) => setSearch(e.target.value)}
		  className="max-w-sm rounded-none mr-3"
		/>
		<DropdownMenu>
		  <DropdownMenuTrigger asChild>
			<Button variant="outline" className="ml-auto">
			  <Settings2 className="h-4 w-4" />
			  Columns
			</Button>
		  </DropdownMenuTrigger>
		  <DropdownMenuContent align="end">
			{table
			  .getAllColumns()
			  .filter((column) => column.getCanHide())
			  .map((column) => {
				return (
				  <DropdownMenuCheckboxItem
					key={column.id}
					className="capitalize"
					checked={column.getIsVisible()}
					onCheckedChange={(value) =>
					  column.toggleVisibility(!!value)
					}
				  >
					{column.id}
				  </DropdownMenuCheckboxItem>
				);
			  })}
		  </DropdownMenuContent>
		</DropdownMenu>
	  </div>
	  <div className="rounded-none border">
		<Table>
		  <TableHeader>
			{table.getHeaderGroups().map((headerGroup) => (
			  <TableRow key={headerGroup.id}>
				{headerGroup.headers.map((header) => {
				  return (
					<TableHead key={header.id}>
					  {header.isPlaceholder
						? null
						: flexRender(
							header.column.columnDef.header,
							header.getContext()
						  )}
					</TableHead>
				  );
				})}
			  </TableRow>
			))}
		  </TableHeader>
		  <TableBody>
			{table.getRowModel().rows?.length ? (
			  table.getRowModel().rows.map((row) => (
				<TableRow
				  key={row.id}
				  data-state={row.getIsSelected() && "selected"}
				>
				  {row.getVisibleCells().map((cell) => (
					<TableCell key={cell.id}>
					  {flexRender(
						cell.column.columnDef.cell,
						cell.getContext()
					  )}
					</TableCell>
				  ))}
				</TableRow>
			  ))
			) : (
			  <TableRow>
				<TableCell
				  colSpan={columns.length}
				  className="h-24 text-center"
				>
				  No results.
				</TableCell>
			  </TableRow>
			)}
		  </TableBody>
		</Table>
	  </div>
	  <div className="flex md:flex-row flex-col md:items-center md:justify-between no-print gap-2 py-3">
		<p className="text-sm font-semibold text-muted-foreground">
		  Showing{" "}
		  {table.getState().pagination.pageIndex *
			table.getState().pagination.pageSize +
			1}{" "}
		  to{" "}
		  {Math.min(
			(table.getState().pagination.pageIndex + 1) *
			  table.getState().pagination.pageSize,
			data.length
		  )}{" "}
		  of {data.length} results
		</p>

		<div className="flex items-center gap-x-5">
		  <div className="flex items-center gap-x-2">
			<span className="font-semibold text-sm md:block hidden">
			  Items per page
			</span>
			<Select
			  value={String(table.getState().pagination.pageSize)}
			  onValueChange={(e) => {
				table.setPageSize(Number(e));
			  }}
			>
			  <SelectTrigger className="w-[60px]">
				<SelectValue
				  placeholder={table.getState().pagination.pageSize}
				/>
			  </SelectTrigger>
			  <SelectContent>
				{[5, 10, 20, 30].map((pageSize) => (
				  <SelectItem key={pageSize} value={String(pageSize)}>
					{pageSize}
				  </SelectItem>
				))}
			  </SelectContent>
			</Select>
		  </div>
		  <div className="flex items-center space-x-2">
			<Button
			  variant="outline"
			  size="sm"
			  onClick={() => table.setPageIndex(0)}
			  disabled={!table.getCanPreviousPage()}
			>
			  <ChevronsLeft className="w-4 h-4" />
			</Button>
			<Button
			  variant="outline"
			  size="sm"
			  onClick={() => table.previousPage()}
			  disabled={!table.getCanPreviousPage()}
			>
			  <ChevronLeft className="w-4 h-4" />
			</Button>
			<Button
			  variant="outline"
			  size="sm"
			  onClick={() => table.nextPage()}
			  disabled={!table.getCanNextPage()}
			>
			  <ChevronRight className="w-4 h-4" />
			</Button>
			<Button
			  variant="outline"
			  size="sm"
			  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
			  disabled={!table.getCanNextPage()}
			>
			  <ChevronsRight className="w-4 h-4" />
			</Button>
		  </div>
		</div>
	  </div>
	</div>
  );
}

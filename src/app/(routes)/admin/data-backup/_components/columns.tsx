"use client";

import { BackupHistory } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<BackupHistory>[] = [
  {
    accessorKey: "databaseBackup",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          File
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col ml-2.5">
          <span className="font-semibold">{row.original.filename}</span>
          <div
            title={row.original.createdAt.toLocaleDateString()}
            className="text-xs text-primary gap-2 flex items-center"
          >
            <span className="">
              {row.original.createdAt.toLocaleDateString()} at{" "}
              {row.original.createdAt.toLocaleTimeString()}
            </span>
          </div>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const fileName = row.original.filename.toLowerCase();
      const search = filterValue.toLowerCase();

      return fileName.includes(search);
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "action",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Action
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="ml-2.5">
          <span className='capitalize'>{row.original.action}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span
          className={`inline-flex ml-2.5 items-center px-2 py-1 rounded-full text-xs font-semibold ${
            row.original.status === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.status === "success" ? "Success" : "Failed"}
        </span>
      );
    },
  },
];

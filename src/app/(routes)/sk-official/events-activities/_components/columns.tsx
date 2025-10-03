"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CheckIcon, ChevronsUpDown, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import CellAction from "./cell-action";
import { Events } from "@prisma/client";
import Link from "next/link";
import { extractFileName } from "@/lib/utils";

export const columns: ColumnDef<Events>[] = [
  {
    accessorKey: "eventName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Event Name
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const eventName = row.original.name;
      const id = row.original.id;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [copied, setCopied] = useState(false);
      return (
        <div className="ml-2.5">
          <span>{eventName}</span>
          <div
            title={id}
            className="text-xs cursor-pointer text-primary gap-2 flex items-center"
          >
            <span className="w-[190px] hover:underline truncate overflow-hidden whitespace-nowrap">
              {id}
            </span>
            {copied ? (
              <CheckIcon className="size-3 text-green-600" />
            ) : (
              <CopyIcon
                onClick={() => {
                  navigator.clipboard.writeText(id || "");
                  toast.success("ID copied to clipboard");
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="size-3 text-muted-foreground cursor-pointer"
              />
            )}
          </div>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const title = row.original.name.toLowerCase();
      const id = row.original.id.toLowerCase();
      const search = filterValue.toLowerCase();

      return title.includes(search) || id.includes(search);
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fileUrl",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          File URL
          <ChevronsUpDown className="h-4 w-4 ml-1" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const fileUrl = row.original.fileUrl;
      return (
        <Link
          href={fileUrl}
          target="_blank"
          className="ml-2.5 hover:underline text-blue-600"
        >
          {extractFileName(fileUrl)}
        </Link>
      );
    },
  },
  {
    accessorKey: "startdate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start Date
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const startDate = new Date(row.original.startDate);
      return (
        <span className="ml-2.5">
          {startDate.toLocaleDateString()}
        </span>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          End Date
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const endDate = new Date(row.original.endDate);
      return (
        <span className="ml-2.5">
          {endDate.toLocaleDateString()}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const data = row.original;
      return <CellAction data={data} />;
    },
  },
];

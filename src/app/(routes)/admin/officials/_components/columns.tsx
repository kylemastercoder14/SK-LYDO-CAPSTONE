"use client";

import { Officials } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { CheckIcon, ChevronsUpDown, CopyIcon } from "lucide-react";
import CellAction from "./cell-action";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export const columns: ColumnDef<Officials>[] = [
  {
    accessorKey: "barangay",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Barangay
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const official = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [copied, setCopied] = useState(false);

      return (
        <div className="flex flex-col">
          <span className="font-semibold">{official.barangay}</span>
          <div
            title={row.original.id}
            className="text-xs cursor-pointer text-primary gap-2 flex items-center"
          >
            <span className="w-[190px] hover:underline truncate overflow-hidden whitespace-nowrap">
              {row.original.id}
            </span>
            {copied ? (
              <CheckIcon className="size-3 text-green-600" />
            ) : (
              <CopyIcon
                onClick={() => {
                  navigator.clipboard.writeText(row.original.id);
                  toast.success("Official ID copied to clipboard");
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
      const barangay = row.original.barangay.toLowerCase();
      const id = row.original.id.toLowerCase();
      const search = filterValue.toLowerCase();

      return barangay.includes(search) || id.includes(search);
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "officials",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Officials
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const officials = row.original.name || "N/A";
      return <span>{officials.toUpperCase().replace(/-/g, "_")}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Created
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <span className="text-sm text-muted-foreground">
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </span>
      );
    },
  },
  {
    accessorKey: "actions",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Actions
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <CellAction officials={row.original} />;
    },
  },
];

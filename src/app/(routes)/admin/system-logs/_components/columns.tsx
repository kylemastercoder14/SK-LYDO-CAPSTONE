"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckIcon, ChevronsUpDown, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { SystemLogsProps } from '@/types/interface';

export const columns: ColumnDef<SystemLogsProps>[] = [
  {
    accessorKey: "user",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [copied, setCopied] = useState(false);

      // Handle cases where firstName or lastName might be null/undefined
      const firstName = user.user?.firstName || "";
      const lastName = user.user?.lastName || "";
      const fullName = `${firstName} ${lastName}`.trim();
      const displayName = fullName || user.user?.username || "Unknown User";

      return (
        <div className="flex items-center gap-2">
          <Avatar className="rounded-lg">
            <AvatarImage src={user.user?.image || ""} alt={user.user?.username || ""} />
            <AvatarFallback className="rounded-lg">
              {(user.user?.username || "U").charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">{displayName}</span>
            <div
              title={user.user?.id}
              className="text-xs cursor-pointer text-primary gap-2 flex items-center"
            >
              <span className="w-[190px] hover:underline truncate overflow-hidden whitespace-nowrap">
                {user.user?.id}
              </span>
              {copied ? (
                <CheckIcon className="size-3 text-green-600" />
              ) : (
                <CopyIcon
                  onClick={() => {
                    navigator.clipboard.writeText(user.user?.id || "");
                    toast.success("User ID copied to clipboard");
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="size-3 text-muted-foreground cursor-pointer"
                />
              )}
            </div>
          </div>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const username = (row.original.user?.username ?? "").toLowerCase();
      const id = (row.original.userId ?? "").toLowerCase();
      const search = filterValue.toLowerCase();

      return username.includes(search) || id.includes(search);
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "logs",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Logs
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const logs = row.original.action;
      return (
        <span>
          {logs}
        </span>
      );
    },
  },
  {
    accessorKey: "time",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const time = new Date(row.original.createdAt);
      return (
        <span>
          {time.toLocaleTimeString()}
        </span>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <span>
          {date.toLocaleDateString()}
        </span>
      );
    },
  },
];

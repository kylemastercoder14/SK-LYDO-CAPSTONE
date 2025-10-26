"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckIcon, ChevronsUpDown, CopyIcon } from "lucide-react";
import CellAction from "./cell-action";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";
import { TicketWithUser } from "@/types/interface";

export const columns: ColumnDef<TicketWithUser>[] = [
  {
    accessorKey: "ticket",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Ticket
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const ticket = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [copied, setCopied] = useState(false);

      const user = ticket.user ?? { username: "", image: "", firstName: "", lastName: "" };
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
      const displayName = fullName || user.username || "Unknown User";

      return (
        <div className="flex items-center gap-2">
          <Avatar className="rounded-lg">
            <AvatarImage src={user.image || ""} alt={user.username || ""} />
            <AvatarFallback className="rounded-lg">
              {(user.username || "U").charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">{displayName}</span>
            <div
              title={row.original.id}
              className="text-xs cursor-pointer text-primary gap-2 flex items-center"
            >
              <span className="w-[190px] hover:underline truncate overflow-hidden whitespace-nowrap">
                Ticket #: {row.original.id}
              </span>
              {copied ? (
                <CheckIcon className="size-3 text-green-600" />
              ) : (
                <CopyIcon
                  onClick={() => {
                    navigator.clipboard.writeText(row.original.id);
                    toast.success("Ticket ID copied to clipboard");
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
      const username = row.original.user?.username.toLowerCase();
      const id = row.original.id.toLowerCase();
      const search = filterValue.toLowerCase();

      return username?.includes(search) || id.includes(search);
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.original.status;

      const statusColors: Record<string, string> = {
        OPEN: "bg-blue-100 text-blue-800",
        PENDING: "bg-yellow-100 text-yellow-800",
        RESOLVED: "bg-green-100 text-green-800",
        CLOSED: "bg-gray-200 text-gray-700",
      };

      const color = statusColors[status] || "bg-gray-100 text-gray-800";

      return (
        <Badge className={`${color} rounded-full text-xs px-3 py-1`}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Priority
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const priority = row.original.priority;

      const priorityColors: Record<string, string> = {
        HIGH: "bg-red-100 text-red-800",
        MEDIUM: "bg-orange-100 text-orange-800",
        LOW: "bg-green-100 text-green-800",
      };

      const color = priorityColors[priority] || "bg-gray-100 text-gray-800";

      return (
        <Badge className={`${color} rounded-full text-xs px-3 py-1`}>
          {priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date Created
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
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
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckIcon, ChevronsUpDown, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { ProjectProposalProps } from "@/types/interface";
import CellAction from "./cell-action";
import { Badge } from "@/components/ui/badge";
import { extractFileName, formattedBudget } from "@/lib/utils";
import Link from "next/link";

export const columns: ColumnDef<ProjectProposalProps>[] = [
  {
    accessorKey: "projectName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Event Name
          <ChevronsUpDown className="h-4 w-4 ml-1" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const event = row.original.title;
      const project = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [copied, setCopied] = useState(false); // Keep useState here for the copy functionality
      return (
        <div className="ml-2.5">
          <span>{event}</span>
          <div
            title={project.id}
            className="text-xs cursor-pointer text-primary gap-2 flex items-center"
          >
            <span className="w-[200px] text-muted-foreground hover:underline truncate overflow-hidden whitespace-nowrap">
              {project.id}
            </span>
            {copied ? (
              <CheckIcon className="size-3 text-green-600" />
            ) : (
              <CopyIcon
                onClick={() => {
                  navigator.clipboard.writeText(project.id || "");
                  toast.success("Project ID copied to clipboard");
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
      const title = row.original.title.toLowerCase();
      const id = row.original.id.toLowerCase();
      const search = filterValue.toLowerCase();

      return title.includes(search) || id.includes(search);
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "budget",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Budget
          <ChevronsUpDown className="h-4 w-4 ml-1" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const budget = formattedBudget(row.original.budget);
      return <span className="ml-2.5">₱{budget}</span>;
    },
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
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Submitted
          <ChevronsUpDown className="h-4 w-4 ml-1" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return <span className="ml-2.5">{date.toLocaleDateString()}</span>;
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
          <ChevronsUpDown className="h-4 w-4 ml-1" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      let badgeVariant: "default" | "secondary" | "destructive" | "outline" =
        "default";
      let badgeColorClass = "";

      switch (status) {
        case "Completed":
        case "Approved":
        case "Accomplished":
          badgeVariant = "default";
          badgeColorClass = "bg-green-100 text-green-700 hover:bg-green-200";
          break;
        case "In Progress":
          badgeVariant = "default";
          badgeColorClass = "bg-blue-100 text-blue-700 hover:bg-blue-200";
          break;
        case "Pending":
          badgeVariant = "secondary";
          badgeColorClass = "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
          break;
        case "Rejected":
          badgeVariant = "destructive";
          badgeColorClass = "bg-red-100 text-red-700 hover:bg-red-200";
          break;
        default:
          badgeVariant = "outline";
          badgeColorClass = "bg-gray-100 text-gray-700 hover:bg-gray-200";
          break;
      }

      return (
        <Badge className={`ml-2.5 ${badgeColorClass}`} variant={badgeVariant}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "user",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Submitted By
          <ChevronsUpDown className="h-4 w-4 ml-1" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;

      const firstName = user.user?.firstName || "";
      const lastName = user.user?.lastName || "";
      const fullName = `${firstName} ${lastName}`.trim();
      const displayName = fullName || user.user?.username || "Unknown User";

      return (
        <div className="flex items-center gap-2 ml-2.5">
          <Avatar className="rounded-lg">
            <AvatarImage
              src={user.user?.image || ""}
              alt={user.user?.username || ""}
              className='object-cover'
            />
            <AvatarFallback className="rounded-lg">
              {(user.user?.username || "U").charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">{displayName}</span>
          </div>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const event = (row.original.title ?? "").toLowerCase();
      const id = (row.original.id ?? "").toLowerCase();
      const search = filterValue.toLowerCase();

      return event.includes(search) || id.includes(search);
    },
    enableSorting: false,
    enableHiding: false,
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

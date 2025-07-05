"use client";

import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckIcon, ChevronsUpDown, CopyIcon } from "lucide-react";
import CellAction from "./cell-action";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export const columns: ColumnDef<User>[] = [
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
      const firstName = user.firstName || "";
      const lastName = user.lastName || "";
      const fullName = `${firstName} ${lastName}`.trim();
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
                {row.original.id}
              </span>
              {copied ? (
                <CheckIcon className="size-3 text-green-600" />
              ) : (
                <CopyIcon
                  onClick={() => {
                    navigator.clipboard.writeText(row.original.id);
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
      const username = row.original.username.toLowerCase();
      const id = row.original.id.toLowerCase();
      const search = filterValue.toLowerCase();

      return username.includes(search) || id.includes(search);
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Position
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
  },
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
      const barangay = row.original.barangay || "N/A";
      return <span>{barangay.toUpperCase().replace(/-/g, "_")}</span>;
    },
  },
  {
    accessorKey: "isActive",
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
      const isActive = row.original.isActive;
      return (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
            isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
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
          Date Joined
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
      return <CellAction user={row.original} />;
    },
  },
];

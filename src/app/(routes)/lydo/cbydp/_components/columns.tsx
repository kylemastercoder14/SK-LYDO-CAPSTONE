"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckIcon, ChevronsUpDown, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { CBYDPProps } from "@/types/interface";
import CellAction from "./cell-action";
import { BARANGAYS } from '@/lib/constants';
import { normalizeBarangay } from '@/lib/utils';

export const columns: ColumnDef<CBYDPProps>[] = [
  {
    accessorKey: "projectName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          CBYPD
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const projectName = row.original.name;
      const user = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [copied, setCopied] = useState(false);
      return (
        <div className="ml-2.5">
          <span>{projectName}</span>
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
      );
    },
  },
  {
    accessorFn: (row) => row.user?.barangay ?? "",
    id: "barangay",
    filterFn: "equals",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Barangay
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const barangay = row.original.user?.barangay ?? "";
      const displayName =
        BARANGAYS.find((b) => normalizeBarangay(b) === barangay) ??
        barangay.toUpperCase().replace(/-/g, " ");
      return <span className="ml-2.5">{displayName}</span>;
    },
  },
  {
    accessorKey: "fileSize",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          File Size
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const fileSize = row.original.fileSize;
      return <span className="ml-2.5 uppercase">{fileSize}</span>;
    },
  },
  {
    accessorKey: "fileType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          File Type
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const fileType = row.original.fileType;
      return <span className="ml-2.5 uppercase">{fileType}</span>;
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
          Date Uploaded
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return <span className="ml-2.5">{date.toLocaleDateString()}</span>;
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
          Uploaded By
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;

      // Handle cases where firstName or lastName might be null/undefined
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
      const fileName = (row.original.name ?? "").toLowerCase();
      const id = (row.original.uploadedBy ?? "").toLowerCase();
      const search = filterValue.toLowerCase();

      return fileName.includes(search) || id.includes(search);
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

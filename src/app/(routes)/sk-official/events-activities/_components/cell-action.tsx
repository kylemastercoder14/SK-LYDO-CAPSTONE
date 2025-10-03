"use client";

import React from "react";

import { EditIcon, FileTextIcon, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Events } from "@prisma/client";
import EventForm from "@/components/forms/event-form";

const CellAction = ({ data }: { data: Events }) => {
  const router = useRouter();
  const [editOpen, setEditOpen] = React.useState(false);
  return (
    <>
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)}>
        <EventForm
          barangay={data.barangay}
          initialData={data}
          onClose={() => setEditOpen(false)}
        />
      </Modal>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <EditIcon className="size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(data.fileUrl)}>
            <FileTextIcon className="size-4" />
            View file
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;

"use client";

import React from "react";

import {
  EditIcon,
  FileTextIcon,
  MoreHorizontal,
  ArchiveIcon,
  RefreshCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { ResolutionProps } from "@/types/interface";
import AlertModal from "@/components/globals/alert-modal";
import { archiveResolution, retrieveResolution } from "@/actions";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import ResolutionForm from '@/components/forms/resolution-form';

const CellAction = ({ data }: { data: ResolutionProps }) => {
  const router = useRouter();
  const [openArchive, setOpenArchive] = React.useState(false);
  const [openRetrieve, setOpenRetrieve] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);

  const onArchive = async () => {
    try {
      await archiveResolution(data.id, data.uploadedBy);
      toast.success("Resolution archived successfully! 🗑️");
      router.refresh();
    } catch (error) {
      toast.error("Failed to archive Resolution. 😥");
      console.error("Archive error:", error);
    } finally {
      setOpenArchive(false);
    }
  };

  const onRetrieve = async () => {
    try {
      await retrieveResolution(data.id, data.uploadedBy);
      toast.success("Resolution retrieved successfully! 📂");
      setOpenRetrieve(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to retrieve Resolution. 😥");
      console.error("Retrieve error:", error);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={openArchive}
        onClose={() => setOpenArchive(false)}
        onConfirm={onArchive}
        title="Archive Resolution"
        description="Are you sure you want to archive this Resolution? This action cannot be undone."
      />
      <AlertModal
        isOpen={openRetrieve}
        onClose={() => setOpenRetrieve(false)}
        onConfirm={onRetrieve}
        title="Retrieve Resolution"
        description="Are you sure you want to retrieve this Resolution? It will no longer be archived."
      />
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)}>
        <ResolutionForm
          userId={data.uploadedBy}
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
          <DropdownMenuSeparator />
          {data.isArchived ? (
            <DropdownMenuItem onClick={() => setOpenRetrieve(true)}>
              <RefreshCcw className="size-4" />
              Retrieve
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setOpenArchive(true)}>
              <ArchiveIcon className="size-4" />
              Archive
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;

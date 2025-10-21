"use client";

import React, { useState } from "react";
import {
  EditIcon,
  FileTextIcon,
  MoreHorizontal,
  ArchiveIcon,
  RefreshCcw,
  CheckCircle,
  XCircle,
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
import { ProjectProposalProps } from "@/types/interface";
import AlertModal from "@/components/globals/alert-modal";
import {
  archiveProjectProposal,
  retrieveProjectProposal,
  updateProjectStatus,
} from "@/actions";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import ProjectProposalForm from "@/components/forms/project-proposal-form";
import { Textarea } from "@/components/ui/textarea";

const CellAction = ({ data }: { data: ProjectProposalProps }) => {
  const router = useRouter();

  const [openArchive, setOpenArchive] = useState(false);
  const [openRetrieve, setOpenRetrieve] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const onArchive = async () => {
    try {
      await archiveProjectProposal(data.id, data.createdBy);
      toast.success("Project proposal archived successfully! 🗑️");
      router.refresh();
    } catch {
      toast.error("Failed to archive project proposal. 😥");
    } finally {
      setOpenArchive(false);
    }
  };

  const onRetrieve = async () => {
    try {
      await retrieveProjectProposal(data.id, data.createdBy);
      toast.success("Project proposal retrieved successfully! 📂");
      router.refresh();
    } catch {
      toast.error("Failed to retrieve project proposal. 😥");
    } finally {
      setOpenRetrieve(false);
    }
  };

  const onApprove = async () => {
    try {
      await updateProjectStatus(data.id, "Approved");
      toast.success("Project proposal approved! ✅");
      router.refresh();
    } catch {
      toast.error("Failed to approve proposal. 😥");
    }
  };

  const onRejectConfirm = async () => {
    try {
      if (!rejectReason.trim()) {
        toast.error("Please provide a reason for rejection.");
        return;
      }
      await updateProjectStatus(data.id, "Rejected", rejectReason);
      toast.success("Project proposal rejected. ❌");
      router.refresh();
    } catch {
      toast.error("Failed to reject proposal. 😥");
    } finally {
      setRejectOpen(false);
      setRejectReason("");
    }
  };

  const handleStatusUpdate = async (status: "In Progress" | "Completed") => {
    try {
      await updateProjectStatus(data.id, status);
      toast.success(`Status updated to ${status}`);
      router.refresh();
    } catch {
      toast.error("Failed to update status. 😥");
    }
  };

  return (
    <>
      {/* Archive/Retrieve Modals */}
      <AlertModal
        isOpen={openArchive}
        onClose={() => setOpenArchive(false)}
        onConfirm={onArchive}
        title="Archive Project Proposal"
        description="Are you sure you want to archive this project proposal?"
      />
      <AlertModal
        isOpen={openRetrieve}
        onClose={() => setOpenRetrieve(false)}
        onConfirm={onRetrieve}
        title="Retrieve Project Proposal"
        description="Are you sure you want to retrieve this project proposal?"
      />

      {/* Edit Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)}>
        <ProjectProposalForm
          userId={data.createdBy}
          initialData={data}
          onClose={() => setEditOpen(false)}
        />
      </Modal>

      {/* Rejection Reason Modal */}
      <Modal
        isOpen={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Reject Proposal"
      >
        <div className="space-y-4">
          <Textarea
            placeholder="Enter reason for rejection..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onRejectConfirm}>
              Reject
            </Button>
          </div>
        </div>
      </Modal>

      {/* Dropdown Actions */}
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

          {/* For CHAIRPERSON — Approval / Rejection */}
          {data.status === "Pending" &&
            data.user?.officialType === "CHAIRPERSON" && (
              <>
                <DropdownMenuItem onClick={onApprove}>
                  <CheckCircle className="size-4 text-green-600" />
                  Approve Proposal
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRejectOpen(true)}>
                  <XCircle className="size-4 text-red-600" />
                  Reject Proposal
                </DropdownMenuItem>
              </>
            )}

          {/* Update status after approval */}
          {(data.status === "Approved" || data.status === "In Progress") && (
            <>
              <DropdownMenuSeparator />
              {data.status === "Approved" && (
                <DropdownMenuItem
                  onClick={() => handleStatusUpdate("In Progress")}
                >
                  Mark as In Progress
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => handleStatusUpdate("Completed")}>
                Mark as Completed
              </DropdownMenuItem>
            </>
          )}

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

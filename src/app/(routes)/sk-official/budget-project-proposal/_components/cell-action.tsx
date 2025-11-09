/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import {
  EditIcon,
  FileTextIcon,
  MoreHorizontal,
  ArchiveIcon,
  RefreshCcw,
  CheckCircle,
  XCircle,
  ImageIcon,
  EyeIcon,
  AwardIcon,
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
  markAsAccomplished,
  retrieveProjectProposal,
  updateProjectStatus,
  uploadProjectAttachments,
} from "@/actions";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import ProjectProposalForm from "@/components/forms/project-proposal-form";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@prisma/client";

const CellAction = ({ data }: { data: ProjectProposalProps }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getClientSession() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/session`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) return setUser(null);
        const data = await response.json();
        setUser(data.user || null);
      } catch (error) {
        console.error("Client session error:", error);
        setUser(null);
      }
    }
    getClientSession();
  }, []);

  const [openArchive, setOpenArchive] = useState(false);
  const [openRetrieve, setOpenRetrieve] = useState(false);
  const [openAttachment, setOpenAttachment] = useState(false);
  const [openViewAttachments, setOpenViewAttachments] = useState(false);
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

  const handleMarkAsAccomplished = async () => {
    try {
      const result = await markAsAccomplished(data.id);
      if (result.success) {
        toast.success("Project marked as accomplished! 🏆");
        router.refresh();
        setOpenViewAttachments(false);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Failed to mark as accomplished.");
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

      {/* Reject Modal */}
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

      {/* Upload Attachment Modal */}
      <Modal
        isOpen={openAttachment}
        onClose={() => setOpenAttachment(false)}
        title="Attach Photo Documentation"
      >
        <form
          action={async (formData) => {
            const result = await uploadProjectAttachments(formData);
            if (result.success) {
              toast.success(
                `Successfully uploaded ${result.count} file(s)! 📸`
              );
              setOpenAttachment(false);
            } else {
              toast.error(result.error || "Upload failed.");
            }
          }}
          className="space-y-4"
        >
          <p className="text-sm text-muted-foreground">
            📎 You can attach up to <strong>4 images/files</strong> directly. If
            you have <strong>5 or more</strong> images, please compile them into
            a single <strong>PDF</strong> before uploading.
          </p>

          <input type="hidden" name="projectId" value={data.id} />

          <input
            type="file"
            accept="image/*,application/pdf"
            name="files"
            multiple
            className="w-full text-sm border p-2 rounded-md"
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setOpenAttachment(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Upload</Button>
          </div>
        </form>
      </Modal>

      {/* View Attachments Modal (for Chairperson) */}
      <Modal
        isOpen={openViewAttachments}
        onClose={() => setOpenViewAttachments(false)}
        title="View Project Attachments"
      >
        {data.attachments?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {data.attachments.map((url, index) => (
              <div key={index} className="border rounded-md p-2 text-center">
                {url.endsWith(".pdf") ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 underline"
                  >
                    📄 View PDF
                  </a>
                ) : (
                  <img
                    src={url}
                    alt={`Attachment ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            No attachments uploaded.
          </p>
        )}
        <div className="flex justify-end mt-4">
          <Button variant="primary" onClick={handleMarkAsAccomplished} className="gap-2">
            <AwardIcon className="w-4 h-4" />
            Mark as Accomplished
          </Button>
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

          {/* CHAIRPERSON actions */}
          {user?.officialType === "CHAIRPERSON" && (
            <>
              {data.status === "Pending" && (
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

              {data.attachments?.length > 0 && (
                <DropdownMenuItem onClick={() => setOpenViewAttachments(true)}>
                  <EyeIcon className="size-4 text-blue-600" />
                  View Attachments
                </DropdownMenuItem>
              )}
            </>
          )}

          {/* Status progression for other roles */}
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

          {/* Upload photos (non-chairperson only) */}
          {data.status === "Completed" &&
            user?.officialType !== "CHAIRPERSON" && (
              <DropdownMenuItem onClick={() => setOpenAttachment(true)}>
                <ImageIcon className="size-4" />
                Attach Photos
              </DropdownMenuItem>
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

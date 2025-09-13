"use client";

import React from "react";

import { EditIcon, MoreHorizontal, CheckCircle, XCircle } from "lucide-react";

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
import AlertModal from "@/components/globals/alert-modal";
import { Modal } from "@/components/ui/modal";
import { BudgetDistribution } from "@prisma/client";
import BudgetDistributionForm from "@/components/forms/budget-distribution-form";
import { toast } from 'sonner';
import { approveBudgetDistribution, rejectBudgetDistribution } from '@/actions';

const CellAction = ({ data }: { data: BudgetDistribution }) => {
  const router = useRouter();
  const [openApprove, setOpenApprove] = React.useState(false);
  const [openReject, setOpenReject] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);

  const onApprove = async () => {
    try {
      await approveBudgetDistribution(data.id);
      toast.success("Budget distribution approved successfully! ✅");
      router.refresh();
    } catch (error) {
      toast.error("Failed to approve budget distribution. 😥");
      console.error("Approve error:", error);
    } finally {
      setOpenApprove(false);
    }
  };

  const onReject = async () => {
    try {
      await rejectBudgetDistribution(data.id);
      toast.success("Budget distribution rejected successfully! ✅");
      router.refresh();
    } catch (error) {
      toast.error("Failed to reject budget distribution. 😥");
      console.error("Reject error:", error);
    } finally {
      setOpenReject(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={openApprove}
        onClose={() => setOpenApprove(false)}
        onConfirm={onApprove}
        title="Approve Budget Distribution"
        description="Are you sure you want to approve this budget distribution?"
      />
      <AlertModal
        isOpen={openReject}
        onClose={() => setOpenReject(false)}
        onConfirm={onReject}
        title="Reject Budget Distribution"
        description="Are you sure you want to reject this budget distribution?"
      />
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)}>
        <BudgetDistributionForm
          userId={data.createdBy}
          initialData={data}
          onClose={() => setEditOpen(false)}
          barangay={data.barangay}
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
          <DropdownMenuSeparator />
          {data.isApproved ? (
            <DropdownMenuItem onClick={() => setOpenReject(true)}>
              <XCircle className="size-4" />
              Reject
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setOpenApprove(true)}>
              <CheckCircle className="size-4" />
              Approve
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;

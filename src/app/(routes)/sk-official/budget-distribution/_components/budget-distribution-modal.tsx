"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import BudgetDistributionForm from "@/components/forms/budget-distribution-form";

const BudgetDistributionModal = ({ userId, barangay }: { userId: string; barangay: string; }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <BudgetDistributionForm
          userId={userId}
          initialData={null}
          onClose={() => setIsOpen(false)}
          barangay={barangay}
        />
      </Modal>
      <Button onClick={() => setIsOpen(true)} variant="primary">
        <PlusIcon className="size-4" />
        Create Budget Allocation
      </Button>
    </>
  );
};

export default BudgetDistributionModal;

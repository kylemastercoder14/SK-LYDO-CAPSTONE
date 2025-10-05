"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import BudgetReportForm from "@/components/forms/budget-report-form";

const BudgetReportModal = ({ userId }: { userId: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <BudgetReportForm
          userId={userId}
          initialData={null}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
      <Button onClick={() => setIsOpen(true)} variant="primary">
        <PlusIcon className="size-4" />
        Create Report
      </Button>
    </>
  );
};

export default BudgetReportModal;

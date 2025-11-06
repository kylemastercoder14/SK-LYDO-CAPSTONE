"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import ABYIPReportForm from "@/components/forms/abyip-report-form";

const ABYIPReportModal = ({ userId }: { userId: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ABYIPReportForm
          userId={userId}
          initialData={null}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
      <Button onClick={() => setIsOpen(true)} variant="primary">
        <UploadIcon className="size-4" />
        Upload Report
      </Button>
    </>
  );
};

export default ABYIPReportModal;

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import CBYDPReportForm from "@/components/forms/cbydp-report-form";

const CBYDPReportModal = ({ userId }: { userId: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <CBYDPReportForm
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

export default CBYDPReportModal;

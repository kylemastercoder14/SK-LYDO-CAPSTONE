"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import MinutesMeetingForm from "@/components/forms/minutes-meeting-form";

const MinutesMeetingModal = ({ userId }: { userId: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <MinutesMeetingForm
          userId={userId}
          initialData={null}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
      <Button onClick={() => setIsOpen(true)} variant="primary">
        <PlusIcon className="size-4" />
        Create MOM
      </Button>
    </>
  );
};

export default MinutesMeetingModal;

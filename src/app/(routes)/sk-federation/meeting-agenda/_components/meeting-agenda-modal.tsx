"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import MeetingAgendaForm from "@/components/forms/meeting-agenda-form";

const MeetingAgendaModal = ({ userId }: { userId: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <MeetingAgendaForm
          userId={userId}
          initialData={null}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
      <Button onClick={() => setIsOpen(true)} variant="primary">
        <PlusIcon className="size-4" />
        Create Agenda
      </Button>
    </>
  );
};

export default MeetingAgendaModal;

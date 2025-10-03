"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import ProjectProposalForm from "@/components/forms/project-proposal-form";

const ProjectProposalModal = ({ userId }: { userId: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Modal className='!max-w-4xl' isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ProjectProposalForm
          userId={userId}
          initialData={null}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
      <Button onClick={() => setIsOpen(true)} variant="primary">
        <PlusIcon className="size-4" />
        Create Proposal
      </Button>
    </>
  );
};

export default ProjectProposalModal;

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import EventForm from "@/components/forms/event-form";

const EventModal = ({ userId, barangay }: { userId: string; barangay: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
	<>
	  <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
		<EventForm
		  userId={userId}
		  barangay={barangay}
		  initialData={null}
		  onClose={() => setIsOpen(false)}
		/>
	  </Modal>
	  <Button onClick={() => setIsOpen(true)} variant="primary">
		<PlusIcon className="size-4" />
		Create Event
	  </Button>
	</>
  );
};

export default EventModal;

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import SingleFileUpload from "@/components/globals/file-upload";

type Attachment = { url: string; size: number; type: string } | null;

type TicketFormData = {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  attachment?: Attachment;
  guestName?: string;
  guestEmail?: string;
};

const HelpCenter = ({ user }: { user?: User | null }) => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, setValue, watch } =
    useForm<TicketFormData>();

  const attachment = watch("attachment");
  const priority = watch("priority");

  const onSubmit = async (data: TicketFormData) => {
    const payload = {
      ...data,
      userId: user?.id ?? null, // null if guest
    };

    const res = await fetch("/api/notifications/help-center", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success("Ticket submitted successfully!");
      reset();
      setOpen(false);
    } else {
      toast.error("Failed to submit ticket");
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          className="bg-red-600 hover:bg-red-700 text-white shadow-lg"
          onClick={() => setOpen(true)}
        >
          Submit a Ticket
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!max-w-xl">
          <DialogHeader>
            <DialogTitle>Submit a Support Ticket</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Guest-only fields */}
            {!user && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Full Name</Label>
                  <Input
                    placeholder="Enter your full name"
                    {...register("guestName", { required: true })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...register("guestEmail", { required: true })}
                  />
                </div>
              </div>
            )}

            {/* Title */}
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                placeholder="Enter your issue or concern"
                {...register("title", { required: true })}
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                placeholder="Provide more details about your concern..."
                {...register("description", { required: true })}
                rows={4}
              />
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(val) => setValue("priority", val as any)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>

              <p className="text-xs text-muted-foreground mt-1">
                ⚠️ Use{" "}
                <span className="font-semibold text-red-600">High Priority</span>{" "}
                only for urgent issues (e.g. system not working, data loss).
              </p>
            </div>

            {/* Attachment */}
            <div className="space-y-1.5">
              <Label>Attachment (optional)</Label>
              <SingleFileUpload
                onFileUpload={(file) => setValue("attachment", file ?? null)}
                defaultValue={attachment?.url || ""}
                bucket="tickets"
                maxFileSizeMB={3}
              />
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Submit Ticket
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HelpCenter;

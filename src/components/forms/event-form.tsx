/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Events } from "@prisma/client";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { eventSchema } from "@/validators";
import Heading from "@/components/globals/heading";
import { Separator } from "@/components/ui/separator";
import SingleFileUpload from "@/components/globals/file-upload";
import { EventFormValues } from "@/types/types";

interface EventFormProps {
  initialData: Events | null;
  onClose?: () => void;
  userId: string;
  barangay: string;
}

const EventForm: React.FC<EventFormProps> = ({
  initialData,
  onClose,
  userId,
  barangay,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          startDate: initialData.startDate ? String(initialData.startDate) : undefined,
          endDate: initialData.endDate ? String(initialData.endDate) : undefined,
        }
      : {
          name: "",
          description: "",
          thumbnail: "",
          barangay: barangay,
          startDate: undefined,
          endDate: undefined,
        },
  });

  const onSubmit = async (data: EventFormValues) => {
    // try {
    //   setLoading(true);

    //   if (initialData) {
    //     await updateProjectProposal(initialData.id, data, userId);
    //     toast.success("Event updated successfully! 🎉");
    //   } else {
    //     await createProjectProposal(data, userId);
    //     toast.success("Event created successfully! ✨");
    //   }
    //   router.refresh();
    //   onClose?.();
    // } catch (error: any) {
    //   toast.error("Something went wrong. Please try again. 😢");
    //   console.error("Form submission error:", error);
    // } finally {
    //   setLoading(false);
    // }

	console.log(data)
  };

  const title = initialData ? "Edit Event" : "Create Event";
  const action = initialData ? "Save changes" : "Create event";

  return (
    <>
      {/* Title is now part of the modal's dialog component, not in the form itself */}
      <div className="flex items-center justify-between">
        <Heading title={title} description={""} />
      </div>
      <Separator className="my-2" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="pb-4">
          <div className="grid grid-cols-1 gap-x-4 gap-y-5">
            {/* Event Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="e.g., Feeding Program 2025"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Event Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="e.g., A brief description of the event"
                      {...field}
                      className="max-h-20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
              {/* Start date Field */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      TODO: Add a date picker component here
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* End date Field */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      TODO: Add a date picker component here
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* File URL Field */}
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <SingleFileUpload
                      onFileUpload={field.onChange}
                      defaultValue={field.value}
                      bucket="assets"
                      maxFileSizeMB={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="pt-6 space-x-2 flex items-center justify-end w-full">
            <Button
              disabled={loading}
              variant="outline"
              onClick={onClose}
              type="button"
            >
              Cancel
            </Button>
            <Button disabled={loading} type="submit">
              {loading ? "Processing..." : action}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default EventForm;

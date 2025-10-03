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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { eventSchema } from "@/validators";
import Heading from "@/components/globals/heading";
import { Separator } from "@/components/ui/separator";
import SingleFileUpload from "@/components/globals/file-upload";
import { EventFormValues } from "@/types/types";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/globals/rich-text-editor";
import { convertHtmlToPdf } from "@/lib/utils";
import { uploadToSupabase } from "@/lib/upload";
import { createEvent, updateEvent } from "@/actions";
import { toast } from "sonner";

interface EventFormProps {
  initialData: Events | null;
  onClose?: () => void;
  barangay: string;
}

const EventForm: React.FC<EventFormProps> = ({
  initialData,
  onClose,
  barangay,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          startDate: initialData.startDate
            ? String(initialData.startDate)
            : undefined,
          endDate: initialData.endDate
            ? String(initialData.endDate)
            : undefined,
        }
      : {
          name: "",
          content: "",
          isManualTyping: true,
          fileUrl: "",
          barangay: barangay,
          startDate: undefined,
          endDate: undefined,
        },
  });

  const onSubmit = async (data: EventFormValues) => {
    try {
      setLoading(true);

      if (data.isManualTyping) {
        // Use the enhanced PDF generation
        const doc = convertHtmlToPdf(data.content || "", data.name);

        const pdfBlob = doc.output("blob");

        const file = new File([pdfBlob], `${data.name}.pdf`, {
          type: "application/pdf",
        });

        const { url: fileUrl } = await uploadToSupabase(file, {
          bucket: "assets",
          onUploading: setLoading,
        });

        data.fileUrl = fileUrl;
      }

      // Save to DB
      if (initialData) {
        await updateEvent(initialData.id, data, barangay);
        toast.success("Event updated successfully! 🎉");
      } else {
        await createEvent(data, barangay);
        toast.success("Event created successfully! ✨");
      }
      router.refresh();
      onClose?.();
    } catch (error: any) {
      toast.error("Something went wrong. Please try again. 😢");
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
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
            <FormField
              control={form.control}
              name="isManualTyping"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-1">
                    <FormLabel>Manual Typing</FormLabel>
                    <FormDescription>
                      Enable this option if you prefer to manually type in the
                      details instead of uploading a file.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
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
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
              {/* Start date Field */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        type="datetime-local"
                        placeholder="Select start date"
                        {...field}
                      />
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
                      <Input
                        disabled={loading}
                        type="datetime-local"
                        placeholder="Select end date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Event Description Field */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Description</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      onChangeAction={field.onChange}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!form.watch("isManualTyping") && (
              <FormField
                control={form.control}
                name="fileUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File URL</FormLabel>
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
            )}
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

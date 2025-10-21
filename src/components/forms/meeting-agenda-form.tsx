/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MeetingAgenda } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import { meetingAgendaSchema } from "@/validators";
import Heading from "@/components/globals/heading";
import { Separator } from "@/components/ui/separator";
import SingleFileUpload from "@/components/globals/file-upload";
import { MeetingAgendaFormValues } from "@/types/types";
import { createMeetingAgenda, updateMeetingAgenda } from "@/actions";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/globals/rich-text-editor";
import { convertHtmlToDocx, formatFileSize } from "@/lib/utils";
import { uploadToSupabase } from "@/lib/upload";

interface MeetingAgendaFormProps {
  initialData: MeetingAgenda | null;
  onClose?: () => void;
  userId: string;
}

const MeetingAgendaForm: React.FC<MeetingAgendaFormProps> = ({
  initialData,
  onClose,
  userId,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<MeetingAgendaFormValues>({
    resolver: zodResolver(meetingAgendaSchema),
    defaultValues: initialData
      ? {
          name: initialData.name || "",
          isManualTyping: false,
          date: initialData.date ?? undefined,
          time: initialData.time ?? undefined,
          fileSize: initialData.fileSize ?? "",
          fileType: initialData.fileType ?? "",
          fileUrl: initialData.fileUrl ?? "",
          content: "",
        }
      : {
          name: "",
          isManualTyping: false,
          date: "",
          time: "",
          fileSize: "",
          fileType: "",
          fileUrl: "",
          content: "",
        },
  });

  const onSubmit = async (data: MeetingAgendaFormValues) => {
    try {
      setLoading(true);

      if (data.isManualTyping) {
        // Create a DOCX file from typed content
        const docxBlob = await convertHtmlToDocx(data.content || "", data.name);

        const fileSize = formatFileSize(docxBlob.size);
        const file = new File([docxBlob], `${data.name}.docx`, {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        const { url: fileUrl } = await uploadToSupabase(file, {
          bucket: "assets",
          onUploading: setLoading,
        });

        data.fileUrl = fileUrl;
        data.fileSize = fileSize;
        data.fileType = "DOCX";
      }

      if (initialData) {
        await updateMeetingAgenda(initialData.id, data, userId);
        toast.success("Meeting agenda updated successfully! 🎉");
      } else {
        await createMeetingAgenda(
          data,
          userId,
          "City of Dasmarinas Municipality Hall"
        );
        toast.success("Meeting agenda created successfully! ✨");
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

  const title = initialData ? "Edit Meeting Agenda" : "Create Meeting Agenda";
  const action = initialData ? "Save changes" : "Create agenda";

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
            {/* Meeting Agenda Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Agenda Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="e.g., Community Meeting Agenda"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={loading}
                        placeholder="e.g., Select a date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        disabled={loading}
                        placeholder="e.g., Select a time"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {!form.watch("isManualTyping") && (
              <>
                {/* File Size Field */}
                <FormField
                  control={form.control}
                  name="fileSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Size</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="e.g., 2.5 MB"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* File Type Field */}
                <FormField
                  control={form.control}
                  name="fileType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Type</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="e.g., PDF"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* File URL Field */}
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
              </>
            )}

            {form.watch("isManualTyping") && (
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
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

export default MeetingAgendaForm;

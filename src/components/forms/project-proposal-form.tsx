/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectProposal } from "@prisma/client";
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
import { projectProposalSchema } from "@/validators";
import Heading from "@/components/globals/heading";
import { Separator } from "@/components/ui/separator";
import SingleFileUpload from "@/components/globals/file-upload";
import { ProjectProposalFormValues } from "@/types/types";
import { createProjectProposal, updateProjectProposal } from "@/actions";
import { RichTextEditor } from "@/components/globals/rich-text-editor";
import { Switch } from "@/components/ui/switch";
import { convertHtmlToDocx } from "@/lib/utils";
import { uploadToSupabase } from "@/lib/upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMMITTEE } from "@/lib/constants";

interface ProjectProposalFormProps {
  initialData: ProjectProposal | null;
  onClose?: () => void;
  userId: string;
}

const ProjectProposalForm: React.FC<ProjectProposalFormProps> = ({
  initialData,
  onClose,
  userId,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<ProjectProposalFormValues>({
    resolver: zodResolver(projectProposalSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      isManualTyping: initialData.fileUrl ? false : true,
      content: initialData.description || "",
      budget: initialData.budget,
      fileUrl: initialData.fileUrl || "",
      isThereCollaboration: (initialData as any).isThereCollaboration || false,
      committee: (initialData as any).committee || "",
    } : {
      title: "",
      isManualTyping: true,
      content: "",
      budget: 0,
      fileUrl: "",
      isThereCollaboration: false,
      committee: "",
    },
  });

  const onSubmit = async (data: ProjectProposalFormValues) => {
    try {
      setLoading(true);

      if (data.isManualTyping) {
        // Create a DOCX file from typed content
        const docxBlob = await convertHtmlToDocx(data.content || "", data.title);

        const file = new File([docxBlob], `${data.title}.docx`, {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        const { url: fileUrl } = await uploadToSupabase(file, {
          bucket: "assets",
          onUploading: setLoading,
        });

        data.fileUrl = fileUrl;
      }

      // Save to DB
      if (initialData) {
        await updateProjectProposal(initialData.id, data, userId);
        toast.success("Project proposal updated successfully! 🎉");
      } else {
        await createProjectProposal(data, userId);
        toast.success("Project proposal created successfully! ✨");
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

  const title = initialData
    ? "Edit Project Proposal"
    : "Create Project Proposal";
  const action = initialData ? "Save changes" : "Create proposal";

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
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
              {/* Project Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="e.g., Community Clean-Up"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Project Budget Field */}
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Budget</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="e.g., 10000"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Project Description Field */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
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
            {/* Collaboration Switch */}
            <FormField
              control={form.control}
              name="isThereCollaboration"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-1">
                    <FormLabel>There is Collaboration</FormLabel>
                    <FormDescription>
                      Enable this option if this project proposal has collaboration with other committees.
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
            {/* Committee Select - Only shown when collaboration is enabled */}
            {form.watch("isThereCollaboration") && (
              <FormField
                control={form.control}
                name="committee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Committee <span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a committee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COMMITTEE.map((committee) => (
                          <SelectItem key={committee} value={committee}>
                            {committee}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the committee that collaborated with this project.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {/* File URL Field */}
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

export default ProjectProposalForm;

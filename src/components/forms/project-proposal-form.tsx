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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Button } from "@/components/ui/button";
import { projectProposalSchema } from "@/validators";
import Heading from "@/components/globals/heading";
import { Separator } from "@/components/ui/separator";
import SingleFileUpload from "@/components/globals/file-upload";
import { ProjectProposalFormValues } from "@/types/types";
import { createProjectProposal, updateProjectProposal } from "@/actions";

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
    defaultValues: initialData || {
      title: "",
      description: "",
      budget: 0,
      fileUrl: "",
    },
  });

  const onSubmit = async (data: ProjectProposalFormValues) => {
    try {
      setLoading(true);

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

  const title = initialData ? "Edit Project Proposal" : "Create Project Proposal";
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
            {/* Project Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="e.g., A brief description of the project"
                      {...field}
                      className='max-h-20'
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
                      type='number'
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

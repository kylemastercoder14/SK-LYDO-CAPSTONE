/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BudgetReports } from "@prisma/client";
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
import { Button } from "@/components/ui/button";
import { budgetReportSchema } from "@/validators";
import Heading from "@/components/globals/heading";
import { Separator } from "@/components/ui/separator";
import SingleFileUpload from "@/components/globals/file-upload";
import { BudgetReportFormValues } from "@/types/types";
import { createBudgetReport, updateBudgetReport } from "@/actions";

interface BudgetReportFormProps {
  initialData: BudgetReports | null;
  onClose?: () => void;
  userId: string;
}

const BudgetReportForm: React.FC<BudgetReportFormProps> = ({
  initialData,
  onClose,
  userId,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<BudgetReportFormValues>({
    resolver: zodResolver(budgetReportSchema),
    defaultValues: initialData || {
      name: "",
      fileSize: "",
      fileType: "",
      fileUrl: "",
    },
  });

  const onSubmit = async (data: BudgetReportFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await updateBudgetReport(initialData.id, data, userId);
        toast.success("Budget report updated successfully! 🎉");
      } else {
        await createBudgetReport(data, userId);
        toast.success("Budget report created successfully! ✨");
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

  const title = initialData ? "Edit Budget Report" : "Create Budget Report";
  const action = initialData ? "Save changes" : "Create report";

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
            {/* Budget Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="e.g., Q2 Budget Report"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

export default BudgetReportForm;

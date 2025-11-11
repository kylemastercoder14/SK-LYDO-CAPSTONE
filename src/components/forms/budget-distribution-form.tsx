/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BudgetDistribution } from "@prisma/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { budgetDistributionSchema } from "@/validators";
import Heading from "@/components/globals/heading";
import { Separator } from "@/components/ui/separator";
import { createBudgetDistribution, updateBudgetDistribution } from "@/actions";
import { BudgetDistributionFormValues } from "@/types/types";
import { COMMITTEE } from "@/lib/constants";

interface BudgetDistributionFormProps {
  initialData: BudgetDistribution | null;
  onClose?: () => void;
  userId: string;
  barangay?: string;
}

const BudgetDistributionForm: React.FC<BudgetDistributionFormProps> = ({
  initialData,
  onClose,
  userId,
  barangay,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<BudgetDistributionFormValues>({
    resolver: zodResolver(budgetDistributionSchema),
    defaultValues: {
      allocated: initialData?.allocated || "",
      year: initialData?.year || "",
      spent: initialData?.spent || 0,
    },
  });

  const onSubmit = async (data: BudgetDistributionFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await updateBudgetDistribution(
          initialData.id,
          data,
          userId,
          barangay as string
        );
        toast.success("Budget distribution updated successfully! 🎉");
      } else {
        await createBudgetDistribution(data, userId, barangay as string);
        toast.success("Budget distribution created successfully! ✨");
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
    ? "Edit Budget Distribution"
    : "Create Budget Distribution";
  const action = initialData ? "Save changes" : "Create budget distribution";

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
            {/* Committee Field */}
            <FormField
              control={form.control}
              name="allocated"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Committee</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a committee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COMMITTEE.map((com) => (
                        <SelectItem key={com} value={com}>
                          {com}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Budget Spent Field */}
            <FormField
              control={form.control}
              name="spent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Spent</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      type="number"
                      placeholder="e.g., 40,000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Year */}
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="e.g., 2025"
                      {...field}
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

export default BudgetDistributionForm;

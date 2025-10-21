/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resolution } from "@prisma/client";
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
import { resolutionSchema } from "@/validators";
import Heading from "@/components/globals/heading";
import { Separator } from "@/components/ui/separator";
import SingleFileUpload from "@/components/globals/file-upload";
import { ResolutionFormValues } from "@/types/types";
import { createResolution, updateResolution } from "@/actions";

interface ResolutionFormProps {
  initialData: Resolution | null;
  onClose?: () => void;
  userId: string;
}

const ResolutionForm: React.FC<ResolutionFormProps> = ({
  initialData,
  onClose,
  userId,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<ResolutionFormValues>({
	resolver: zodResolver(resolutionSchema),
	defaultValues: initialData || {
	  name: "",
	  fileSize: "",
	  fileType: "",
	  fileUrl: "",
	},
  });

  const onSubmit = async (data: ResolutionFormValues) => {
	try {
	  setLoading(true);

	  if (initialData) {
		await updateResolution(initialData.id, data, userId);
		toast.success("resolution updated successfully! 🎉");
	  } else {
		await createResolution(data, userId);
		toast.success("resolution created successfully! ✨");
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

  const title = initialData ? "Edit Resolution" : "Create Resolution";
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
			{/* Resolution Name Field */}
			<FormField
			  control={form.control}
			  name="name"
			  render={({ field }) => (
				<FormItem>
				  <FormLabel>Resolution Name</FormLabel>
				  <FormControl>
					<Input
					  disabled={loading}
					  placeholder="e.g., Community Resolution"
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

export default ResolutionForm;

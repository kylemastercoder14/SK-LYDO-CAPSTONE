"use client";

import React, { useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Officials, User } from "@prisma/client";
import { officialSchema } from "@/validators";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { BARANGAYS } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createUserAccount, updateUserAccount } from "@/actions";

const REQUIRED_POSITIONS = [
  "SK Chairman",
  "Secretary",
  "Treasurer",
  "Kagawad 1",
  "Kagawad 2",
  "Kagawad 3",
  "Kagawad 4",
  "Kagawad 5",
  "Kagawad 6",
  "Kagawad 7",
];

const OfficialForm = ({
  initialData,
  users,
}: {
  initialData: Officials | null;
  users: User[];
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof officialSchema>>({
    resolver: zodResolver(officialSchema),
    defaultValues: {
      barangay: "",
      officials: REQUIRED_POSITIONS.map((pos) => ({
        userId: "",
        position: pos,
        committee: "",
      })),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "officials",
  });

  const selectedBarangay = form.watch("barangay");
  const officials = form.watch("officials");

  const { isSubmitting } = form.formState;

  // Prevent duplicate positions in select dropdown
  const availablePositions = useMemo(() => {
    const chosen = officials.map((o) => o.position);
    return REQUIRED_POSITIONS.filter((pos) => !chosen.includes(pos));
  }, [officials]);

  async function onSubmit(values: z.infer<typeof officialSchema>) {
    try {
      //   if (initialData) {
      //     const res = await updateOfficial(values, initialData.id);
      //     if (res.success) {
      //       toast.success(res.success);
      //       router.push("/admin/officials");
      //     } else {
      //       toast.error(res.error);
      //     }
      //   } else {
      //     const res = await createOfficial(values);
      //     if (res.success) {
      //       toast.success(res.success);
      //       router.push("/admin/officials");
      //     } else {
      //       toast.error(res.error);
      //     }
      //   }
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  console.log("Users", users);
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-5">
          <FormField
            control={form.control}
            name="barangay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Barangay <span className="text-red-600">*</span>
                </FormLabel>
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="rounded-none w-full">
                      <SelectValue placeholder="Select a barangay" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BARANGAYS.map((barangay) => (
                      <SelectItem
                        key={barangay}
                        value={barangay.toLowerCase().replace(/\s+/g, "-")}
                      >
                        {barangay}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {selectedBarangay && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Committee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    {/* Position Select */}
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`officials.${index}.position`}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(val) => field.onChange(val)}
                            disabled={isSubmitting}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select position" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {/* Keep current value + available ones */}
                              {[
                                field.value,
                                ...availablePositions.filter(
                                  (pos) => pos !== field.value
                                ),
                              ].map((pos) => (
                                <SelectItem key={pos} value={pos}>
                                  {pos}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </TableCell>

                    {/* Name Input */}
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`officials.${index}.userId`}
                        render={({ field }) => {
                          // Find all selected userIds except current row
                          const selectedUserIds = officials
                            .map((o, i) => (i !== index ? o.userId : null))
                            .filter(Boolean);

                          const availableUsers = users.filter(
                            (u) => !selectedUserIds.includes(u.id)
                          );

                          return (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={isSubmitting || !selectedBarangay}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select account" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableUsers.map((user) => {
                                  const displayName =
                                    user.firstName || user.lastName
                                      ? `${user.firstName ?? ""} ${
                                          user.lastName ?? ""
                                        }`.trim()
                                      : user.username; // fallback if no first/last name

                                  return (
                                    <SelectItem key={user.id} value={user.id}>
                                      {displayName}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          );
                        }}
                      />
                    </TableCell>

                    {/* Committee Input */}
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`officials.${index}.committee`}
                        render={({ field }) => (
                          <Input
                            {...field}
                            disabled={isSubmitting}
                            placeholder="Enter committee"
                          />
                        )}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <div className="flex items-center justify-end gap-2">
            <Button
              disabled={isSubmitting}
              type="button"
              onClick={() => router.back()}
              variant="ghost"
            >
              <ArrowLeft className="size-4" /> Cancel
            </Button>
            <Button disabled={isSubmitting} type="submit" variant="primary">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />{" "}
                  {initialData ? "Saving Changes..." : "Submitting..."}
                </>
              ) : (
                <>
                  <Save className="size-4" />{" "}
                  {initialData ? "Save Changes" : "Submit"}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default OfficialForm;

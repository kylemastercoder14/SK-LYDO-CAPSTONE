"use client";

import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { User } from "@prisma/client";
import { registerSchema } from "@/validators";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
import { ArrowLeft, Copy, Loader2, Save } from "lucide-react";
import { BARANGAYS } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { generateRandomPassword } from "@/lib/utils";
import { toast } from "sonner";
import { createUserAccount, updateUserAccount } from "@/actions";

const UserAccountForm = ({ initialData }: { initialData: User | null }) => {
  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: initialData?.username || "",
      password: "",
      role: initialData?.role || "SK_OFFICIAL",
      officialType: initialData?.officialType || "",
      barangay: initialData?.barangay || "",
    },
  });

  const { isSubmitting } = form.formState;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    toast.success("Password copied to clipboard!");
  };

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      if (initialData) {
        const res = await updateUserAccount(values, initialData.id);
        if (res.success) {
          toast.success(res.success);
          router.push("/admin/accounts");
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createUserAccount(values);
        if (res.success) {
          setGeneratedPassword(values.password);
          setShowPasswordModal(true);
        } else {
          toast.error(res.error);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }
  return (
    <>
      {/* Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account Created Successfully</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              The account has been created. Here&apos;s the generated password:
            </p>

            <div className="flex items-center gap-2">
              <Input
                value={generatedPassword}
                readOnly
                className="font-mono rounded-none"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Please copy this password and provide it to the user. They can
              change it after logging in.
            </p>

            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={() => {
                  setShowPasswordModal(false);
                  router.push("/admin/accounts");
                }}
              >
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-5">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Username <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter username"
                    className="rounded-none"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  Make sure that the username is unique and not already taken.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password <span className="text-red-600">*</span>
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder="Enter default password"
                      className="rounded-none pr-10"
                      {...field}
                      disabled={isSubmitting}
                      type="text"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => {
                      const generatedPassword = generateRandomPassword();
                      form.setValue("password", generatedPassword);
                    }}
                  >
                    Generate
                  </Button>
                </div>
                <FormDescription>
                  This will be the default password for the user. They can
                  change it later.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Position <span className="text-red-600">*</span>
                </FormLabel>
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="rounded-none w-full">
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SK_FEDERATION">SK Federation</SelectItem>
                    <SelectItem value="LYDO">LYDO</SelectItem>
                    <SelectItem value="SK_OFFICIAL">SK Official</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("role") === "SK_OFFICIAL" && (
            <FormField
              control={form.control}
              name="officialType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Type <span className="text-red-600">*</span>
                  </FormLabel>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-none w-full">
                        <SelectValue placeholder="Select a position" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CHAIRPERSON">
                        Chairperson
                      </SelectItem>
                      <SelectItem value="KAGAWAD">Kagawad</SelectItem>
                      <SelectItem value="TREASURER">Treasurer</SelectItem>
                      <SelectItem value="SECRETARY">Secretary</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {form.watch("role") === "SK_OFFICIAL" && (
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
                        <SelectValue placeholder="Select a barangay assigned" />
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

export default UserAccountForm;

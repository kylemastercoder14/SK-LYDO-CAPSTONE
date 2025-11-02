/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { User } from "@prisma/client";
import { profileUpdateSchema } from "@/validators";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { updateUserProfile } from "@/actions";
import { useRouter } from "next/navigation";
import SingleFileUpload from "@/components/globals/file-upload";

interface ProfileFormProps {
  user: User;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user }) => {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>(user.image || "");

  const form = useForm<z.infer<typeof profileUpdateSchema>>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      image: user.image || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      username: user.username || "",
      password: "",
      bio: user.bio || "",
      securityQuestion: user.securityQuestion || "",
      securityAnswer: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof profileUpdateSchema>) {
    try {
      // Include image URL in values
      const submitValues = {
        ...values,
        image: imageUrl,
      };

      const res = await updateUserProfile(submitValues, user.id);

      if (res.success) {
        toast.success(res.message || "Profile updated successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  const handleImageUpload = (file: { url: string; size: number; type: string }) => {
    setImageUrl(file.url);
    form.setValue("image", file.url);
  };

  const getInitials = () => {
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <div className="mt-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Picture Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Profile Picture</h3>
              <div className="flex items-start gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage className='object-cover' src={imageUrl} alt={user.username} />
                  <AvatarFallback className="text-lg">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <SingleFileUpload
                    onFileUpload={handleImageUpload}
                    defaultValue={imageUrl}
                    bucket="assets"
                    maxFileSizeMB={5}
                    acceptedFileTypes={{
                      "image/*": [".png", ".jpeg", ".jpg", ".webp", ".gif"],
                    }}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Upload a profile picture. Recommended size: 400x400px. Max 5MB.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Personal Information Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter first name"
                          className="rounded-none"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter last name"
                          className="rounded-none"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="mt-4">
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
                      Your username must be unique and at least 3 characters long.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself..."
                        className="rounded-none min-h-[100px]"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      A short bio about yourself (optional).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Security Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Security</h3>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Leave blank to keep current password"
                        className="rounded-none"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Leave blank if you don't want to change your password. Password must be at least 6 characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="securityQuestion"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Security Question</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., What is your mother's maiden name?"
                        className="rounded-none"
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormDescription>
                      You cannot choose another security question for password recovery.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="securityAnswer"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Security Answer</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter security answer"
                        className="rounded-none"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Your security answer will be encrypted. Leave blank to keep current answer.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-2">
            <Button
              disabled={isSubmitting}
              type="submit"
              variant="primary"
              className="rounded-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;


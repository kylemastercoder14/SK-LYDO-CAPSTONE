"use client";

import React, { useActionState, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  Send,
  TriangleAlert,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/globals/header";
import { useFormStatus } from "react-dom";
import { cn, FormState, initialState } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { loginAction, updateSecurityQuestion } from "@/actions";
import { Modal } from "@/components/ui/modal";
import { SECURITY_QUESTIONS } from "@/lib/constants";

type SecurityState = {
  success: boolean;
  error?: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="cursor-pointer"
      variant="primary"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Signing in
        </>
      ) : (
        <>
          <Send className="size-4" />
          Sign in
        </>
      )}
    </Button>
  );
}

const SecuritySubmitButton = ({pending}: {pending: boolean}) => {
  return (
    <Button
      type="submit"
      className="w-full"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Saving...
        </>
      ) : (
        "Submit"
      )}
    </Button>
  );
};

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isSettingSecurity, setIsSettingSecurity] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const router = useRouter();

  const [state, formAction] = useActionState<FormState, FormData>(
    loginAction,
    initialState
  );

  const [securityState, securityFormAction] = useActionState<
    SecurityState,
    FormData
  >(
    async (prevState, formData) => {
      setIsSettingSecurity(true);
      try {
        const result = await updateSecurityQuestion(
          formData.get("userId") as string,
          formData.get("securityQuestion") as string,
          formData.get("securityAnswer") as string
        );

        if (result.success) {
          setShowSecurityModal(false);
          if (state?.redirect) {
            setIsRedirecting(true);
            router.push(state.redirect);
          }
          return { success: true };
        }
        return {
          success: false,
          error: result.error || "Failed to set security question",
        };

      } catch (error) {
        console.error("Error updating security question:", error);
        return {
          success: false,
          error: "An unexpected error occurred",
        };
      } finally {
        setIsSettingSecurity(false);
      }
    },
    { success: false, error: undefined }
  );

  React.useEffect(() => {
    if (state?.success) {
      if (state.hasSecurityQuestion === false) {
        setShowSecurityModal(true);
      } else if (state.hasSecurityQuestion && state.redirect) {
        setIsRedirecting(true);
        const timer = setTimeout(() => {
          router.push(state.redirect!);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [state, router]);

  return (
    <>
      <Modal
        className="max-w-5xl p-5 rounded-none bg-white dark:bg-[#30334e]"
        isOpen={showSecurityModal}
        onClose={() => {
          // Clear any previous errors when closing
          securityFormAction(new FormData());
          setShowSecurityModal(true);
        }}
      >
        <Card className="w-full bg-transparent border-none shadow-none p-0">
          <CardHeader className="p-0">
            <CardTitle>Security Question</CardTitle>
            <CardDescription>
              Please set up your security question for account recovery.
            </CardDescription>
            {/* Add error display for security question form */}
            {securityState?.error && (
              <div className="dark:bg-red-400/20 text-sm bg-red-600/20 text-red-700 py-3 justify-center dark:text-red-300 flex items-center gap-2 px-3 rounded-md mb-4">
                <TriangleAlert className="size-4" />
                {securityState.error}
              </div>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <form
              action={securityFormAction}
              onSubmit={(e) => {
                // Prevent default to handle submission via action
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                securityFormAction(formData);
              }}
            >
              <input type="hidden" name="userId" value={state.user?.id || ""} />
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="securityQuestion">Security Question</Label>
                  <Select
                    disabled={securityState.success || isSettingSecurity}
                    name="securityQuestion"
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a question" />
                    </SelectTrigger>
                    <SelectContent>
                      {SECURITY_QUESTIONS.map((question) => (
                        <SelectItem key={question} value={question}>
                          {question}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="securityAnswer">Answer</Label>
                  <Input
                    id="securityAnswer"
                    name="securityAnswer"
                    type="text"
                    required
                    placeholder="Enter your answer"
                    disabled={securityState.success || isSettingSecurity}
                  />
                </div>
                <SecuritySubmitButton pending={isSettingSecurity} />
              </div>
            </form>
          </CardContent>
        </Card>
      </Modal>
      <div className="min-h-screen overflow-hidden relative">
        {isRedirecting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg font-medium">
                Redirecting to your dashboard...
              </p>
            </div>
          </div>
        )}
        <Header />
        <section className="auth-background">
          <div className="flex items-center px-80 pt-20 h-screen">
            <Card className="w-full max-w-xl mx-auto rounded-none bg-white dark:bg-[#30334e] shadow-xl px-6 py-6 border border-gray-100 dark:border-gray-700">
              {/* Error Message */}
              {state?.message && !state.success && (
                <div className="dark:bg-red-400/20 text-sm bg-red-600/20 text-red-700 py-3 justify-center dark:text-red-300 flex items-center gap-2 px-3 rounded-md mb-4">
                  <TriangleAlert className="size-4" />
                  {state.message}
                </div>
              )}

              <form action={formAction}>
                <CardHeader className="space-y-1 px-0">
                  <Link
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    href="/"
                  >
                    <LogOut className="size-4" />
                    Go back to homepage
                  </Link>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <CardTitle className="text-3xl font-bold tracking-tight">
                      Welcome back 👋
                    </CardTitle>
                    <CardDescription className="flex flex-col gap-3">
                      <span>Please enter your credentials to login</span>
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="grid gap-5 px-0 pt-2 mt-5">
                  {/* Username Field */}
                  <div className="grid gap-3">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter your username"
                      className={cn(
                        "py-2 h-auto rounded-none",
                        state?.errors?.username && "border-red-500"
                      )}
                    />
                    {state?.errors?.username && (
                      <p className="text-sm text-red-500">
                        {state.errors.username[0]}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="grid gap-3">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className={cn(
                          "py-2 h-auto rounded-none pr-10",
                          state?.errors?.password && "border-red-500"
                        )}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {state?.errors?.password && (
                      <p className="text-sm text-red-500">
                        {state.errors.password[0]}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      name="remember"
                      className="rounded-none"
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember Me
                    </Label>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-primary hover:underline underline-offset-4"
                    >
                      Forgot Password?
                    </Link>
                    <SubmitButton />
                  </div>
                </CardContent>
              </form>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
};

export default Page;

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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Loader2,
  LogOut,
  Send,
  TriangleAlert,
  CheckCircle,
  EyeOff,
  Eye,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/globals/header";
import { useFormStatus } from "react-dom";
import { cn, FormStateForgot, initialStateForgot } from "@/lib/utils";
import { forgotPasswordAction } from "@/actions";

function SubmitButton({ children }: { children: React.ReactNode }) {
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
          Processing...
        </>
      ) : (
        children
      )}
    </Button>
  );
}

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [state, formAction] = useActionState<FormStateForgot, FormData>(
    forgotPasswordAction,
    initialStateForgot
  );

  return (
    <div className="min-h-screen overflow-hidden relative">
      <Header />
      <section className="auth-background">
        <div className="flex items-center px-80 pt-20 h-screen">
          <Card className="w-full max-w-xl rounded-none bg-white dark:bg-[#30334e] shadow-xl px-6 py-6 border border-gray-100 dark:border-gray-700">
            {/* Error Message */}
            {state?.message && !state.success && (
              <div className="dark:bg-red-400/20 text-sm bg-red-600/20 text-red-700 py-3 justify-center dark:text-red-300 flex items-center gap-2 px-3 rounded-md mb-4">
                <TriangleAlert className="size-4" />
                {state.message}
              </div>
            )}

            {/* Success Message */}
            {state?.success && (
              <div className="dark:bg-green-400/20 text-sm bg-green-600/20 text-green-700 py-3 justify-center dark:text-green-300 flex items-center gap-2 px-3 rounded-md mb-4">
                <CheckCircle className="size-4" />
                {state.message}
              </div>
            )}

            <form action={formAction}>
              <input type="hidden" name="step" value={state.step} />

              <CardHeader className="space-y-1 px-0">
                <Link
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  href="/sign-in"
                >
                  <LogOut className="size-4" />
                  Back to Login
                </Link>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <CardTitle className="text-3xl font-bold tracking-tight">
                    Reset Password ⚙️
                  </CardTitle>
                  <CardDescription className="flex flex-col gap-3">
                    {state.step === "username" && (
                      <span>Enter your username to begin password reset</span>
                    )}
                    {state.step === "security" && (
                      <span>
                        Answer your security question to verify your identity
                      </span>
                    )}
                    {state.step === "reset" && (
                      <span>Enter your new password</span>
                    )}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="grid gap-5 px-0 pt-2 mt-5">
                {/* Step 1: Username Verification */}
                {state.step === "username" && (
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
                    <div className="flex justify-end">
                      <SubmitButton>
                        <Send className="size-4" />
                        Continue
                      </SubmitButton>
                    </div>
                  </div>
                )}

                {/* Step 2: Security Question */}
                {state.step === "security" && (
                  <>
                    <input
                      type="hidden"
                      name="username"
                      value={state.username || ""}
                    />
                    <input
                      type="hidden"
                      name="securityQuestion"
                      value={state.securityQuestion || ""}
                    />
                    <div className="grid gap-3">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        disabled
                        defaultValue={state.username || ""}
                        className="py-2 h-auto rounded-none bg-gray-100 dark:bg-gray-800"
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="securityQuestion">
                        Security Question
                      </Label>
                      <Input
                        id="securityQuestion"
                        name="securityQuestion"
                        type="text"
                        disabled
                        defaultValue={state.securityQuestion || ""}
                        className="py-2 h-auto rounded-none bg-gray-100 dark:bg-gray-800"
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="securityAnswer">Your Answer</Label>
                      <Input
                        id="securityAnswer"
                        name="securityAnswer"
                        type="text"
                        placeholder="Enter your answer"
                        className={cn(
                          "py-2 h-auto rounded-none",
                          state?.errors?.securityAnswer && "border-red-500"
                        )}
                      />
                      {state?.errors?.securityAnswer && (
                        <p className="text-sm text-red-500">
                          {state.errors.securityAnswer[0]}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <SubmitButton>
                        <Send className="size-4" />
                        Verify
                      </SubmitButton>
                    </div>
                  </>
                )}

                {/* Step 3: Password Reset */}
                {state.step === "reset" && (
                  <>
                  <input
                      type="hidden"
                      name="username"
                      value={state.username || ""}
                    />
                    <div className="grid gap-3">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your new password"
                          className={cn(
                            "py-2 h-auto rounded-none pr-10",
                            state?.errors?.newPassword && "border-red-500"
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
                      {state?.errors?.newPassword && (
                        <p className="text-sm text-red-500">
                          {state.errors.newPassword[0]}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your new password"
                          className={cn(
                            "py-2 h-auto rounded-none pr-10",
                            state?.errors?.confirmPassword && "border-red-500"
                          )}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {state?.errors?.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {state.errors.confirmPassword[0]}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <SubmitButton>
                        <Send className="size-4" />
                        Reset Password
                      </SubmitButton>
                    </div>
                  </>
                )}
              </CardContent>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Page;

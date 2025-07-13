import { UserRole } from "@prisma/client";
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.nativeEnum(UserRole),
  remember: z.boolean().optional(),
});

export const usernameSchema = z.object({
  username: z.string().min(1, "Username is required"),
  step: z.literal("username"),
});

export const securitySchema = z.object({
  username: z.string().min(1),
  securityQuestion: z.string().min(1),
  securityAnswer: z.string().min(1, "Answer is required"),
  step: z.literal("security"),
});

export const passwordResetSchema = z
  .object({
    username: z.string().min(1),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    step: z.literal("reset"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const registerSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.nativeEnum(UserRole),
    barangay: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === UserRole.SK_OFFICIAL && !data.barangay) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Barangay is required for SK Official role",
        path: ["barangay"],
      });
    }
  });

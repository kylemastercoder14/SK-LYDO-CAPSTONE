import { UserRole } from "@prisma/client";
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.nativeEnum(UserRole),
  remember: z.boolean().optional(),
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

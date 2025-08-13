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
    officialType: z.string().optional(),
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

    if (data.role === UserRole.SK_OFFICIAL && !data.officialType?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Official type is required for SK Official role",
        path: ["officialType"],
      });
    }
  });

export const projectReportSchema = z.object({
  name: z.string().min(1, { message: "Project name is required." }),
  fileSize: z.string().min(1, { message: "File size is required." }),
  fileType: z.string().min(1, { message: "File type is required." }),
  fileUrl: z.string().url({ message: "A valid file URL is required." }),
});

export const budgetReportSchema = z.object({
  name: z.string().min(1, { message: "Project name is required." }),
  fileSize: z.string().min(1, { message: "File size is required." }),
  fileType: z.string().min(1, { message: "File type is required." }),
  fileUrl: z.string().url({ message: "A valid file URL is required." }),
});

export const projectProposalSchema = z.object({
  title: z.string().min(1, { message: "Project title is required." }),
  description: z
    .string()
    .min(1, { message: "Project description is required." }),
  budget: z.coerce
    .number()
    .min(0, { message: "Budget must be a positive number." }),
  fileUrl: z.string().url({ message: "A valid file URL is required." }),
});

export const cbydpReportSchema = z.object({
  name: z.string().min(1, { message: "CBYDP name is required." }),
  fileSize: z.string().min(1, { message: "File size is required." }),
  fileType: z.string().min(1, { message: "File type is required." }),
  fileUrl: z.string().url({ message: "A valid file URL is required." }),
});

export const meetingAgendaSchema = z.object({
  name: z.string().min(1, { message: "Meeting agenda name is required." }),
  fileSize: z.string().min(1, { message: "File size is required." }),
  fileType: z.string().min(1, { message: "File type is required." }),
  fileUrl: z.string().url({ message: "A valid file URL is required." }),
});

export const meetingMinutesSchema = z.object({
  name: z.string().min(1, { message: "Minutes of meeting name is required." }),
  fileSize: z.string().min(1, { message: "File size is required." }),
  fileType: z.string().min(1, { message: "File type is required." }),
  fileUrl: z.string().url({ message: "A valid file URL is required." }),
});

export const officialSchema = z.object({
  barangay: z.string().min(1, "Barangay is required."),
  officials: z
    .array(
      z.object({
        userId: z.string().min(1, "User is required."),
        position: z.string().min(1, "Position is required."),
        committee: z.string().optional(),
      })
    )
    .length(10, "All 10 officials must be filled.")
    .refine((officials) => officials.every((o) => o.userId.trim() !== ""), {
      message: "All officials must have a user.",
    })
    .refine(
      (officials) =>
        new Set(officials.map((o) => o.position)).size === officials.length,
      { message: "Duplicate positions are not allowed." }
    )
    .refine(
      (officials) =>
        new Set(officials.map((o) => o.userId)).size === officials.length,
      { message: "Duplicate users are not allowed." }
    ),
});

export const eventSchema = z.object({
  name: z.string().min(1, { message: "Event name is required." }),
  description: z.string().min(1, { message: "Event description is required." }),
  thumbnail: z.string().url({ message: "Thumbnail is required." }),
  barangay: z.string().min(1, { message: "Barangay is required." }),
  startDate: z.string().min(1, { message: "Start date is required." }),
  endDate: z.string().min(1, { message: "End date is required." }),
});

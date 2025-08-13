/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { compare, hash } from "bcryptjs";
import db from "@/lib/db";
import { cookies } from "next/headers";
import {
  budgetReportSchema,
  cbydpReportSchema,
  loginSchema,
  meetingAgendaSchema,
  meetingMinutesSchema,
  passwordResetSchema,
  projectProposalSchema,
  projectReportSchema,
  registerSchema,
  securitySchema,
  usernameSchema,
} from "@/validators";
import { ROLE_CONFIG, UserRole } from "@/lib/config";
import z from "zod";
import { FormState, FormStateForgot } from "@/lib/utils";
import {
  BudgetReportFormValues,
  CBYDPReportFormValues,
  MeetingAgendaFormValues,
  MinutesMeetingFormValues,
  ProjectProposalFormValues,
  ProjectReportFormValues,
} from "@/types/types";
import { OfficialType } from "@prisma/client";

export async function setAuthCookie(userId: string, remember: boolean) {
  (await cookies()).set("auth-session", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: remember ? 30 * 24 * 60 * 60 : undefined,
  });
}

export async function loginAction(
  prevState: any,
  formData: FormData
): Promise<FormState> {
  try {
    const validatedFields = loginSchema.safeParse({
      username: formData.get("username"),
      password: formData.get("password"),
      role: formData.get("role"),
      remember: formData.get("remember") === "on",
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Missing Fields. Failed to Login.",
      };
    }

    const { username, password, role, remember } = validatedFields.data;

    // Check if user exists
    const user = await db.user.findUnique({
      where: { username },
    });

    if (!user) {
      return {
        errors: { username: ["Invalid username or password"] },
        message: "Invalid credentials",
      };
    }

    // Verify password - with support for both hashed and plaintext
    let passwordMatch = false;

    // Check if the stored password looks like a bcrypt hash
    const isPasswordHashed =
      user.password.startsWith("$2a$") ||
      user.password.startsWith("$2b$") ||
      user.password.startsWith("$2y$");

    if (isPasswordHashed) {
      // Compare with bcrypt if password is hashed
      passwordMatch = await compare(password, user.password);
    } else {
      // Direct comparison for plaintext (temporary for default passwords)
      passwordMatch = password === user.password;
    }

    if (!passwordMatch) {
      return {
        errors: { password: ["Invalid username or password"] },
        message: "Invalid credentials",
      };
    }

    // Verify role
    if (user.role !== role) {
      return {
        errors: { role: ["You don't have permission to access this role"] },
        message: "Role permission denied",
      };
    }

    const hasSecurityQuestion = Boolean(
      user.securityQuestion && user.securityAnswer
    );

    // insert user activity log
    await db.systemLogs.create({
      data: {
        userId: user.id,
        action: "login",
        details: `${user.username} logged in`,
      },
    });

    // Set session cookie
    if (hasSecurityQuestion) {
      await setAuthCookie(user.id, remember ?? false);
    }

    // Get redirect URL from form data if it exists
    const redirectUrl = formData.get("redirect")?.toString() || "";

    // Default to role-specific dashboard
    let finalRedirect: (typeof ROLE_CONFIG)[UserRole]["dashboard"] =
      ROLE_CONFIG[user.role as UserRole].dashboard;

    // Use redirect URL only if it's valid for the user's role and matches a known dashboard
    if (
      redirectUrl &&
      redirectUrl === ROLE_CONFIG[user.role as UserRole].dashboard
    ) {
      finalRedirect =
        redirectUrl as (typeof ROLE_CONFIG)[UserRole]["dashboard"];
    }

    return {
      success: true,
      message: "Login successful",
      user: { role: user.role, id: user.id },
      hasSecurityQuestion,
      redirect: finalRedirect,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      message: "An error occurred while logging in",
      errors: {},
    };
  } finally {
    await db.$disconnect();
  }
}

export async function updateSecurityQuestion(
  userId: string,
  securityQuestion: string,
  securityAnswer: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!userId) {
      return { success: false, error: "User ID is required" };
    }
    if (!securityQuestion || !securityAnswer) {
      return { success: false, error: "All fields are required" };
    }

    const hashedAnswer = await hash(securityAnswer, 10);

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        securityQuestion,
        securityAnswer: hashedAnswer,
      },
    });

    if (!updatedUser) {
      return { success: false, error: "Failed to update user" };
    }

    await setAuthCookie(userId, true);

    return { success: true };
  } catch (error: any) {
    console.error("Error updating security question:", error);
    return {
      success: false,
      error: error.message || "Failed to update security question",
    };
  } finally {
    await db.$disconnect();
  }
}

export async function forgotPasswordAction(
  prevState: FormStateForgot,
  formData: FormData
): Promise<FormStateForgot> {
  try {
    const step = formData.get("step") as "username" | "security" | "reset";

    // Step 1: Validate username
    if (step === "username") {
      const validatedFields = usernameSchema.safeParse({
        username: formData.get("username"),
        step: formData.get("step"),
      });

      if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: "Missing Fields. Failed to verify username.",
          step: "username",
        };
      }

      const { username } = validatedFields.data;

      // Check if user exists
      const user = await db.user.findUnique({
        where: { username },
        select: {
          id: true,
          username: true,
          securityQuestion: true,
        },
      });

      if (!user) {
        return {
          errors: { username: ["No user found with this username"] },
          message: "User not found",
          step: "username",
        };
      }

      if (!user.securityQuestion) {
        return {
          errors: { username: ["No security question set for this account"] },
          message: "No security question configured",
          step: "username",
        };
      }

      return {
        success: true,
        message: "Username verified",
        step: "security",
        username: user.username,
        securityQuestion: user.securityQuestion,
      };
    }

    // Step 2: Validate security answer
    if (step === "security") {
      const validatedFields = securitySchema.safeParse({
        username: formData.get("username"),
        securityQuestion: formData.get("securityQuestion"),
        securityAnswer: formData.get("securityAnswer"),
        step: formData.get("step"),
      });

      if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: "Missing Fields. Failed to verify security answer.",
          step: "security",
          username: formData.get("username")?.toString(),
          securityQuestion: formData.get("securityQuestion")?.toString(),
        };
      }

      const { username, securityAnswer } = validatedFields.data;

      // Verify security answer
      const user = await db.user.findUnique({
        where: { username },
        select: {
          id: true,
          securityAnswer: true,
        },
      });

      if (!user) {
        return {
          errors: { securityAnswer: ["User not found"] },
          message: "User not found",
          step: "security",
          username,
          securityQuestion: formData.get("securityQuestion")?.toString(),
        };
      }

      const isAnswerCorrect = await compare(
        securityAnswer,
        user.securityAnswer || ""
      );

      if (!isAnswerCorrect) {
        return {
          errors: { securityAnswer: ["Incorrect answer"] },
          message: "Security answer is incorrect",
          step: "security",
          username,
          securityQuestion: formData.get("securityQuestion")?.toString(),
        };
      }

      // Log security question answered
      await db.systemLogs.create({
        data: {
          userId: user.id,
          action: "forgotPassword",
          details: `${username} answered security question correctly`,
        },
      });

      return {
        success: true,
        message: "Security answer verified",
        step: "reset",
        username,
      };
    }

    // Step 3: Reset password
    if (step === "reset") {
      const validatedFields = passwordResetSchema.safeParse({
        username: formData.get("username"),
        newPassword: formData.get("newPassword"),
        confirmPassword: formData.get("confirmPassword"),
        step: formData.get("step"),
      });

      if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: "Missing Fields. Failed to reset password.",
          step: "reset",
          username: formData.get("username")?.toString(),
        };
      }

      const { username, newPassword } = validatedFields.data;

      // Update password
      const hashedPassword = await hash(newPassword, 10);

      const user = await db.user.update({
        where: { username },
        data: { password: hashedPassword },
        select: { id: true, username: true },
      });

      // Log password reset
      await db.systemLogs.create({
        data: {
          userId: user.id,
          action: "passwordReset",
          details: `${username} reset their password`,
        },
      });

      return {
        success: true,
        message:
          "Password reset successfully! You can now login with your new password.",
        step: "reset",
      };
    }

    return {
      message: "Invalid step in password reset process",
      errors: {},
      step: "username",
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      message: "An error occurred while processing the request",
      errors: {},
      step:
        (formData.get("step")?.toString() as
          | "username"
          | "security"
          | "reset"
          | undefined) || "username",
    };
  } finally {
    await db.$disconnect();
  }
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth-session")?.value;

    if (userId) {
      // Insert logout activity log if user ID exists
      await db.systemLogs.create({
        data: {
          userId,
          action: "logout",
          details: "User logged out",
        },
      });
    }

    // Clear the session cookie
    cookieStore.delete("auth-session");

    return {
      success: true,
      message: "Logout successful",
      redirect: "/",
    };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      message: "An error occurred while logging out",
    };
  } finally {
    await db.$disconnect();
  }
}

export async function createUserAccount(
  values: z.infer<typeof registerSchema>
) {
  try {
    const { username, password, role, barangay, officialType } = values;

    // Check if username already exists
    const existingUser = await db.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return {
        error: "Username already exists",
      };
    }

    // Create the user account
    const newUser = await db.user.create({
      data: {
        username,
        password,
        role,
        barangay,
        officialType: (officialType as OfficialType) || undefined,
      },
    });

    return {
      success: "User account created successfully",
      userId: newUser.id,
    };
  } catch (error) {
    console.error("Error creating user account:", error);
    return {
      error: "Failed to create user account",
    };
  } finally {
    await db.$disconnect();
  }
}

export async function updateUserAccount(
  values: z.infer<typeof registerSchema>,
  id: string
) {
  try {
    const { username, password, role, barangay, officialType } = values;

    // Check if username already exists for another user
    const existingUser = await db.user.findFirst({
      where: {
        username,
        NOT: { id },
      },
    });

    if (existingUser) {
      return {
        error: "Username already exists",
      };
    }

    // Update the user account
    const updatedUser = await db.user.update({
      where: { id },
      data: {
        username,
        password,
        role,
        barangay,
        officialType: (officialType as OfficialType) || undefined,
      },
    });

    return {
      success: "User account updated successfully",
      userId: updatedUser.id,
    };
  } catch (error) {
    console.error("Error updating user account:", error);
    return {
      error: "Failed to update user account",
    };
  } finally {
    await db.$disconnect();
  }
}

export async function createProjectReport(
  data: ProjectReportFormValues,
  userId: string
) {
  try {
    const validatedData = projectReportSchema.parse(data);

    const newReport = await db.projectReports.create({
      data: {
        ...validatedData,
        uploadedBy: userId,
      },
    });

    await db.systemLogs.create({
      data: {
        userId,
        action: "createProjectReport",
        details: `Project report "${newReport.name}" created by user ${userId}`,
      },
    });

    return newReport;
  } catch (error) {
    console.error("Error creating project report:", error);
    if (error instanceof z.ZodError) {
      throw new Error(
        "Validation failed: " + error.errors.map((e) => e.message).join(", ")
      );
    }
    throw new Error("Failed to create project report.");
  }
}

export async function updateProjectReport(
  id: string,
  data: ProjectReportFormValues,
  userId: string
) {
  try {
    const validatedData = projectReportSchema.parse(data);
    const existingReport = await db.projectReports.findUnique({
      where: { id },
    });

    if (!existingReport || existingReport.uploadedBy !== userId) {
      throw new Error("Unauthorized to update this report.");
    }

    const updatedReport = await db.projectReports.update({
      where: { id },
      data: {
        ...validatedData,
      },
    });

    await db.systemLogs.create({
      data: {
        userId,
        action: "updateProjectReport",
        details: `Project report "${updatedReport.name}" updated by user ${userId}`,
      },
    });

    return updatedReport;
  } catch (error) {
    console.error(`Error updating project report with ID ${id}:`, error);
    if (error instanceof z.ZodError) {
      throw new Error(
        "Validation failed: " + error.errors.map((e) => e.message).join(", ")
      );
    }
    throw new Error("Failed to update project report.");
  }
}

export async function archiveProjectReport(id: string, userId: string) {
  try {
    const existingReport = await db.projectReports.findUnique({
      where: { id },
    });
    if (!existingReport || existingReport.uploadedBy !== userId) {
      throw new Error("Unauthorized to delete this report.");
    }

    await db.projectReports.update({
      where: { id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    });

    await db.systemLogs.create({
      data: {
        userId,
        action: "archiveProjectReport",
        details: `Project report "${
          existingReport.name
        }" archived by user ${userId} on ${new Date().toISOString()}`,
      },
    });

    return { message: "Project report archived successfully." };
  } catch (error) {
    console.error(`Error archiving project report with ID ${id}:`, error);
    throw new Error("Failed to archive project report.");
  }
}

export async function retrieveProjectReport(id: string, userId: string) {
  try {
    const existingReport = await db.projectReports.findUnique({
      where: { id },
    });
    if (!existingReport || existingReport.uploadedBy !== userId) {
      throw new Error("Unauthorized to retrieve this report.");
    }

    await db.projectReports.update({
      where: { id },
      data: {
        isArchived: false,
        archivedAt: null,
      },
    });

    await db.systemLogs.create({
      data: {
        userId,
        action: "retrieveProjectReport",
        details: `Project report "${
          existingReport.name
        }" retrieved by user ${userId} on ${new Date().toISOString()}`,
      },
    });

    return { message: "Project report retrieved successfully." };
  } catch (error) {
    console.error(`Error retrieving project report with ID ${id}:`, error);
    throw new Error("Failed to retrieve project report.");
  }
}

export async function createBudgetReport(
  data: BudgetReportFormValues,
  userId: string
) {
  try {
    const validatedData = budgetReportSchema.parse(data);

    const newReport = await db.budgetReports.create({
      data: {
        ...validatedData,
        uploadedBy: userId,
      },
    });

    await db.systemLogs.create({
      data: {
        userId,
        action: "createBudgetReport",
        details: `Budget report "${newReport.name}" created by user ${userId}`,
      },
    });

    return newReport;
  } catch (error) {
    console.error("Error creating budget report:", error);
    if (error instanceof z.ZodError) {
      throw new Error(
        "Validation failed: " + error.errors.map((e) => e.message).join(", ")
      );
    }
    throw new Error("Failed to create budget report.");
  }
}

export async function updateBudgetReport(
  id: string,
  data: BudgetReportFormValues,
  userId: string
) {
  try {
    const validatedData = budgetReportSchema.parse(data);
    const existingReport = await db.budgetReports.findUnique({
      where: { id },
    });

    if (!existingReport || existingReport.uploadedBy !== userId) {
      throw new Error("Unauthorized to update this report.");
    }

    const updatedReport = await db.budgetReports.update({
      where: { id },
      data: {
        ...validatedData,
      },
    });

    await db.systemLogs.create({
      data: {
        userId,
        action: "updateBudgetReport",
        details: `Budget report "${updatedReport.name}" updated by user ${userId}`,
      },
    });

    return updatedReport;
  } catch (error) {
    console.error(`Error updating budget report with ID ${id}:`, error);
    if (error instanceof z.ZodError) {
      throw new Error(
        "Validation failed: " + error.errors.map((e) => e.message).join(", ")
      );
    }
    throw new Error("Failed to update budget report.");
  }
}

export async function archiveBudgetReport(id: string, userId: string) {
  try {
    const existingReport = await db.budgetReports.findUnique({
      where: { id },
    });
    if (!existingReport || existingReport.uploadedBy !== userId) {
      throw new Error("Unauthorized to delete this report.");
    }

    await db.budgetReports.update({
      where: { id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    });

    await db.systemLogs.create({
      data: {
        userId,
        action: "archiveBudgetReport",
        details: `Budget report "${
          existingReport.name
        }" archived by user ${userId} on ${new Date().toISOString()}`,
      },
    });

    return { message: "Budget report archived successfully." };
  } catch (error) {
    console.error(`Error archiving budget report with ID ${id}:`, error);
    throw new Error("Failed to archive budget report.");
  }
}

export async function retrieveBudgetReport(id: string, userId: string) {
  try {
    const existingReport = await db.budgetReports.findUnique({
      where: { id },
    });
    if (!existingReport || existingReport.uploadedBy !== userId) {
      throw new Error("Unauthorized to retrieve this report.");
    }

    await db.budgetReports.update({
      where: { id },
      data: {
        isArchived: false,
        archivedAt: null,
      },
    });

    await db.systemLogs.create({
      data: {
        userId,
        action: "retrieveBudgetReport",
        details: `Budget report "${
          existingReport.name
        }" retrieved by user ${userId} on ${new Date().toISOString()}`,
      },
    });

    return { message: "Budget report retrieved successfully." };
  } catch (error) {
    console.error(`Error retrieving budget report with ID ${id}:`, error);
    throw new Error("Failed to retrieve budget report.");
  }
}

export async function createProjectProposal(
  data: ProjectProposalFormValues,
  userId: string
) {
  try {
    const validatedData = projectProposalSchema.parse(data);

    const newReport = await db.projectProposal.create({
      data: {
        ...validatedData,
        createdBy: userId,
      },
    });

    await db.systemLogs.create({
      data: {
        userId,
        action: "createProjectProposal",
        details: `Project proposal "${newReport.title}" created by user ${userId}`,
      },
    });

    return newReport;
  } catch (error) {
    console.error("Error creating project proposal:", error);
    if (error instanceof z.ZodError) {
      throw new Error(
        "Validation failed: " + error.errors.map((e) => e.message).join(", ")
      );
    }
    throw new Error("Failed to create project proposal.");
  }
}

export async function updateProjectProposal(
  id: string,
  data: ProjectProposalFormValues,
  userId: string
) {
  try {
    const validatedData = projectProposalSchema.parse(data);
    const existingReport = await db.projectProposal.findUnique({
      where: { id },
    });

    if (!existingReport || existingReport.createdBy !== userId) {
      throw new Error("Unauthorized to update this project proposal.");
    }

    const updatedReport = await db.projectProposal.update({
      where: { id },
      data: {
        ...validatedData,
      },
    });

    await db.systemLogs.create({
      data: {
        userId,
        action: "updateProjectProposal",
        details: `Project proposal "${updatedReport.title}" updated by user ${userId}`,
      },
    });

    return updatedReport;
  } catch (error) {
    console.error(`Error updating project proposal with ID ${id}:`, error);
    if (error instanceof z.ZodError) {
      throw new Error(
        "Validation failed: " + error.errors.map((e) => e.message).join(", ")
      );
    }
    throw new Error("Failed to update project proposal.");
  }
}

export async function archiveProjectProposal(id: string, userId: string) {
  try {
    const existingReport = await db.projectProposal.findUnique({
      where: { id },
    });
    if (!existingReport || existingReport.createdBy !== userId) {
      throw new Error("Unauthorized to delete this proposal.");
    }

    await db.projectProposal.update({
      where: { id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    });

    await db.systemLogs.create({
      data: {
        userId,
        action: "archiveProjectProposal",
        details: `Project proposal "${
          existingReport.title
        }" archived by user ${userId} on ${new Date().toISOString()}`,
      },
    });

    return { message: "Project proposal archived successfully." };
  } catch (error) {
    console.error(`Error archiving project proposal with ID ${id}:`, error);
    throw new Error("Failed to archive project proposal.");
  }
}

export async function retrieveProjectProposal(id: string, userId: string) {
  try {
    const existingReport = await db.projectProposal.findUnique({
      where: { id },
    });
    if (!existingReport || existingReport.createdBy !== userId) {
      throw new Error("Unauthorized to retrieve this proposal.");
    }

    await db.projectProposal.update({
      where: { id },
      data: {
        isArchived: false,
        archivedAt: null,
      },
    });

    await db.systemLogs.create({
      data: {
        userId,
        action: "retrieveProjectProposal",
        details: `Project proposal "${
          existingReport.title
        }" retrieved by user ${userId} on ${new Date().toISOString()}`,
      },
    });

    return { message: "Project proposal retrieved successfully." };
  } catch (error) {
    console.error(`Error retrieving project proposal with ID ${id}:`, error);
    throw new Error("Failed to retrieve project proposal.");
  }
}

export async function createCBYDPReport(
  data: CBYDPReportFormValues,
  userId: string
) {
  try {
    const validatedData = cbydpReportSchema.parse(data);

    const newReport = await db.cBYDP.create({
      data: {
        ...validatedData,
        uploadedBy: userId,
      },
    });

    await db.systemLogs.create({
      data: {
        userId,
        action: "createCBYDPReport",
        details: `CBYDP report "${newReport.name}" created by user ${userId}`,
      },
    });

    return newReport;
  } catch (error) {
    console.error("Error creating CBYDP report:", error);
    if (error instanceof z.ZodError) {
      throw new Error(
        "Validation failed: " + error.errors.map((e) => e.message).join(", ")
      );
    }
    throw new Error("Failed to create CBYDP report.");
  }
}

export async function updateCBYDPReport(
  id: string,
  data: CBYDPReportFormValues,
  userId: string
) {
  try {
    const validatedData = cbydpReportSchema.parse(data);
    const existingReport = await db.cBYDP.findUnique({
      where: { id },
    });

    if (!existingReport || existingReport.uploadedBy !== userId) {
      throw new Error("Unauthorized to update this CBYDP report.");
    }

    const updatedReport = await db.cBYDP.update({
      where: { id },
      data: {
        ...validatedData,
      },
    });

    await db.systemLogs.create({
      data: {
        userId,
        action: "updateCBYDPReport",
        details: `CBYDP report "${updatedReport.name}" updated by user ${userId}`,
      },
    });

    return updatedReport;
  } catch (error) {
    console.error(`Error updating CBYDP report with ID ${id}:`, error);
    if (error instanceof z.ZodError) {
      throw new Error(
        "Validation failed: " + error.errors.map((e) => e.message).join(", ")
      );
    }
    throw new Error("Failed to update CBYDP report.");
  }
}

export async function archiveCBYDPReport(id: string, userId: string) {
  try {
    const existingReport = await db.cBYDP.findUnique({
      where: { id },
    });
    if (!existingReport || existingReport.uploadedBy !== userId) {
      throw new Error("Unauthorized to delete this report.");
    }

    await db.cBYDP.update({
      where: { id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    });

    await db.systemLogs.create({
      data: {
        userId,
        action: "archiveCBYDPReport",
        details: `CBYDP report "${
          existingReport.name
        }" archived by user ${userId} on ${new Date().toISOString()}`,
      },
    });

    return { message: "CBYDP report archived successfully." };
  } catch (error) {
    console.error(`Error archiving CBYDP report with ID ${id}:`, error);
    throw new Error("Failed to archive CBYDP report.");
  }
}

export async function retrieveCBYDPReport(id: string, userId: string) {
  try {
    const existingReport = await db.cBYDP.findUnique({
      where: { id },
    });
    if (!existingReport || existingReport.uploadedBy !== userId) {
      throw new Error("Unauthorized to retrieve this report.");
    }

    await db.cBYDP.update({
      where: { id },
      data: {
        isArchived: false,
        archivedAt: null,
      },
    });

    await db.systemLogs.create({
      data: {
        userId,
        action: "retrieveCBYDPReport",
        details: `CBYDP report "${
          existingReport.name
        }" retrieved by user ${userId} on ${new Date().toISOString()}`,
      },
    });

    return { message: "CBYDP report retrieved successfully." };
  } catch (error) {
    console.error(`Error retrieving CBYDP report with ID ${id}:`, error);
    throw new Error("Failed to retrieve CBYDP report.");
  }
}

export async function createMeetingAgenda(
  data: MeetingAgendaFormValues,
  userId: string
) {
  try {
    const validatedData = meetingAgendaSchema.parse(data);

    const newReport = await db.meetingAgenda.create({
      data: {
        ...validatedData,
        uploadedBy: userId,
      },
    });

    await db.systemLogs.create({
      data: {
        userId,
        action: "createMeetingAgenda",
        details: `Meeting agenda "${newReport.name}" created by user ${userId}`,
      },
    });

    return newReport;
  } catch (error) {
    console.error("Error creating Meeting Agenda:", error);
    if (error instanceof z.ZodError) {
      throw new Error(
        "Validation failed: " + error.errors.map((e) => e.message).join(", ")
      );
    }
    throw new Error("Failed to create Meeting Agenda.");
  }
}

export async function updateMeetingAgenda(
  id: string,
  data: MeetingAgendaFormValues,
  userId: string
) {
  try {
    const validatedData = meetingAgendaSchema.parse(data);
    const existingReport = await db.meetingAgenda.findUnique({
      where: { id },
    });

    if (!existingReport || existingReport.uploadedBy !== userId) {
      throw new Error("Unauthorized to update this Meeting Agenda.");
    }

    const updatedReport = await db.meetingAgenda.update({
      where: { id },
      data: {
        ...validatedData,
      },
    });

    await db.systemLogs.create({
      data: {
        userId,
        action: "updateMeetingAgenda",
        details: `Meeting agenda "${updatedReport.name}" updated by user ${userId}`,
      },
    });

    return updatedReport;
  } catch (error) {
    console.error(`Error updating Meeting Agenda with ID ${id}:`, error);
    if (error instanceof z.ZodError) {
      throw new Error(
        "Validation failed: " + error.errors.map((e) => e.message).join(", ")
      );
    }
    throw new Error("Failed to update Meeting Agenda.");
  }
}

export async function archiveMeetingAgenda(id: string, userId: string) {
  try {
    const existingReport = await db.meetingAgenda.findUnique({
      where: { id },
    });
    if (!existingReport || existingReport.uploadedBy !== userId) {
      throw new Error("Unauthorized to delete this report.");
    }

    await db.meetingAgenda.update({
      where: { id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    });

    await db.systemLogs.create({
      data: {
        userId,
        action: "archiveMeetingAgenda",
        details: `Meeting agenda "${
          existingReport.name
        }" archived by user ${userId} on ${new Date().toISOString()}`,
      },
    });

    return { message: "Meeting agenda archived successfully." };
  } catch (error) {
    console.error(`Error archiving Meeting Agenda with ID ${id}:`, error);
    throw new Error("Failed to archive Meeting Agenda.");
  }
}

export async function retrieveMeetingAgenda(id: string, userId: string) {
  try {
    const existingReport = await db.meetingAgenda.findUnique({
      where: { id },
    });
    if (!existingReport || existingReport.uploadedBy !== userId) {
      throw new Error("Unauthorized to retrieve this report.");
    }

    await db.meetingAgenda.update({
      where: { id },
      data: {
        isArchived: false,
        archivedAt: null,
      },
    });

    await db.systemLogs.create({
      data: {
        userId,
        action: "retrieveMeetingAgenda",
        details: `Meeting agenda "${
          existingReport.name
        }" retrieved by user ${userId} on ${new Date().toISOString()}`,
      },
    });

    return { message: "Meeting agenda retrieved successfully." };
  } catch (error) {
    console.error(`Error retrieving Meeting Agenda with ID ${id}:`, error);
    throw new Error("Failed to retrieve Meeting Agenda.");
  }
}

export async function createMeetingMinutes(
  data: MinutesMeetingFormValues,
  userId: string
) {
  try {
    const validatedData = meetingMinutesSchema.parse(data);

    const newReport = await db.meetingMinutes.create({
      data: {
        ...validatedData,
        uploadedBy: userId,
      },
    });

    await db.systemLogs.create({
      data: {
        userId,
        action: "createMeetingMinutes",
        details: `Meeting minutes "${newReport.name}" created by user ${userId}`,
      },
    });

    return newReport;
  } catch (error) {
    console.error("Error creating Meeting Minutes:", error);
    if (error instanceof z.ZodError) {
      throw new Error(
        "Validation failed: " + error.errors.map((e) => e.message).join(", ")
      );
    }
    throw new Error("Failed to create Meeting Minutes.");
  }
}

export async function updateMeetingMinutes(
  id: string,
  data: MinutesMeetingFormValues,
  userId: string
) {
  try {
    const validatedData = meetingMinutesSchema.parse(data);
    const existingReport = await db.meetingMinutes.findUnique({
      where: { id },
    });

    if (!existingReport || existingReport.uploadedBy !== userId) {
      throw new Error("Unauthorized to update this Meeting Minutes.");
    }

    const updatedReport = await db.meetingMinutes.update({
      where: { id },
      data: {
        ...validatedData,
      },
    });

    await db.systemLogs.create({
      data: {
        userId,
        action: "updateMeetingMinutes",
        details: `Meeting minutes "${updatedReport.name}" updated by user ${userId}`,
      },
    });

    return updatedReport;
  } catch (error) {
    console.error(`Error updating Meeting Minutes with ID ${id}:`, error);
    if (error instanceof z.ZodError) {
      throw new Error(
        "Validation failed: " + error.errors.map((e) => e.message).join(", ")
      );
    }
    throw new Error("Failed to update Meeting Minutes.");
  }
}

export async function archiveMeetingMinutes(id: string, userId: string) {
  try {
    const existingReport = await db.meetingMinutes.findUnique({
      where: { id },
    });
    if (!existingReport || existingReport.uploadedBy !== userId) {
      throw new Error("Unauthorized to delete this report.");
    }

    await db.meetingMinutes.update({
      where: { id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    });

    await db.systemLogs.create({
      data: {
        userId,
        action: "archiveMeetingMinutes",
        details: `Meeting minutes "${
          existingReport.name
        }" archived by user ${userId} on ${new Date().toISOString()}`,
      },
    });

    return { message: "Meeting minutes archived successfully." };
  } catch (error) {
    console.error(`Error archiving Meeting Minutes with ID ${id}:`, error);
    throw new Error("Failed to archive Meeting Minutes.");
  }
}

export async function retrieveMeetingMinutes(id: string, userId: string) {
  try {
    const existingReport = await db.meetingMinutes.findUnique({
      where: { id },
    });
    if (!existingReport || existingReport.uploadedBy !== userId) {
      throw new Error("Unauthorized to retrieve this report.");
    }

    await db.meetingMinutes.update({
      where: { id },
      data: {
        isArchived: false,
        archivedAt: null,
      },
    });

    await db.systemLogs.create({
      data: {
        userId,
        action: "retrieveMeetingMinutes",
        details: `Meeting minutes "${
          existingReport.name
        }" retrieved by user ${userId} on ${new Date().toISOString()}`,
      },
    });

    return { message: "Meeting minutes retrieved successfully." };
  } catch (error) {
    console.error(`Error retrieving Meeting Minutes with ID ${id}:`, error);
    throw new Error("Failed to retrieve Meeting Minutes.");
  }
}

export async function assignCommittee(formData: FormData) {
  const userId = formData.get("userId") as string;
  const committee = formData.get("committee") as string;

  if (!userId || !committee) {
    throw new Error("Missing required fields");
  }

  await db.user.update({
    where: { id: userId },
    data: { committee },
  });

  return { success: true };
}

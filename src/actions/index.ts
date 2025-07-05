/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { compare } from "bcryptjs";
import db from "@/lib/db";
import { cookies } from "next/headers";
import { loginSchema, registerSchema } from "@/validators";
import { ROLE_CONFIG, UserRole } from "@/lib/config";
import z from "zod";

export async function loginAction(prevState: any, formData: FormData) {
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

    // insert user activity log
    await db.systemLogs.create({
      data: {
        userId: user.id,
        action: "login",
        details: `${user.username} logged in`,
      },
    });

    // Set session cookie
    (await cookies()).set("auth-session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: remember ? 30 * 24 * 60 * 60 : undefined,
    });

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
      user: { role: user.role },
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
    const { username, password, role, barangay } = values;

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
    const { username, password, role, barangay } = values;

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

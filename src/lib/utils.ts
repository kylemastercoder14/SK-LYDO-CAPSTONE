import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserRole } from "./config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type FormState = {
  errors?: {
    username?: string[];
    password?: string[];
    role?: string[];
    remember?: string[];
  };
  message: string;
  success?: boolean;
  redirect?: string;
  user?: {
    role: UserRole;
    id: string;
  };
  hasSecurityQuestion?: boolean;
};

export const initialState: FormState = {
  errors: {},
  message: "",
  success: false,
};

export type FormStateForgot = {
  errors?: {
    username?: string[];
    securityAnswer?: string[];
    newPassword?: string[];
    confirmPassword?: string[];
  };
  message: string;
  success?: boolean;
  securityQuestion?: string;
  step?: "username" | "security" | "reset";
  username?: string;
};

export const initialStateForgot: FormStateForgot = {
  errors: {},
  message: "",
  success: false,
  step: "username",
};

export function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good Morning";
  } else if (hour < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
}

/**
 * Generates a random password with customizable options
 * @param length - Length of the password (default: 12)
 * @param options - Configuration options
 * @returns Generated password
 */
export function generateRandomPassword(
  length: number = 12,
  options: {
    includeNumbers?: boolean;
    includeSymbols?: boolean;
    includeUppercase?: boolean;
    includeLowercase?: boolean;
  } = {}
): string {
  // Default options
  const {
    includeNumbers = true,
    includeSymbols = true,
    includeUppercase = true,
    includeLowercase = true,
  } = options;

  // Character sets
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";

  // Create allowed characters based on options
  let allowedChars = "";
  if (includeLowercase) allowedChars += lowercase;
  if (includeUppercase) allowedChars += uppercase;
  if (includeNumbers) allowedChars += numbers;
  if (includeSymbols) allowedChars += symbols;

  // Throw error if no character sets are selected
  if (allowedChars.length === 0) {
    throw new Error("At least one character set must be included");
  }

  // Generate password
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allowedChars.length);
    password += allowedChars[randomIndex];
  }

  return password;
}

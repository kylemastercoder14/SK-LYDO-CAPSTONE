import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserRole } from "./config";
import { Trend } from "@/types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type FormState = {
  errors?: {
    username?: string[];
    password?: string[];
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
    return "Good morning";
  } else if (hour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
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

export async function ensureBlob(file: File | string): Promise<Blob> {
  if (file instanceof Blob) {
    return file; // If it's already a Blob (which File objects are), return it directly
  }

  // If it's a string, assume it's a data URL and convert it to a Blob
  if (typeof file === "string") {
    try {
      const response = await fetch(file);
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error("Error converting string to Blob:", error);
      throw new Error("Failed to convert string to Blob.");
    }
  }

  // If it's none of the above, throw an error or handle accordingly
  throw new Error(
    "Unsupported file input type. Expected File or a data URL string."
  );
}

export const formattedBudget = (budget: number) => {
  return new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(budget));
};

export const getMonthStartEnd = (date: Date) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
  return { start: startOfMonth, end: endOfMonth };
};

export const getPreviousMonthStartEnd = (date: {
  getFullYear: () => number;
  getMonth: () => number;
}) => {
  const previousMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  return getMonthStartEnd(previousMonth);
};

export const calculateMetrics = (
  current: number,
  previous: number,
  title: string
): {
  data: string;
  previousData: string; // Add previousData property
  percentage: string;
  description: string;
  recommendation: string;
  trend: Trend;
} => {
  const percentage =
    previous > 0
      ? ((current - previous) / previous) * 100
      : current > 0
      ? 100
      : 0;

  const trend: Trend =
    percentage > 0 ? "up" : percentage < 0 ? "down" : "stable";

  let description;
  let recommendation;

  if (trend === "up") {
    description = `Increase in ${title.toLowerCase()} submitted`;
    recommendation = `Encourage continued submissions`;
  } else if (trend === "down") {
    description = `Decrease in ${title.toLowerCase()} submitted`;
    recommendation = `Encourage timely submissions`;
  } else {
    description = `Stable number of ${title.toLowerCase()} submitted`;
    recommendation = `Maintain current reporting practices`;
  }

  return {
    data: current.toString() || "0",
    previousData: previous.toString() || "0", // Return the previous data
    percentage: `${Math.abs(percentage).toFixed(2)}%`,
    description,
    recommendation,
    trend,
  };
};

export function calcTrend(current: number, previous: number) {
  if (previous === 0 && current === 0) {
    return { trending: "up", percentage: "0%" };
  }
  if (previous === 0) {
    return { trending: "up", percentage: "+100%" };
  }

  const change = ((current - previous) / previous) * 100;
  return {
    trending: change >= 0 ? "up" : "down",
    percentage: `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`,
  };
}

export function generateInsights(
  title: string,
  percentage: string,
  trend: "up" | "down"
) {
  switch (title) {
    case "Total SK Members":
      return trend === "up"
        ? {
            description: `Membership increased by ${percentage} this month.`,
            recommendation:
              "Continue outreach and registration efforts to sustain growth.",
          }
        : {
            description: `Membership decreased by ${percentage}.`,
            recommendation:
              "Conduct barangay campaigns to encourage more youth to register.",
          };

    case "Active Programs":
      return trend === "up"
        ? {
            description: `Program count rose by ${percentage}.`,
            recommendation:
              "Monitor program quality to ensure effectiveness and youth participation.",
          }
        : {
            description: `Programs decreased by ${percentage}.`,
            recommendation:
              "Assess reasons for decline and initiate new youth-focused activities.",
          };

    case "Budget Utilization":
      return trend === "up"
        ? {
            description: `Budget utilization improved by ${percentage}.`,
            recommendation:
              "Ensure projects are aligned with youth needs and monitor spending efficiency.",
          }
        : {
            description: `Budget utilization dropped by ${percentage}.`,
            recommendation:
              "Review pending proposals and accelerate fund allocation.",
          };

    case "Upcoming Events":
      return trend === "up"
        ? {
            description: `Upcoming events increased by ${percentage}.`,
            recommendation:
              "Assign committees early to handle logistics and maximize turnout.",
          }
        : {
            description: `Fewer events planned (${percentage} decrease).`,
            recommendation:
              "Plan additional community events to sustain engagement.",
          };

    default:
      return {
        description: `Performance changed by ${percentage}.`,
        recommendation: "Review performance indicators and adjust strategies.",
      };
  }
}

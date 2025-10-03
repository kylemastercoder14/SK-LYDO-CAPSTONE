import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserRole } from "./config";
import { Trend } from "@/types/types";
import jsPDF from "jspdf";

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

export function normalizeBarangay(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-") // spaces → dash
    .replace(/[().]/g, "") // remove parentheses + dots
    .replace(/-+/g, "-"); // collapse multiple dashes
}

export function extractFileExtension(fileUrl: string): string {
  if (!fileUrl) return "";
  try {
    const fileName = fileUrl.split("/").pop() || "";
    const parts = fileName.split(".");
    return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
  } catch {
    return "";
  }
}

export function fileIcon(fileTypeOrUrl: string) {
  const ext = fileTypeOrUrl.includes(".")
    ? extractFileExtension(fileTypeOrUrl)
    : fileTypeOrUrl.toLowerCase();

  switch (ext) {
    case "pdf":
      return "/pdf-icon.svg";
    case "doc":
    case "docx":
      return "/docs-icon.svg";
    case "xls":
    case "xlsx":
    case "csv":
      return "/xlsx-icon.svg";
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
      return "/img-icon.svg";
    case "ppt":
    case "pptx":
      return "/ppt-icon.svg";
    default:
      return "/default-icon.png";
  }
}

export function extractFileName(fileUrl: string): string {
  if (!fileUrl) return "";
  try {
    return fileUrl.split("/").pop() || "";
  } catch {
    return "";
  }
}

// Format file size nicely
export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + " KB";
  }
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

// Map MIME to short labels
export function formatFileType(mime: string): string {
  const map: Record<string, string> = {
    "application/pdf": "PDF",
    "application/msword": "DOC",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "DOCX",
    "application/vnd.ms-excel": "XLS",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
    "application/vnd.ms-powerpoint": "PPT",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "PPTX",
    "text/plain": "TXT",
    "text/csv": "CSV",
    "image/png": "PNG",
    "image/jpeg": "JPG",
    "image/gif": "GIF",
    "image/webp": "WEBP",
  };

  return map[mime] || mime.split("/").pop()?.toUpperCase() || "UNKNOWN";
}

// Enhanced HTML to PDF conversion with proper formatting
export function convertHtmlToPdf(html: string, title: string): jsPDF {
  const doc = new jsPDF();

  // Parse HTML content and extract structured data
  const content = parseHtmlContent(html);

  let yPosition = 20;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 15;
  const maxWidth = pageWidth - margin * 2;

  // Add title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(title, margin, yPosition);
  yPosition += 15;

  // Add a line separator
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Process content blocks
  for (const block of content) {
    if (yPosition > 250) {
      // Check if we need a new page
      doc.addPage();
      yPosition = 20;
    }

    switch (block.type) {
      case "heading":
        yPosition = addHeading(
          doc,
          block.text ?? "",
          yPosition,
          margin,
          maxWidth,
          block.level ?? 1
        );
        break;
      case "paragraph":
        yPosition = addParagraph(
          doc,
          block.text ?? "",
          yPosition,
          margin,
          maxWidth
        );
        break;
      case "list":
        yPosition = addList(
          doc,
          block.items ?? [],
          yPosition,
          margin,
          maxWidth,
          block.ordered ?? false
        );
        break;
      case "table":
        yPosition = addTable(
          doc,
          block.data ?? [],
          yPosition,
          margin,
          maxWidth
        );
        break;
      default:
        yPosition = addParagraph(
          doc,
          block.text ?? "",
          yPosition,
          margin,
          maxWidth
        );
    }

    yPosition += 5; // Add spacing between blocks
  }

  return doc;
}

// Parse HTML content into structured blocks
function parseHtmlContent(html: string) {
  if (!html) return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const blocks = [];

  // Process each element in the HTML
  const elements = doc.body.children;

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const tagName = element.tagName.toLowerCase();

    if (tagName.match(/^h[1-6]$/)) {
      blocks.push({
        type: "heading",
        text: element.textContent?.trim() || "",
        level: parseInt(tagName.charAt(1)),
      });
    } else if (tagName === "p" || tagName === "div") {
      const text = element.textContent?.trim();
      if (text) {
        blocks.push({
          type: "paragraph",
          text: text,
        });
      }
    } else if (tagName === "ul" || tagName === "ol") {
      const items = Array.from(element.querySelectorAll("li"))
        .map((li) => li.textContent?.trim() || "")
        .filter((item) => item.length > 0);

      if (items.length > 0) {
        blocks.push({
          type: "list",
          items: items,
          ordered: tagName === "ol",
        });
      }
    } else if (tagName === "table") {
      const tableData = parseTable(element);
      if (tableData.length > 0) {
        blocks.push({
          type: "table",
          data: tableData,
        });
      }
    } else {
      // Fallback for other elements
      const text = element.textContent?.trim();
      if (text) {
        blocks.push({
          type: "paragraph",
          text: text,
        });
      }
    }
  }

  return blocks;
}

// Add heading to PDF
function addHeading(
  doc: jsPDF,
  text: string,
  y: number,
  margin: number,
  maxWidth: number,
  level: number
): number {
  const fontSize = Math.max(14 - (level - 1) * 2, 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(fontSize);

  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, margin, y);

  return y + lines.length * fontSize * 0.35 + 8;
}

// Add paragraph to PDF
function addParagraph(
  doc: jsPDF,
  text: string,
  y: number,
  margin: number,
  maxWidth: number
): number {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, margin, y);

  return y + lines.length * 11 * 0.35 + 3;
}

// Add list to PDF
function addList(
  doc: jsPDF,
  items: string[],
  y: number,
  margin: number,
  maxWidth: number,
  ordered: boolean
): number {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  let currentY = y;

  items.forEach((item, index) => {
    const bullet = ordered ? `${index + 1}.` : "•";
    const bulletWidth = doc.getTextWidth(bullet + " ");

    // Add bullet
    doc.text(bullet, margin, currentY);

    // Add item text with proper wrapping
    const itemLines = doc.splitTextToSize(item, maxWidth - bulletWidth - 5);
    doc.text(itemLines, margin + bulletWidth + 3, currentY);

    currentY += itemLines.length * 11 * 0.35 + 2;
  });

  return currentY;
}

// Parse HTML table
function parseTable(tableElement: Element): string[][] {
  const rows: string[][] = [];
  const tableRows = tableElement.querySelectorAll("tr");

  tableRows.forEach((row) => {
    const cells: string[] = [];
    const tableCells = row.querySelectorAll("td, th");

    tableCells.forEach((cell) => {
      cells.push(cell.textContent?.trim() || "");
    });

    if (cells.length > 0) {
      rows.push(cells);
    }
  });

  return rows;
}

// Add simple table to PDF
function addTable(
  doc: jsPDF,
  data: string[][],
  y: number,
  margin: number,
  maxWidth: number
): number {
  if (data.length === 0) return y;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const colCount = Math.max(...data.map((row) => row.length));
  const colWidth = maxWidth / colCount;
  let currentY = y;

  data.forEach((row, rowIndex) => {
    // Set header style for first row
    if (rowIndex === 0) {
      doc.setFont("helvetica", "bold");
    } else {
      doc.setFont("helvetica", "normal");
    }

    row.forEach((cell, colIndex) => {
      const x = margin + colIndex * colWidth;
      const cellLines = doc.splitTextToSize(cell, colWidth - 4);
      doc.text(cellLines, x + 2, currentY);
    });

    currentY += 15;

    // Add line after header
    if (rowIndex === 0) {
      doc.setLineWidth(0.3);
      doc.line(margin, currentY - 5, margin + maxWidth, currentY - 5);
    }
  });

  return currentY + 5;
}

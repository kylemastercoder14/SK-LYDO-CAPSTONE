import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserRole } from "./config";
import { Trend } from "@/types/types";
import {
  Document,
  Packer,
  Paragraph,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  TextRun,
  HeadingLevel,
  Header,
  AlignmentType,
} from "docx";

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
    officialType?: string | null;
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

export async function convertHtmlToDocx(
  html: string,
  title: string
): Promise<Blob> {
  // 🔹 Fetch the uploaded header image (ensure path or URL is valid)
  const response = await fetch("/Header.png");
  const headerImageBuffer = await response.arrayBuffer();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const paragraphs: (Paragraph | Table)[] = [];

  // Add the title at the top
  paragraphs.push(
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 300 },
    })
  );

  // Helper: Convert image element to ImageRun
  const createImageRun = async (
    el: HTMLImageElement
  ): Promise<ImageRun | null> => {
    try {
      let imageBuffer: ArrayBuffer;

      if (el.src.startsWith("data:image")) {
        const base64Data = el.src.split(",")[1];
        imageBuffer = Uint8Array.from(atob(base64Data), (c) =>
          c.charCodeAt(0)
        ).buffer;
      } else {
        const response = await fetch(el.src);
        const blob = await response.blob();
        imageBuffer = await blob.arrayBuffer();
      }

      let imageType: "png" | "jpg" | "gif" | "bmp" = "png";
      if (el.src.endsWith(".jpg") || el.src.endsWith(".jpeg"))
        imageType = "jpg";
      else if (el.src.endsWith(".gif")) imageType = "gif";
      else if (el.src.endsWith(".bmp")) imageType = "bmp";

      return new ImageRun({
        data: imageBuffer,
        transformation: {
          width: el.width || 300,
          height: el.height || 200,
        },
        type: imageType,
      });
    } catch {
      return null;
    }
  };

  // Helper: Inline styles
  const parseInlineStyles = (element: HTMLElement): TextRun[] => {
    const runs: TextRun[] = [];
    element.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent?.trim();
        if (text) runs.push(new TextRun(text));
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        const tag = el.tagName.toLowerCase();

        const base = {
          text: el.textContent || "",
          bold: tag === "b" || tag === "strong",
          italics: tag === "i" || tag === "em",
          underline: tag === "u" ? {} : undefined,
        };

        runs.push(new TextRun(base));
      }
    });
    return runs;
  };

  // Recursive HTML parser
  const processNode = async (node: Node): Promise<(Paragraph | Table)[]> => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) return [new Paragraph(text)];
      return [];
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();

      switch (tag) {
        case "h1":
        case "h2":
        case "h3":
          return [
            new Paragraph({
              text: el.textContent || "",
              heading:
                tag === "h1"
                  ? HeadingLevel.HEADING_1
                  : tag === "h2"
                  ? HeadingLevel.HEADING_2
                  : HeadingLevel.HEADING_3,
              spacing: { after: 200 },
            }),
          ];

        case "p":
          return [
            new Paragraph({
              children: parseInlineStyles(el),
              spacing: { after: 150 },
            }),
          ];

        case "ul":
        case "ol":
          return Array.from(el.children).flatMap((li) =>
            li.tagName.toLowerCase() === "li"
              ? [
                  new Paragraph({
                    text: li.textContent || "",
                    bullet: tag === "ul" ? { level: 0 } : undefined,
                    spacing: { after: 100 },
                  }),
                ]
              : []
          );

        case "table": {
          const rows = Array.from(el.querySelectorAll("tr")).map((row) => {
            const cells = Array.from(row.querySelectorAll("th,td")).map(
              (cell) => {
                return new TableCell({
                  children: [
                    new Paragraph({
                      children: parseInlineStyles(cell as HTMLElement),
                    }),
                  ],
                  width: { size: 25, type: WidthType.PERCENTAGE },
                });
              }
            );
            return new TableRow({ children: cells });
          });

          return [
            new Table({
              rows,
              width: { size: 100, type: WidthType.PERCENTAGE },
            }),
          ];
        }

        case "img": {
          const image = await createImageRun(el as HTMLImageElement);
          if (image) {
            return [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [image],
                spacing: { after: 200 },
              }),
            ];
          }
          return [];
        }

        case "br":
          return [new Paragraph({})];

        default:
          const childResults = await Promise.all(
            Array.from(el.childNodes).map((child) => processNode(child))
          );
          return childResults.flat();
      }
    }

    return [];
  };

  // Process all HTML body nodes
  for (const node of Array.from(doc.body.childNodes)) {
    const processed = await processNode(node);
    paragraphs.push(...processed);
  }

  // ✅ Create the document with the header image
  const document = new Document({
    sections: [
      {
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new ImageRun({
                    data: headerImageBuffer,
                    transformation: { width: 500, height: 75 }, // adjust header size
                    type: "png",
                  }),
                ],
              }),
            ],
          }),
        },
        children: paragraphs,
      },
    ],
  });

  return await Packer.toBlob(document);
}

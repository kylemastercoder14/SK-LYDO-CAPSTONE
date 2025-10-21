import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
    const schema = fs.readFileSync(schemaPath, "utf8");

    const modelRegex = /model\s+(\w+)\s+\{([^}]+)\}/g;
    const fieldRegex =
      /^\s*(\w+)\s+([\w?\[\]]+)(?:\s+@[\w()="'._]+)?(?:\s+@[\w()="'._]+)?/gm;

    // 💬 Field descriptions (customized based on your full Prisma schema)
    const descriptions: Record<string, string> = {
      id: "Primary key, auto-generated unique identifier",
      username: "Unique username for system login",
      email: "User email address (unique)",
      image: "Profile image URL of the user",
      firstName: "First name of the user",
      lastName: "Last name of the user",
      bio: "Short biography or description of the user",
      isActive: "Indicates if the user account is active",
      password: "Encrypted password for user login",
      securityQuestion: "Security question for account recovery",
      securityAnswer: "Answer to the user's security question",
      role: "User role in the system (SK_OFFICIAL, LYDO, etc.)",
      barangay: "Barangay assigned to the user",
      createdAt: "Timestamp when the record was created",
      updatedAt: "Timestamp when the record was last updated",
      officialType: "Type of SK official (Chairperson, Kagawad, etc.)",
      lastActiveAt: "Last time the user was active in the system",
      committee: "Committee assigned to the SK official",
      userId: "Foreign key linking to the User model",
      action: "Type of system activity performed",
      details: "Additional details about the log entry",
      uploadedBy: "ID of the user who uploaded the file",
      archivedAt: "Date when the record was archived",
      isArchived: "Indicates if the record is archived",
      name: "Name or title of the uploaded document or item",
      fileSize: "File size in KB or MB",
      fileType: "Type or extension of the file (e.g., PDF, DOCX)",
      fileUrl: "Storage URL where the file is saved",
      allocated: "Allocated budget amount",
      spent: "Amount spent from the budget",
      date: "Date of the meeting or event",
      time: "Time of the meeting or event",
      location: "Location or venue of the meeting",
      title: "Title of the project or proposal",
      description: "Detailed explanation of the record or document",
      budget: "Budget amount allocated for the project",
      status: "Current status (Pending, Approved, Rejected, etc.)",
      reasonForRejection: "Reason why a proposal was rejected",
      createdBy: "User ID of the record creator",
      participantsCount: "Number of participants involved",
      position: "Position or title of the official",
      barangay_: "Barangay where the record belongs",
      startDate: "Starting date of the event or activity",
      endDate: "Ending date of the event or activity",
      action_: "Backup or system action performed",
      filename: "Name of the backup or exported file",
      year: "Year the record or budget is associated with",
      isApproved: "Approval status of the budget or record",
      priority: "Priority level (Low, Medium, High)",
      status_: "Ticket or backup status indicator",
      attachment: "Attached file (optional)",
    };

    const models: {
      model: string;
      fields: {
        name: string;
        type: string;
        constraint: string;
        description: string;
      }[];
    }[] = [];

    let match;
    while ((match = modelRegex.exec(schema)) !== null) {
      const [, modelName, body] = match;
      const fields: {
        name: string;
        type: string;
        constraint: string;
        description: string;
      }[] = [];

      let fieldMatch;
      while ((fieldMatch = fieldRegex.exec(body)) !== null) {
        const [, fieldName, fieldType] = fieldMatch;

        const isOptional = fieldType.includes("?");
        const isArray = fieldType.includes("[]");
        const constraint = isArray
          ? "Array / Relation"
          : isOptional
          ? "Optional"
          : "Not Null";

        fields.push({
          name: fieldName,
          type: fieldType.replace("?", ""),
          constraint,
          description: descriptions[fieldName] || "No description available",
        });
      }

      models.push({ model: modelName, fields });
    }

    return NextResponse.json({ models });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

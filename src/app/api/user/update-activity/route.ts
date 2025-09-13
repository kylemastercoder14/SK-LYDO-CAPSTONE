import { NextResponse } from "next/server";
import db from "@/lib/db";
import { toZonedTime } from "date-fns-tz";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // Check if request has content
    const contentType = request.headers.get("content-type");
    const contentLength = request.headers.get("content-length");

    if (!contentType?.includes("application/json") || contentLength === "0") {
      return NextResponse.json(
        { message: "Request must contain JSON data with userId" },
        { status: 400 }
      );
    }

    // Clone the request to safely read body
    const requestClone = request.clone();
    const body = await requestClone.text();

    if (!body) {
      return NextResponse.json(
        { message: "Request body is empty" },
        { status: 400 }
      );
    }

    let userId: string;
    try {
      const parsedBody = JSON.parse(body);
      userId = parsedBody.userId;
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return NextResponse.json(
        { message: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Get the current time in UTC
    const now = new Date();

    // Convert the time to the 'Asia/Manila' timezone
    const manilaTime = toZonedTime(now, "Asia/Manila");

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        lastActiveAt: manilaTime,
      },
    });

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    return NextResponse.json(
      {
        message: "User activity updated successfully.",
      },
      {
        headers,
      }
    );
  } catch (error) {
    console.error("Error updating user activity:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

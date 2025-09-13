import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const userId = (await params).userId;

  if (!userId) {
    return NextResponse.json(
      { message: "Valid User ID is required" },
      { status: 400 }
    );
  }

  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        lastActiveAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const headers = {
      "Access-Control-Allow-Origin": "*", // Or a specific origin like 'http://localhost:3000'
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    return NextResponse.json(
      { lastActiveAt: user.lastActiveAt },
      {
        headers,
      }
    );
  } catch (error) {
    console.error("Error fetching user last active status:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

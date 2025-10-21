/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const tickets = await db.ticket.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error fetching help center notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch help center notifications" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, attachment, priority, userId } = body;

    if (!title || !description || !priority || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newTicket = await db.ticket.create({
      data: {
        title,
        description,
        attachment: attachment?.url ?? null,
        priority: priority as any,
        status: "OPEN",
        userId,
      },
      include: { user: true },
    });

    return NextResponse.json(newTicket, { status: 201 });
  } catch (error) {
    console.error("Error creating help center ticket:", error);
    return NextResponse.json(
      { error: "Failed to create help center ticket" },
      { status: 500 }
    );
  }
}

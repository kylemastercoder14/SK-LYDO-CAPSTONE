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
    const {
      title,
      description,
      attachment,
      priority,
      userId,
      guestName,
      guestEmail,
    } = body;

    // Validate required fields
    if (!title || !description || !priority) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // If guest user, require guest name & email
    if (!userId && (!guestName || !guestEmail)) {
      return NextResponse.json(
        { error: "Guest name and email are required for guest users." },
        { status: 400 }
      );
    }

    const newTicket = await db.ticket.create({
      data: {
        title,
        description,
        attachment: attachment?.url ?? null,
        priority,
        status: "OPEN",
        userId: userId || null,
        guestName: userId ? null : guestName,
        guestEmail: userId ? null : guestEmail,
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

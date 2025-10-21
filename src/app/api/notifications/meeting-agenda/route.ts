import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "@/lib/session";

export async function GET() {
  const user = await getServerSession();

  try {
    let agendas;

    if (user?.role === "SK_FEDERATION") {
      // 🟢 Federation: see all agendas
      agendas = await db.meetingAgenda.findMany({
        where: {
          isArchived: false,
        },
        include: {
          user: {
            select: { username: true, barangay: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // 🟠 SK Official: only see agendas in their barangay
      agendas = await db.meetingAgenda.findMany({
        where: {
          isArchived: false,
          user: {
            barangay: user?.barangay || "",
          },
        },
        include: {
          user: {
            select: { username: true, barangay: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }
    return NextResponse.json(agendas);
  } catch (error) {
    console.error("Error fetching meeting agendas:", error);
    return NextResponse.json(
      { message: "Error fetching meeting agendas." },
      { status: 500 }
    );
  }
}

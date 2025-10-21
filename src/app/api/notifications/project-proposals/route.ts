import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "@/lib/session";

export async function GET() {
  const user = await getServerSession();

  try {
    const proposals = await db.projectProposal.findMany({
      where: {
        isArchived: false,
        user: {
          barangay: user?.barangay,
        },
      },
      include: { user: { select: { username: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(proposals);
  } catch (error) {
    console.error("Error fetching project proposals:", error);
    return NextResponse.json([], { status: 500 });
  }
}

import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const barangayParam = searchParams.get("barangay");

    console.log("Barangay Assigned", barangayParam);

    // ✅ If "all" or not provided, return all projects
    const barangay =
      barangayParam && barangayParam !== "all"
        ? barangayParam.toLowerCase()
        : null;

    const projects = await db.projectProposal.findMany({
      where: {
        isArchived: false,
        ...(barangay
          ? {
              user: {
                barangay: {
                  equals: barangay, // ✅ match the slug-case format in DB
                  mode: "insensitive",
                },
              },
            }
          : {}), // if null or "all", fetch all
      },
      include: {
        user: {
          select: {
            committee: true,
            barangay: true,
          },
        },
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

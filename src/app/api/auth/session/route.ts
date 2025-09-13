import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const sessionCookie = (await cookies()).get("auth-session");

  if (!sessionCookie?.value) {
    return NextResponse.json(null, { status: 401 });
  }

  try {
    const user = await db.user.findUnique({
      where: { id: sessionCookie.value },
    });

    if (!user) {
      return NextResponse.json(null, { status: 401 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Session API error:", error);
    return NextResponse.json(null, { status: 500 });
  }
}

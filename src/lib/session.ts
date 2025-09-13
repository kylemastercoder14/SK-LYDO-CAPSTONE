import { cookies } from "next/headers";
import db from "./db";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function getSession() {
  const sessionCookie = (await cookies()).get("auth-session");

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/session`,
      {
        headers: {
          Cookie: `auth-session=${sessionCookie.value}`,
        },
      }
    );

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Session error:", error);
    return null;
  }
}

export async function getServerSession() {
  const sessionCookie = (await cookies()).get("auth-session");
  if (!sessionCookie?.value) return null;

  try {
    // Decode JWT from cookie
    const { payload } = await jwtVerify(sessionCookie.value, JWT_SECRET);
    const userId = payload.id as string;

    if (!userId) return null;

    // Ensure prisma is ready before querying
    await db.$connect();

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    return user;
  } catch (err) {
    console.error("Session error:", err);
    return null;
  }
}

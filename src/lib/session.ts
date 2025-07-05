import { cookies } from "next/headers";
import db from "./db";

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

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const user = await db.user.findUnique({
      where: { id: sessionCookie.value },
    });

    return user;
  } catch (error) {
    console.error("Session error:", error);
    return null;
  }
}

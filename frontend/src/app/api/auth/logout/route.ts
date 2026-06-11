import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
    });

    const data = await response.json();
    const nextResponse = NextResponse.json(data, { status: 200 });

    // The backend should return a Set-Cookie header to delete the cookie
    const setCookieHeader = response.headers.get("Set-Cookie");
    if (setCookieHeader) {
      nextResponse.headers.set("Set-Cookie", setCookieHeader);
    } else {
      // Fallback: forcefully delete cookie in Next.js
      nextResponse.cookies.delete("session");
    }

    return nextResponse;
  } catch (error) {
    // If backend is down, we still want to log the user out on the frontend
    const fallbackResponse = NextResponse.json({ message: "Logged out locally" }, { status: 200 });
    fallbackResponse.cookies.delete("session");
    return fallbackResponse;
  }
}

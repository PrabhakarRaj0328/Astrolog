import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST(request: Request) {
  try {
    const { mobile, otp } = await request.json();

    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.detail || "Invalid OTP" }, { status: response.status });
    }

    const nextResponse = NextResponse.json(data, { status: 200 });
    
    // Forward the Set-Cookie header from FastAPI
    const setCookieHeader = response.headers.get("Set-Cookie");
    if (setCookieHeader) {
      nextResponse.headers.set("Set-Cookie", setCookieHeader);
    }

    return nextResponse;
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

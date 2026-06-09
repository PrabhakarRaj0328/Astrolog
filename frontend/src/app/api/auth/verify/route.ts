import { NextResponse } from "next/server";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { mobile, otp } = await request.json();

    if (!mobile || !otp) {
      return NextResponse.json({ error: "Mobile number and OTP are required" }, { status: 400 });
    }

    // Mock OTP Verification Logic:
    // "123456" -> Normal User
    // "654321" -> Admin
    let role = "";
    if (otp === "123456") {
      role = "user";
    } else if (otp === "654321") {
      role = "admin";
    } else {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }

    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
    const sessionToken = await encrypt({ mobile, role, expires });

    (await cookies()).set("session", sessionToken, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ message: "Login successful", role }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

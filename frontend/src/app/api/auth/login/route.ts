import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { mobile } = await request.json();

    if (!mobile) {
      return NextResponse.json({ error: "Mobile number is required" }, { status: 400 });
    }

    // In a real application, you would generate an OTP and send it via an SMS provider here.
    // For this mock setup, we just return success.
    
    return NextResponse.json({ message: "OTP sent successfully (mocked)" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

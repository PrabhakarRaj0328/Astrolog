import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();

  return (
    <div className="container flex-center" style={{ minHeight: "100vh" }}>
      <div className="card text-center" style={{ width: "100%", maxWidth: "600px" }}>
        <h1 className="mb-4">Welcome to OTP Auth App</h1>
        <p className="mb-8" style={{ color: "var(--border)" }}>
          A premium Next.js application featuring dummy OTP authentication and role-based access control.
        </p>
        
        {session ? (
          <div>
            <p className="mb-4">You are signed in as <strong>{session.mobile}</strong> ({session.role})</p>
            <Link href={session.role === "admin" ? "/admin" : "/dashboard"} className="btn btn-primary">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div>
            <Link href="/login" className="btn btn-primary">
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

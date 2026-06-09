import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Double check role, though middleware already handles this
  if (session.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="container" style={{ paddingTop: "4rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Admin Portal</h1>
        <LogoutButton />
      </div>
      
      <div className="card" style={{ borderLeft: "4px solid var(--primary)" }}>
        <h2 className="mb-4">Admin Dashboard</h2>
        <p style={{ color: "var(--border)" }}>
          This is a protected route restricted to administrators.
        </p>
        <div className="mt-4" style={{ padding: "1rem", background: "var(--background)", borderRadius: "var(--radius)" }}>
          <strong>Admin Session Data:</strong>
          <pre style={{ marginTop: "1rem", whiteSpace: "pre-wrap", overflowX: "auto" }}>
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

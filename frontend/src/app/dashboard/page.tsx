import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container" style={{ paddingTop: "4rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Welcome, {session.mobile}</h1>
        <LogoutButton />
      </div>
      
      <div className="card">
        <h2 className="mb-4">User Dashboard</h2>
        <p style={{ color: "var(--border)" }}>
          This is a protected route. Only authenticated users can see this.
        </p>
        <div className="mt-4" style={{ padding: "1rem", background: "var(--background)", borderRadius: "var(--radius)" }}>
          <strong>Your Session Data:</strong>
          <pre style={{ marginTop: "1rem", whiteSpace: "pre-wrap", overflowX: "auto" }}>
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

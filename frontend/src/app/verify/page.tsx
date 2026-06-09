"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyForm() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const mobile = searchParams.get("mobile");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length < 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    if (!mobile) {
      setError("Mobile number is missing. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        const data = await res.json();
        setError(data.error || "Invalid OTP.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
      <h1 className="text-center mb-8">Verify OTP</h1>
      <p className="text-center mb-4" style={{ fontSize: "0.9rem", color: "var(--border)", opacity: 0.8 }}>
        Sent to: {mobile}
      </p>
      <form onSubmit={handleVerify}>
        <div className="form-group">
          <label htmlFor="otp" className="form-label">
            One Time Password
          </label>
          <input
            type="text"
            id="otp"
            className="form-input"
            placeholder="e.g. 123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
          />
          {error && <span className="error-message">{error}</span>}
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }} disabled={loading}>
          {loading ? "Verifying..." : "Verify & Sign In"}
        </button>
      </form>
      <div className="mt-4 text-center" style={{ fontSize: "0.875rem", background: "var(--surface)", border: "1px solid var(--border)", padding: "1rem", borderRadius: "var(--radius)" }}>
        <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Demo Roles:</p>
        <p><strong>User:</strong> 123456</p>
        <p><strong>Admin:</strong> 654321</p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="container flex-center" style={{ minHeight: "100vh" }}>
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyForm />
      </Suspense>
    </div>
  );
}

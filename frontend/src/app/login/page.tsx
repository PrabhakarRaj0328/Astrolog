"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!mobile || mobile.length < 10) {
      setError("Please enter a valid mobile number.");
      return;
    }

    setLoading(true);

    try {
      await api.sendOtp(mobile);
      // Redirect to verify page with mobile number as a query param
      router.push(`/verify?mobile=${encodeURIComponent(mobile)}`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex-center" style={{ minHeight: "100vh" }}>
      <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
        <h1 className="text-center mb-8">Sign In</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="mobile" className="form-label">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              className="form-input"
              placeholder="e.g. 9876543210"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }} disabled={loading}>
            {loading ? "Sending OTP..." : "Get OTP"}
          </button>
        </form>
        <p className="text-center mt-4" style={{ fontSize: "0.875rem", color: "var(--border)", opacity: 0.8 }}>
          Demo: Enter any valid-looking number.
        </p>
      </div>
    </div>
  );
}

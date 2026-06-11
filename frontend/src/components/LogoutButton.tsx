"use client";

import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.error(e);
    }
    router.push("/login");
  };

  return (
    <button onClick={handleLogout} className="btn btn-secondary">
      Logout
    </button>
  );
}

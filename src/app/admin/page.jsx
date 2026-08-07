"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminIndex() {
  const router = useRouter();

  useEffect(() => {
    const sessionStr = typeof window !== "undefined" ? localStorage.getItem("pmv_admin_session") : null;
    if (sessionStr) {
      try {
        const parsed = JSON.parse(sessionStr);
        if (parsed.loggedIn && Date.now() < new Date(parsed.expiresAt).getTime()) {
          router.replace("/admin/dashboard");
        }
      } catch (e) {
        // Ignored
      }
    }
  }, [router]);

  return null;
}

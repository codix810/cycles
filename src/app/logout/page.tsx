"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await fetch("/api/auth/logout");
      router.push("/login");
    };

    logout();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-xl font-bold">
      جاري تسجيل الخروج...
    </div>
  );
}

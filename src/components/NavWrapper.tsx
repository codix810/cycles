"use client";

import { useEffect, useState } from "react";
import Navbar from "./layout/Navbar";

export default function NavWrapper() {
  const [role, setRole] = useState("guest");

  useEffect(() => {
    async function fetchRole() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setRole(data.role);
      } catch {
        setRole("guest");
      }
    }

    fetchRole();
  }, []);

  return <Navbar role={role} />;
}

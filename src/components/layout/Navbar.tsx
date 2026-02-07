"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

import logo from "../../assets/images/logo.png";

export default function Navbar({ role = "guest" }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  const links = useMemo(() => {
    const common = [
      { href: "/", label: "الرئيسية", show: true },
      { href: "/craftsmen", label: "الصنايعية", show: role === "client" },
      { href: "/my-work", label: "شغلي", show: role === "craftsman" },
      { href: "/admin", label: "لوحة التحكم", show: role === "admin" },
      { href: "/admin/bookings", label: "الحجوزات", show: role === "admin" },
      { href: "/profile", label: "حسابي", show: role !== "guest" },
    ];

    const auth =
      role === "guest"
        ? [{ href: "/login", label: "تسجيل الدخول", show: true, variant: "button" }]
        : [{ href: "/logout", label: "تسجيل خروج", show: true, variant: "button" }];

    return [...common, ...auth].filter((l) => l.show);
  }, [role]);

 const baseLink = scrolled
  ? "text-black hover:text-[#0D9488] transition duration-300"
  : "text-white hover:text-[#0D9488] transition duration-300";

const buttonLink =
  "bg-[#0D9488] text-white px-4 py-2 rounded-2xl hover:opacity-90 transition";


  const handleNavClick = () => setOpen(false);

  return (
    <header className="w-full bg-liner shadow-md fixed top-0 left-0 z-50">
      <nav className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={logo}
            alt="صنايعي"
            width={128}
            height={128}
            priority
            className="w-12 h-12 object-contain"
          />
          <h1 className="text-xl font-bold text-white leading-none">صنايعي</h1>
        </Link>

        {/* Mobile button */}
        <button
          className="md:hidden text-2xl text-white"
          onClick={() => setOpen((vt) => !vt)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          ☰
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6 font-medium">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={item.variant === "button" ? buttonLink : baseLink}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white px-4 pb-4 flex flex-col gap-3 text-gray-800 font-medium shadow-lg"
          >
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={
                  item.variant === "button"
                    ? "bg-[#0D9488] text-white px-4 py-2 rounded-2xl w-fit"
                    : " hover:text-[#0D9488] transition"
                }
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

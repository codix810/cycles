'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Hero from "@/components/sections/Home/Hero";
import Services from "@/components/sections/Home/Services";
import Benefits from "@/components/sections/Home/Benefits";
import HowItWorks from "@/components/sections/Home/HowItWorks";
import TopWorkers from "@/components/sections/Home/TopWorkers";
import Review from "@/components/sections/Home/Review";
import JoinUs from "@/components/sections/Home/JoinUs";

export default function HomePage() {
  const [role, setRole] = useState("guest");

useEffect(() => {
  async function fetchRole() {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setRole(data.role || "guest");
    } catch {
      setRole("guest");
    }
  }

  fetchRole();
}, []);




  const getPrimaryButton = () => {
    switch (role) {
      case "client":
        return (
          <Link
            href="/craftsmen"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-bold shadow hover:bg-blue-700"
          >
            شوف الصنايعية
          </Link>
        );

      case "craftsman":
        return (
          <Link
            href="/my-work"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-bold shadow hover:bg-blue-700"
          >
            ادخل لشغلك
          </Link>
        );

      case "admin":
        return (
          <Link
            href="/admin"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-bold shadow hover:bg-blue-700"
          >
            لوحة التحكم
          </Link>
        );

      default:
        return (
          <Link
            href="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-bold shadow hover:bg-blue-700"
          >
            انشاء حساب
          </Link>
        );
    }
  };

  return (
    <div className=" min-h-screen bg-gradient-to-b from-blue-50 to-white">

      <Hero />
      <Services/>
      <Benefits/>
      <HowItWorks/>
      <TopWorkers/>
      <Review/>
      <JoinUs/>
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-6"
      >
        <h1 className="text-4xl font-bold text-blue-700 mb-4">اهلا بيك في Houda</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          منصة حديثة للعثور على أفضل الصنايعية في منطقتك. اختار صنايعي موثوق، شغله ثابت، وسعره مظبوط.
        </p>

        <div className="mt-8 flex justify-center gap-4">{getPrimaryButton()}</div>
      </motion.div> */}

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-20 p-6">
        {[
          { title: "صنايعية محترفين", desc: "كل صنايعي لازم يتوافق عليه من الادمن قبل ما يشتغل." },
          { title: "صور وملف كامل", desc: "شوف شغل الصنايعي وصوره وخبرته بالكامل قبل ما تتعامل." },
          { title: "سهولة في الاستخدام", desc: "واجهة بسيطة وسريعة تساعدك تختار الصنايعي اللي يناسبك." },
        ].map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * i }}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg border"
          >
            <h3 className="text-xl font-bold text-blue-700 mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </motion.div>
        ))}
      </div> */}
    </div>
  );
}

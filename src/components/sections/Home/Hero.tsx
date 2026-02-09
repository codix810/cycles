"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import Heroimage from "../../../assets/images/hero.jpg";
import { useRouter } from "next/navigation";

export default function HeroSearch() {
  const router = useRouter();

  const [filters, setFilters] = useState({
    jobTitle: "",
    address: "",
    minExp: "",
  });

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const handleChange = (e: any) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const search = async () => {
    setLoading(true);
    setShowPanel(true);

    const clean: any = {};
    Object.keys(filters).forEach(k => {
      if ((filters as any)[k]) clean[k] = (filters as any)[k];
    });

    const query = new URLSearchParams(clean).toString();
    const res = await fetch(`/api/craftsmen/search?${query}`);
    const data = await res.json();

    setResults(data.craftsmen || []);
    setLoading(false);
  };

  return (
    <>
      {/* HERO */}
      <section className="relative h-[100vh] w-full overflow-hidden">
        <Image src={Heroimage} alt="Hero background" fill priority className="object-cover" />
       {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl text-center text-white"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
            هتلاقي الصنايعي الصح في دقايق
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-8">
            منصة موثوقة تربطك بأفضل الحرفيين المحليين في منطقتك
          </p>

            <div className="bg-white rounded-2xl p-4 flex flex-col md:flex-row gap-3 shadow-2xl">
            <input name="jobTitle" placeholder="المجال" onChange={handleChange}
              className="flex-1 border rounded-xl px-4 py-3 text-gray-800" />
            <input name="address" placeholder="المنطقة" onChange={handleChange}
              className="flex-1 border rounded-xl px-4 py-3 text-gray-800" />
            <input name="minExp" placeholder="خبرة" onChange={handleChange}
              className="flex-1 border rounded-xl px-4 py-3 text-gray-800" />
            <button onClick={search}
              className="bg-[#0D9488] hover:bg-[#0f766e] text-white px-6 py-3 rounded-xl font-semibold">
              بحث
            </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* OVERLAY RESULTS */}
      {showPanel && (
        <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4">

          <div className="bg-white w-full max-w-5xl rounded-2xl p-6 relative shadow-2xl">

            <button
              onClick={() => setShowPanel(false)}
              className="absolute top-4 right-4 text-gray-500 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">نتائج البحث</h2>

            {loading ? (
              <div className="text-center py-10 text-gray-700">جاري البحث...</div>
            ) : results.length === 0 ? (
              <div className="text-center py-10 text-gray-500">لا توجد نتائج</div>
            ) : (
              <div className="grid md:grid-cols-3 gap-5">
                {results.map(c => (
                  <motion.div
                    key={c._id}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => router.push(`/craftsmen/${c._id}`)}
                    className="cursor-pointer bg-gray-50 p-4 rounded-xl shadow hover:shadow-lg transition"
                  >
                    <img src={c.profileImage} className="w-full h-40 object-cover rounded-lg mb-2"/>
                    <h3 className="font-bold text-gray-800">{c.userId.name}</h3>
                    <p className="text-gray-500 text-sm">{c.jobTitle}</p>
                    <p className="text-xs text-gray-400">{c.experienceYears} سنة خبرة</p>
                  </motion.div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SearchCraftsmen() {
  const [filters, setFilters] = useState({
    name: "",
    jobTitle: "",
    status: "",
    minExp: "",
    address: "",
  });

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    const query = new URLSearchParams(filters as any).toString();

    const res = await fetch(`/api/craftsmen/search?${query}`);
    const data = await res.json();

    setResults(data.craftsmen || []);
    setLoading(false);
  };

  useEffect(() => {
    search();
  }, []);

  const handleChange = (e: any) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
          بحث عن صنايعية
        </h1>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">

          <input
            name="name"
            placeholder="اسم الصنايعي"
            onChange={handleChange}
            className="bg-slate-800 p-2 rounded-xl border border-slate-700 outline-none"
          />

          <input
            name="jobTitle"
            placeholder="مجال الشغل (نجار / كهربائي...)"
            onChange={handleChange}
            className="bg-slate-800 p-2 rounded-xl border border-slate-700 outline-none"
          />

          <select
            name="status"
            onChange={handleChange}
            className="bg-slate-800 p-2 rounded-xl border border-slate-700 outline-none"
          >
            <option value="">الحالة</option>
            <option value="available">متاح</option>
            <option value="busy">مشغول</option>
          </select>

          <input
            name="minExp"
            placeholder="سنين الخبرة (حد أدنى)"
            onChange={handleChange}
            className="bg-slate-800 p-2 rounded-xl border border-slate-700 outline-none"
          />

          <input
            name="address"
            placeholder="المحافظة / المنطقة"
            onChange={handleChange}
            className="bg-slate-800 p-2 rounded-xl border border-slate-700 outline-none"
          />
        </div>

        {/* Search Button */}
        <button
          onClick={search}
          className="mt-4 w-full bg-sky-600 py-3 rounded-xl font-bold hover:bg-sky-700"
        >
          بحث
        </button>

        {/* Results */}
        <div className="mt-8 space-y-4">
          {loading ? (
            <div className="text-center py-6">جاري التحميل...</div>
          ) : results.length === 0 ? (
            <div className="text-center py-6 text-slate-400">لا يوجد نتائج</div>
          ) : (
            results.map((c: any, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.01 }}
                className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex gap-4"
              >
                <img
                  src={c.profileImage}
                  className="w-20 h-20 rounded-xl object-cover"
                />

                <div className="flex-1">
                  <h2 className="font-bold text-lg">{c.userId.name}</h2>
                  <p className="text-slate-400">{c.jobTitle}</p>
                  <p className="text-xs text-slate-500">
                    {c.experienceYears} سنة خبرة
                  </p>

                  <Link
                    href={`/craftsmen/${c._id}`}
                    className="text-sky-400 text-sm mt-2 inline-block"
                  >
                    عرض التفاصيل →
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Craftsman = {
  _id: string;
  jobTitle: string;
  description: string;
  experienceYears: number;
  address: string;
  status: "available" | "busy";
  isApproved: boolean;
  profileImage: string;
  workImages: string[];
  userId: {
    name: string;
    email: string;
    phone: string;
  };
};

export default function CraftsmenPage() {
  const [craftsmen, setCraftsmen] = useState<Craftsman[]>([]);
  const [filtered, setFiltered] = useState<Craftsman[]>([]);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    const res = await fetch("/api/craftsmen");
    const data = await res.json();
    setCraftsmen(data.craftsmen);
    setFiltered(data.craftsmen);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (txt: string) => {
    setSearch(txt);

 const result = craftsmen.filter((c) =>
  (c.userId?.name?.toLowerCase() || "").includes(txt.toLowerCase()) ||
  c.jobTitle.toLowerCase().includes(txt.toLowerCase())
);

    setFiltered(result);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        ابحث عن الصنايعية
      </h1>

      {/* Search Input */}
      <div className="max-w-xl mx-auto mb-8">
        <input
          type="text"
          placeholder="ابحث بالاسم أو مجال العمل..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none text-sm"
        />
      </div>

      {/* Craftsmen List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((c) => (
          <motion.div
            key={c._id}
            whileHover={{ scale: 1.02 }}
            className="bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center gap-4">
    <img
  src={c.profileImage || "/default-avatar.png"}
  className="w-14 h-14 rounded-full object-cover"
  alt="craftsman"
/>


              <div>
<p className="font-semibold">{c.userId?.name || "غير معروف"}</p>
                <p className="text-slate-400 text-xs">{c.jobTitle}</p>

                <span
                  className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                    c.status === "available"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-amber-500/20 text-amber-300"
                  }`}
                >
                  {c.status === "available" ? "متاح" : "مشغول"}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-400 mt-3 line-clamp-3">
              {c.description}
            </p>

            {/* Work Images */}
            {c.workImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {c.workImages.slice(0, 3).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className="w-full h-20 rounded-xl object-cover"
                  />
                ))}
              </div>
            )}

            {/* View Button */}
            <a
              href={`/craftsmen/${c._id}`}
              className="block mt-4 text-center bg-sky-600 hover:bg-sky-700 py-2 rounded-xl text-sm font-bold"
            >
              عرض التفاصيل
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

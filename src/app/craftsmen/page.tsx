"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import Image from "next/image";
import Heroimage from "../../assets/images/hero.jpg";
import { getCraftsmenRatings } from "@/lib/reviewService";

export default function CraftsmenPage() {
  const [list, setList] = useState<any[]>([]);
  const [ratings, setRatings] = useState<any>({});

  useEffect(() => {
    fetch("/api/craftsmen")
      .then((r) => r.json())
      .then(async (d) => {
        setList(d.craftsmen);

        const ids = d.craftsmen.map((c: any) => c._id);
        const ratingData = await getCraftsmenRatings(ids);

        const map: any = {};
        ratingData.stats.forEach((r: any) => {
          map[r._id] = {
            avg: r.avg.toFixed(1),
            count: r.count,
          };
        });

        setRatings(map);
      });
  }, []);

  return (
    <div className="bg-[#f3f4f6] min-h-screen pt-2 pb-16">
      
      {/* ===== HERO ===== */}
      <div className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center text-white">

        {/* Background Image */}
        <Image
          src={Heroimage}
          alt="Hero background"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold">الصنايعية</h1>
          <p className="text-sm md:text-base mt-3 opacity-90">
            اختر أفضل الصنايعية في منطقتك
          </p>
        </div>
      </div>

      {/* ===== FILTER BAR ===== */}
      <div className="max-w-6xl mx-auto -mt-10 bg-white p-4 rounded-2xl shadow flex flex-wrap gap-4 items-center justify-between relative z-20">
        <select className="border border-gray-200 p-2 rounded-lg text-sm">
          <option>جميع التخصصات</option>
        </select>

        <select className="border border-gray-200 p-2 rounded-lg text-sm">
          <option>جميع المناطق</option>
        </select>

        <select className="border border-gray-200 p-2 rounded-lg text-sm">
          <option>الخبرة</option>
        </select>

        <button className="bg-[#0D9488] hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold transition">
          بحث
        </button>
      </div>

      {/* ===== TITLE ===== */}
      <div className="max-w-6xl mx-auto mt-16 mb-6 px-4">
        <h2 className="text-2xl font-bold text-gray-800">
          قائمة الصنايعية
        </h2>
      </div>

      {/* ===== CARDS ===== */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {list.map((c) => (
          <motion.div
            key={c._id}
            whileHover={{ y: -4 }}
            className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition relative"
          >
            
            {/* Verified Badge */}
            {c.isApproved && (
              <div className="absolute top-3 left-3 bg-emerald-100 text-emerald-600 text-xs px-2 py-1 rounded-full font-semibold">
                موثق
              </div>
            )}

            {/* Avatar */}
            <div className="flex justify-center -mt-10">
              <img
                src={c.profileImage}
                className="w-20 h-20 rounded-full border-4 border-white shadow object-cover"
                alt={c.userId.name}
              />
            </div>

            {/* Info */}
            <div className="text-center mt-3">
              <h3 className="font-bold text-gray-800">
                {c.userId.name}
              </h3>
              <p className="text-xs text-gray-500">
                {c.jobTitle}
              </p>
            </div>

            {/* Rating */}
            <div className="flex justify-center items-center gap-1 mt-2 text-sm">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-gray-700">
                {ratings[c._id]?.avg || "جديد"}
              </span>
              <span className="text-gray-400 text-xs">
                ({ratings[c._id]?.count || 0})
              </span>
            </div>

            {/* Location */}
            <div className="flex justify-center items-center gap-1 text-gray-400 text-xs mt-1">
              <MapPin className="w-3 h-3" />
              {c.address}
            </div>

            {/* Status */}
            <div className="text-center mt-2">
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  c.status === "available"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-amber-100 text-amber-600"
                }`}
              >
                {c.status === "available" ? "متاح الآن" : "مشغول"}
              </span>
            </div>

            {/* Button */}
            <a
              href={`/craftsmen/${c._id}`}
              className="block mt-4 text-center bg-[#0D9488] hover:bg-teal-700 text-white py-2 rounded-xl text-sm font-bold transition"
            >
              طلب الآن
            </a>

          </motion.div>
        ))}
      </div>

    </div>
  );
}
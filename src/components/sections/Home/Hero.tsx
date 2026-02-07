"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Heroimage from "../../../assets/images/hero.jpg";

const Hero = () => {
  return (
    <section className="relative h-[100vh] w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src={Heroimage}
        alt="Hero background"
        fill
        priority
        className="object-cover"
      />

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

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-4 md:p-5 flex flex-col md:flex-row gap-3 shadow-2xl"
          >
            <select
              className="flex-1 border border-gray-400 rounded-xl px-4 py-3
             text-gray-800 bg-white
             focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            >
              <option>نوع الخدمة</option>
              <option>سباكين</option>
              <option>كهربائي</option>
              <option>نجارة</option>
              <option>نقاشين</option>
              <option>مبلط</option>
            </select>

            <input
              type="text"
              placeholder="المنطقة أو المدينة"
              className="flex-1 border border-gray-400 rounded-xl px-4 py-3
             text-gray-800 bg-white
             placeholder-gray-400
             focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            />

            <button className="bg-[#0D9488] hover:bg-[#0f766e] transition text-white px-6 py-3 rounded-xl font-semibold cursor-pointer">
              ابحث الآن
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

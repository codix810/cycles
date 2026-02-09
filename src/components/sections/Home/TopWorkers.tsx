"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaLocationDot, FaStar } from "react-icons/fa6";
import { IoMdCheckmarkCircle } from "react-icons/io";

export default function TopWorkers() {
  const [workers, setWorkers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/craftsmen/top")
      .then(r => r.json())
      .then(d => setWorkers(d.craftsmen));
  }, []);

  if (!workers.length) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-14">
          أفضل الصنايعية المقيمين
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {workers.map((worker, index) => (
            <motion.div key={worker._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden relative"
            >
              <div className="h-20 bg-white flex justify-center  items-end">
                <div className="relative h-24 w-24 rounded-full ring-4 ring-white overflow-hidden shadow-md -mb-12">
                  <Image
                    src={worker.profileImage || "/avatar.png"}
                    alt={worker.userId.name}
                    fill
                    className="object-cover "
                  />
                  <span className="absolute top-1 right-1 bg-green-500 text-white p-2 rounded-full">
                    <IoMdCheckmarkCircle size={16} />
                  </span>
                </div>
              </div>

              <div className="p-5 pt-16 text-center">
                <h3 className="text-lg font-extrabold text-gray-800">{worker.userId.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{worker.jobTitle}</p>

                <div className="flex items-center justify-center gap-2 mb-2">
                  <FaStar className="text-yellow-500" />
                  <span className="font-bold text-gray-700">{worker.rating}</span>
                  <span className="text-xs text-gray-400">({worker.reviewCount})</span>
                </div>

                <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                  <FaLocationDot />
                  <span>{worker.address}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

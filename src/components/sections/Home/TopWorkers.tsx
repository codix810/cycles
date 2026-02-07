"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaLocationDot, FaStar } from "react-icons/fa6";
import { IoMdCheckmarkCircle } from "react-icons/io";

import worker1 from "../../../assets/images/TopWorker/topWorker1.jpg";
import worker2 from "../../../assets/images/TopWorker/topWorker2.jpg";
import worker3 from "../../../assets/images/TopWorker/topWorker3.jpg";
import worker4 from "../../../assets/images/TopWorker/topWorker4.jpg";

type Worker = {
  name: string;
  job: string;
  country: string;
  rating: number;
  img: any;
};

const workers: Worker[] = [
  { name: "أحمد السيد", job: "سباك", country: "مصر", rating: 4.9, img: worker1 },
  { name: "محمد علي", job: "كهربائي", country: "مصر", rating: 4.8, img: worker2 },
  { name: "يوسف حسن", job: "نجار", country: "مصر", rating: 5.0, img: worker3 },
  { name: "محمود رمضان", job: "نقاش", country: "مصر", rating: 4.9, img: worker4 },
];

const TopWorkers = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-14"
        >
          أفضل الصنايعية المقيمين
        </motion.h2>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {workers.map((worker, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition overflow-hidden relative"
            >
              {/* Top background */}
                <div className="h-24 bg-white flex justify-center items-end relative">
                    {/* Avatar */}
                    <div className="relative h-24 w-24 rounded-full ring-4 ring-white overflow-clip shadow-md -mb-12">
                        <Image
                        src={worker.img}
                        alt={worker.name}
                        fill
                        className="object-cover"
                        />
                {/* Verified badge outside the overflow-hidden div */}
                    <span className="absolute top-1 right-1 z-20 bg-green-500 text-white text-xs font-bold p-1.5 rounded-full shadow flex items-center justify-center">
                        <IoMdCheckmarkCircle size={16} />
                    </span>
                    </div>

                </div>


              {/* Content */}
              <div className="p-5 pt-16 text-center">
                <h3 className="text-lg font-extrabold text-gray-800 mb-1">{worker.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{worker.job}</p>

                <div className="flex items-center justify-center gap-2 mb-2">
                  <FaStar className="text-yellow-500" />
                  <span className="font-bold text-gray-700">{worker.rating}</span>
                </div>

                <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                  <FaLocationDot />
                  <span>{worker.country}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopWorkers;

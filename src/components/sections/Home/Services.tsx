"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import serv1 from "../../../assets/images/servicesImage/serv-1.png";
import serv2 from "../../../assets/images/servicesImage/serv-2.png";
import serv3 from "../../../assets/images/servicesImage/serv-3.png";
import serv4 from "../../../assets/images/servicesImage/serv-4.png";
import serv5 from "../../../assets/images/servicesImage/serv-5.jpg";

import logo1 from "../../../assets/images/div.png";
import logo2 from "../../../assets/images/div (1).png";
import logo3 from "../../../assets/images/logo.png";
import logo4 from "../../../assets/images/div (2).png";
import logo5 from "../../../assets/images/div (3).png";

const cards = [
  {
    img: serv1,
    logo: logo1,
    title: "مبلط",
    desc: "احصل على محترفين بلاط بأعلى جودة",
  },
  {
    img: serv2,
    logo: logo2,
    title: "نقاشين",
    desc: "نقاشين محترفين لتشطيبات عصرية",
  },
  {
    img: serv3,
    logo: logo3,
    title: "نجارة",
    desc: "نجارين ماهرين لأعمال دقيقة",
  },
  {
    img: serv4,
    logo: logo4,
    title: "كهربائي",
    desc: "كهربائيين خبراء بأمان تام",
  },
  {
    img: serv5,
    logo: logo5,
    title: "سباكين",
    desc: "سباكين محترفين لجميع الاحتياجات",
  },
];

const Services = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold text-center mb-14 text-gray-800"
        >
          الخدمات المميزة
        </motion.h2>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {cards.map((card, index) => (
            <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 group cursor-pointer flex flex-col h-full"
                >
                <div className="relative h-40">
                    <Image
                    src={card.img}
                    alt={card.title}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-500"
                    />
                </div>

                <div className="p-5 text-center flex-1">
                    <div className="flex items-center justify-between gap-2 mb-5">
                    <Image src={card.logo} alt="" width={28} height={28} />
                    <h3 className="text-lg font-bold text-gray-800">{card.title}</h3>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
                </div>

                <div className="h-1 bg-[#0D9488] scale-x-0 group-hover:scale-x-100 transition origin-left" />
            </motion.div>

          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

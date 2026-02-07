"use client";

import React from "react";
import { motion } from "framer-motion";

type Step = {
  title: string;
  desc: string;
  icon: React.ReactNode;
};

const IconForm = () => (
  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
    <path
      d="M9 5h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M5 7V5a2 2 0 0 1 2-2h8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M10 10h8M10 14h8M10 18h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const IconLocation = () => (
  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
    <path
      d="M12 22s7-5.1 7-12a7 7 0 1 0-14 0c0 6.9 7 12 7 12Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const IconChat = () => (
  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
    <path
      d="M21 14a4 4 0 0 1-4 4H9l-4 3v-3a4 4 0 0 1-2-3.5V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v7Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M8 8h8M8 12h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const steps: Step[] = [
  {
    title: "اكتب طلبك",
    desc: "حدد نوع الخدمة التي تحتاجها ومنطقتك",
    icon: <IconForm />,
  },
  {
    title: "شوف الصنايعية القريبة منك",
    desc: "اطّلع على قائمة الحرفيين المتاحين في منطقتك",
    icon: <IconLocation />,
  },
  {
    title: "اختار وابدأ التواصل",
    desc: "اختر الصنايعي المناسب وابدأ العمل",
    icon: <IconChat />,
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            كيف تعمل المنصة؟
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            3 خطوات بسيطة توصلك بالصنايعي المناسب بسرعة.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative overflow-hidden rounded-3xl bg-white p-7 shadow-lg hover:shadow-2xl transition group"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-[#0D9488]" />
              <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-[#0D9488]/10 blur-2xl" />

              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-500">خطوة {idx + 1}</span>
                <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-extrabold">
                  {idx + 1}
                </span>
              </div>

              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0D9488]/10 text-[#0D9488]">
                {step.icon}
              </div>

              <h3 className="text-xl font-extrabold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.desc}</p>

              <div className="mt-6 h-1 w-0 bg-[#0D9488] rounded-full group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

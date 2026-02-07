"use client";

import React from "react";
import Marquee from "react-fast-marquee";
import { FaCheckCircle, FaStar } from "react-icons/fa";

const reviews = [
  {
    name: "سارة م.",
    description:
      "خدمة ممتازة من المنصة! وجدت الصنايعي الذي أحتاجه بسرعة وبكفاءة عالية. أنصح الجميع باستخدام المنصة.",
  },
  {
    name: "أحمد ك.",
    description:
      "المنصة رائعة، تمكنت من التواصل مع حرفيين محترفين في منطقتي بسهولة وسرعة. تجربة مميزة جدًا.",
  },
  {
    name: "يوسف ل.",
    description:
      "أحببت سهولة استخدام المنصة واختيار الصنايعي المناسب. الحرفيون محترفون والأسعار مناسبة.",
  },
  {
    name: "محمد ر.",
    description:
      "المنصة وفرت علي الوقت والجهد، وجدت الصنايعي المناسب بسرعة وبدون مشاكل. تجربة ممتازة.",
  },
];

const Review = () => {
  return (
    <section className="bg-white py-16">
      {/* Title */}
      <h2 className="text-center text-4xl md:text-5xl font-extrabold text-gray-800 mb-14">
        آراء عملائنا
      </h2>

      {/* Marquee Arabic RTL */}
      <Marquee
        gradient={false}
        direction="left"
        speed={50}
        pauseOnHover={true}
        className="rtl"
      >
        {reviews.map((r, index) => (
          <div
            key={index}
            className="w-80 m-4 p-6 rounded-2xl bg-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col gap-4"
          >
            {/* Rating */}
            <div className="flex justify-start gap-1 text-amber-400">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>

            {/* User Info */}
            <div className="flex items-center gap-2 justify-start">
              <h3 className="text-gray-800 font-semibold text-lg">{r.name}</h3>
              <FaCheckCircle className="text-green-500" />
            </div>

            {/* Description */}
            <p className="text-gray-700 text-sm leading-relaxed text-right">{r.description}</p>
          </div>
        ))}
      </Marquee>

      <Marquee
        gradient={false}
        direction="right"
        speed={50}
        pauseOnHover={true}
        className="rtl mt-8"
      >
        {reviews.map((r, index) => (
          <div
            key={index}
            className="w-80 m-4 p-6 rounded-2xl bg-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col gap-4"
          >
            <div className="flex justify-start gap-1 text-amber-400">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>

            <div className="flex items-center gap-2 justify-start">
              <h3 className="text-gray-800 font-semibold text-lg">{r.name}</h3>
              <FaCheckCircle className="text-green-500" />
            </div>

            <p className="text-gray-700 text-sm leading-relaxed text-right">{r.description}</p>
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default Review;

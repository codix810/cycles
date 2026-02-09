"use client";

import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { FaCheckCircle, FaStar } from "react-icons/fa";

export default function Review() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/reviews/latest")
      .then(r => r.json())
      .then(d => setReviews(d.reviews));
  }, []);

  if (!reviews.length) return null;

  const ReviewCard = ({ r }: any) => (
    <div className="w-80 m-4 p-6 rounded-2xl bg-gray-100 shadow-md hover:shadow-xl transition flex flex-col gap-4">
      
      {/* Rating */}
      <div className="flex gap-1 text-amber-400">
        {[...Array(r.rating)].map((_, i) => <FaStar key={i} />)}
      </div>

      {/* User */}
      <div className="flex items-center gap-2">
        <h3 className="text-gray-800 font-semibold text-lg">{r.userId?.name}</h3>
        <FaCheckCircle className="text-green-500" />
      </div>

      {/* Job */}
<p className="text-xs text-gray-400">
  على يد: {r.craftsmanId?.userId?.name || "—"}
</p>

<p className="text-xs text-gray-400">
  التخصص: {r.craftsmanId?.jobTitle}
</p>



      {/* Comment */}
      <p className="text-gray-700 text-sm leading-relaxed text-right">{r.comment}</p>
    </div>
  );

  return (
    <section className="bg-white py-16">
      <h2 className="text-center text-4xl md:text-5xl font-extrabold text-gray-800 mb-14">
        آراء عملائنا
      </h2>

      <Marquee gradient={false} speed={50} pauseOnHover>
        {reviews.map((r) => <ReviewCard key={r._id} r={r} />)}
      </Marquee>

      <Marquee gradient={false} direction="right" speed={50} pauseOnHover className="mt-8">
        {reviews.map((r) => <ReviewCard key={r._id + "b"} r={r} />)}
      </Marquee>
    </section>
  );
}



import Image from "next/image";
import React from "react";
import join from "../../../assets/images/joinUs.png";

const JoinUs = () => {
  return (
    <section className="relative h-[500px] md:h-[600px] w-full flex items-center justify-center">
      {/* Background Image */}
      <Image
        src={join}
        alt="join"
        fill
        className="object-cover brightness-75"
      />

      {/* Overlay Content */}
      <div className="absolute text-center px-4 md:px-0 max-w-2xl">
        <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
          هل أنت صنايعي؟ انضم دلوقتي وابدأ شغلك!
        </h3>
        <p className="text-gray-200 text-lg md:text-xl mb-8">
          انضم لآلاف الحرفيين الناجحين واكسب عملاء جدد كل يوم
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-[#0D9488] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-[#0b7c72] transition">
            سجل كصنايعي
          </button>
          <button className="bg-white text-gray-900 px-6 py-3 rounded-2xl font-semibold hover:bg-gray-200 transition">
            شاهد كيف تعمل المنصة
          </button>
        </div>
      </div>
    </section>
  );
};

export default JoinUs;

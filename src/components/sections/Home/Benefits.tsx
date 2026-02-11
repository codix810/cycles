"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type BenefitCardProps = {
  title: string;
  subtitle: string;
  items: string[];
  badge: string;
  accentColor: string; // ✅ جديد
  onCtaClick?: () => void;
  ctaText?: string;
};

const clientBenefits: string[] = [
  "اختيار صنايعي مناسب حسب التقييم والخبرة",
  "طلبات سريعة ومتابعة للحجز بسهولة",
  "أسعار واضحة وتواصل مباشر بدون تعقيد",
  "ضمان جودة وراحة بال في التعامل",
];

const craftsmanBenefits: string[] = [
  "وصول لعملاء جدد في منطقتك بشكل مستمر",
  "عرض شغلك وبروفايل احترافي يزيد الثقة",
  "تنظيم المواعيد والطلبات في مكان واحد",
  "زيادة دخلك وبناء سمعة قوية بالتقييمات",
];

const BenefitCard: React.FC<BenefitCardProps> = ({

  title,
  subtitle,
  items,
  badge,
  accentColor,
  onCtaClick,
  ctaText = "ابدأ الآن",
}) => {
  const accentBg10 = `${accentColor}1A`; // 10% تقريبًا (hex alpha)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -8 }}
      className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition"
    >
      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: accentColor }} />

      {/* Soft blobs */}
      <div
        className="absolute -top-16 -right-16 h-40 w-40 rounded-full blur-2xl"
        style={{ backgroundColor: accentBg10 }}
      />
      <div
        className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full blur-2xl"
        style={{ backgroundColor: accentBg10 }}
      />

      <div className="relative p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-extrabold text-gray-800">{title}</h3>
            <p className="mt-1 text-gray-600">{subtitle}</p>
          </div>

          <span
            className="shrink-0 rounded-full px-3 py-1 text-sm font-semibold"
            style={{ backgroundColor: accentBg10, color: accentColor }}
          >
            {badge}
          </span>
        </div>

        <ul className="space-y-3">
          {items.map((text, idx) => (
            <li key={idx} className="flex items-start gap-3 text-gray-700">
              <span
                className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs text-white"
                style={{ backgroundColor: accentColor }}
              >
                ✓
              </span>
              <span className="leading-relaxed">{text}</span>
            </li>
          ))}
        </ul>

        <div className="mt-7 flex items-center justify-between">
          <button
            type="button"
            onClick={onCtaClick}
            className="rounded-2xl px-5 py-2.5 font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: accentColor }}
          >
            {ctaText}
          </button>

          <span className="text-sm text-gray-500 transition group-hover:text-gray-700">
            تجربة سهلة وسريعة ✨
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Benefits: React.FC = () => {
      const router = useRouter();

  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-extrabold text-gray-800 md:text-4xl">
            مميزات المنصة للطرفين
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            سواء عميل أو صنايعي… كل حاجة معمولة عشان تجربتك تبقى أسهل وأسرع.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* ✅ العميل باللون الأخضر */}
          <BenefitCard
            title="للعميل"
            subtitle="اختار، احجز، واطمّن على شغلك"
            items={clientBenefits}
            badge="Client"
            accentColor="#0D9488"
            onCtaClick={() => router.push("/register")}   // 🔥 هنا الشغل
          />

          {/* ✅ الصنايعي باللون البرتقالي */}
          <BenefitCard
            title="للصنايعي"
            subtitle="كبر شغلك ووصل لعملاء أكتر"
            items={craftsmanBenefits}
            badge="Craftsman"
            accentColor="#EA580C"
            onCtaClick={() => router.push("/register")}   // 🔥 هنا الشغل
          />
        </div>
      </div>
    </section>
  );
};

export default Benefits;

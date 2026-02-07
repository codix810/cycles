"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

export default function CraftsmanDetails() {
  const { id } = useParams();
  const [craftsman, setCraftsman] = useState<any>(null);
  const [loading, setLoading] = useState(true);
const [sending, setSending] = useState(false);
const [msg, setMsg] = useState("");

  const load = async () => {
    const res = await fetch(`/api/craftsmen/${id}`);
    const data = await res.json();
    setCraftsman(data.craftsman);
    setLoading(false);
  };
const requestCraftsman = async () => {
  setSending(true);
  setMsg("");

  try {
    const res = await fetch("/api/bookings/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ craftsmanId: id, details: "Testing Shalaby" }),
    });

    const text = await res.text();
    console.log("RAW RESPONSE:", text);

    const json = JSON.parse(text);
    if (!res.ok) {
      setMsg(json.error || "Error");
      setSending(false);
      return;
    }

    setMsg("تمام ✔ الطلب اتبعت");
  } catch (e) {
    console.log("FETCH ERROR:", e);
    setMsg("فشل الاتصال");
  }

  setSending(false);
};


useEffect(() => {
  load();
}, []);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        جاري التحميل...
      </div>
    );

  if (!craftsman)
    return (
      <div className="text-center text-red-500 mt-20 text-xl">
        الصنايعي غير موجود
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">

        {/* Header */}
        <div className="flex gap-6 items-center">
          <img
            src={craftsman.profileImage}
            className="w-32 h-32 rounded-2xl object-cover border border-slate-700"
          />

          <div>
            <h1 className="text-3xl font-bold">{craftsman.userId.name}</h1>
            <p className="text-slate-400">{craftsman.jobTitle}</p>

            <span
              className={`mt-2 inline-block px-3 py-1 text-sm rounded-full ${
                craftsman.status === "available"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-amber-500/20 text-amber-300"
              }`}
            >
              {craftsman.status === "available" ? "متاح" : "مشغول"}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">الوصف</h2>
          <p className="text-slate-300 leading-relaxed">
            {craftsman.description}
          </p>
        </div>

        {/* Experience */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
            <h3 className="font-bold">سنين الخبرة</h3>
            <p className="mt-1 text-slate-300">{craftsman.experienceYears} سنة</p>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
            <h3 className="font-bold">العنوان</h3>
            <p className="mt-1 text-slate-300">{craftsman.address}</p>
          </div>
        </div>

        {/* Work Images */}
        {craftsman.workImages.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-3">معرض الأعمال</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {craftsman.workImages.map((img: string, i: number) => (
                <motion.img
                  whileHover={{ scale: 1.03 }}
                  key={i}
                  src={img}
                  className="w-full h-40 object-cover rounded-xl cursor-pointer border border-slate-700"
                />
              ))}
            </div>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-3">التواصل</h2>

          <div className="flex flex-col gap-3 text-sm">
            <p>رقم الهاتف: {craftsman.userId.phone}</p>
            <p>الإيميل: {craftsman.userId.email}</p>

<button
  onClick={requestCraftsman}
  disabled={sending}
  className="mt-3 inline-block bg-sky-600 hover:bg-sky-700 py-2 px-4 rounded-xl text-white font-bold text-center"
>
  {sending ? "جاري الإرسال..." : "طلب هذا الصنايعي"}
</button>

{msg && (
  <p className="text-sm mt-2 text-sky-400">{msg}</p>
)}

          </div>
        </div>
      </div>
    </div>
  );
}

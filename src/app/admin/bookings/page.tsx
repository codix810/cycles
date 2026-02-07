"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AdminBookings() {
  const [list, setList] = useState([]);
  const [load, setLoad] = useState(true);

  const fetchData = async () => {
    const res = await fetch("/api/admin/bookings");
    const data = await res.json();
    setList(data.bookings || []);
    setLoad(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

const approve = async (id: string) => {
  await fetch(`/api/admin/bookings/approve/${id}`, { method: "PUT" });
  fetchData();
};


const reject = async (id: string) => {
  await fetch(`/api/admin/bookings/reject/${id}`, { method: "PUT" });
  fetchData();
};


  if (load)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        جاري التحميل...
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-slate-950 text-slate-100">
      <h1 className="text-3xl font-bold mb-6">طلبات الصنايعية</h1>

      {list.length === 0 && (
        <p className="text-slate-400 text-center mt-20">
          لا توجد طلبات حالياً
        </p>
      )}

      <div className="grid gap-4">
        {list.map((b: any) => (
          <motion.div
            key={b._id}
            whileHover={{ scale: 1.02 }}
            className="bg-slate-900 border border-slate-700 rounded-2xl p-4"
          >
            <h2 className="font-bold text-lg">
              العميل: {b.userId?.name}
            </h2>

            <p className="text-sm text-slate-400">
              رقم الهاتف: {b.userId?.phone}
            </p>

            <div className="mt-3 p-3 bg-slate-800 rounded-xl">
              <p className="font-semibold text-sky-300">الصنايعي المطلوب:</p>
              <p>{b.craftsmanId?.userId?.name}</p>
              <p className="text-xs text-slate-400">المجال: {b.craftsmanId?.jobTitle}</p>
<p className="text-xs text-slate-400">
  رقم الصنايعي: {b.craftsmanId?.userId?.phone}
</p>

<p className="text-xs text-slate-400">
  إيميل الصنايعي: {b.craftsmanId?.userId?.email}
</p>

            </div>

            <p className="mt-3">
              حالة الطلب:{" "}
<span className={b.status === "pending" ? "text-amber-400" : "text-emerald-400"}>
  {b.status === "pending" && "قيد الانتظار"}
{b.status === "approved" && "تمت الموافقة"}
{b.status === "rejected" && "تم الرفض"}

</span>

            </p>

{b.status === "approved" && (
  <button
    onClick={() => reject(b._id)}
    className="mt-4 bg-red-600 px-4 py-2 rounded-xl"
  >
     رفض الطلب
  </button>
)}
{b.status === "pending" &&  (
  <button
    onClick={() => approve(b._id)}
    
    className="mt-4 bg-emerald-600 px-4 py-2 rounded-xl"
  >
    موافقة على الطلب
  </button>
)}

{b.status === "rejected" && (
  <button
    onClick={() => approve(b._id)}
    className="mt-4 bg-emerald-600 px-4 py-2 rounded-xl"
  >
    موافقة على الطلب
  </button>
)}

       </motion.div>
        ))}
      </div>
    </div>
  );
}

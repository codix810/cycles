"use client";

import { useEffect, useState } from "react";

export default function CraftsmanBookings() {
  const [list, setList] = useState([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    fetch("/api/craftsman/bookings")
      .then((r) => r.json())
      .then((d) => {
        setList(d.bookings || []);
        setLoad(false);
      });
  }, []);

  if (load)
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        جاري التحميل...
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-slate-950 text-slate-100">
      <h1 className="text-3xl font-bold mb-6">طلبات العملاء</h1>

      {list.length === 0 && <p className="text-slate-400">لا توجد طلبات</p>}

      {list.map((b: any) => (
        <div key={b._id} className="bg-slate-900 p-4 rounded-xl border border-slate-700 mb-3">
          <h2 className="font-bold">{b.clientId?.name}</h2>
          <p className="text-sm text-slate-400">{b.clientId?.phone}</p>
          <p className="mt-2">
            حالة الطلب:{" "}
            <span
              className={
                b.status === "approved" ? "text-emerald-400" : "text-amber-400"
              }
            >
              {b.status === "approved" ? "تمت الموافقة" : "قيد الانتظار"}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}

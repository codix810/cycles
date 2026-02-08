"use client";
import { useEffect, useState } from "react";

export default function AdminBookings() {
  const [list, setList] = useState<any[]>([]);
  const [tab, setTab] = useState("pending");
  const [reply, setReply] = useState<{ [key: string]: string }>({});
  const [toast, setToast] = useState("");

  const fetchData = async () => {
    const res = await fetch("/api/admin/bookings");
    const data = await res.json();
    setList(data.bookings || []);
  };

  useEffect(() => { fetchData(); }, []);

  const action = async (url: string, msg: string) => {
    await fetch(url, { method: "PUT" });
    setToast(msg);
    fetchData();
    setTimeout(() => setToast(""), 3000);
  };

  const sendReply = async (id: string) => {
    await fetch(`/api/admin/bookings/reply/${id}`, {
      method: "PUT",
      body: JSON.stringify({ message: reply[id] }),
    });
    setToast("تم إرسال الرسالة للصنايعي بنجاح");
    fetchData();
    setTimeout(() => setToast(""), 3000);
  };

  const filtered = list.filter(b => b.status === tab);

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-white mt-20">

      {toast && (
        <div className="fixed top-5 right-5 bg-emerald-600 px-4 py-2 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">إدارة الطلبات</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["pending","approved","rejected"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl ${tab===t ? "bg-sky-600" : "bg-slate-800"}`}
          >
            {t === "pending" && "قيد الانتظار"}
            {t === "approved" && "المقبولة"}
            {t === "rejected" && "المرفوضة"}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid gap-5">
        {filtered.map(b => (
          <div key={b._id} className="bg-slate-900 border border-slate-700 p-5 rounded-2xl shadow">

            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">{b.userId?.name}</p>
                <p className="text-sm text-slate-400">{b.craftsmanId?.userId?.name}</p>
              </div>
              <span className="text-xs px-3 py-1 rounded bg-slate-800">{b.status}</span>
            </div>

            {b.craftsmanReply && (
              <div className="mt-3 bg-slate-800 p-3 rounded-xl text-sm">
                💬 {b.craftsmanReply} — 💰 {b.price}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 mt-4">
              {b.status !== "approved" && (
                <button
                  onClick={() => action(`/api/admin/bookings/approve/${b._id}`, "تمت الموافقة بنجاح")}
                  className="bg-emerald-600 px-3 py-1 rounded-lg"
                >
                  موافقة
                </button>
              )}

              {b.status !== "rejected" && (
                <button
                  onClick={() => action(`/api/admin/bookings/reject/${b._id}`, "تم رفض الطلب")}
                  className="bg-red-600 px-3 py-1 rounded-lg"
                >
                  رفض
                </button>
              )}
            </div>

            {/* Reply */}
            <textarea
              placeholder="اكتب ردك للصنايعي..."
              className="w-full mt-4 p-2 rounded bg-slate-800"
              onChange={e => setReply({ ...reply, [b._id]: e.target.value })}
            />

            <button
              onClick={() => sendReply(b._id)}
              className="mt-2 bg-sky-600 px-4 py-2 rounded-xl"
            >
              إرسال رسالة
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

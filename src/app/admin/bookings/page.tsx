"use client";
import { useEffect, useState } from "react";

export default function AdminBookings() {
  const [list, setList] = useState<any[]>([]);
  const [tab, setTab] = useState("pending");
  const [reply, setReply] = useState<{ [key: string]: string }>({});
  const [toast, setToast] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      setList(data.bookings || []);
    } catch (e) { console.error("Fetch error"); }
  };

  useEffect(() => { fetchData(); }, []);

  const action = async (url: string, msg: string) => {
    await fetch(url, { method: "PUT" });
    setToast(msg);
    fetchData();
    setTimeout(() => setToast(""), 3000);
  };

  const sendReply = async (id: string) => {
    if (!reply[id]) return;
    await fetch(`/api/admin/bookings/reply/${id}`, {
      method: "PUT",
      body: JSON.stringify({ message: reply[id] }),
    });
    setToast("تم إرسال الرد بنجاح");
    fetchData();
    setTimeout(() => setToast(""), 3000);
  };

  const stats = {
    pending: list.filter(b => b.status === "pending").length,
    approved: list.filter(b => b.status === "approved").length,
    rejected: list.filter(b => b.status === "rejected").length,
  };

  const filtered = list.filter(b => b.status === tab);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-10 font-sans mt-18" dir="rtl">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 left-5 z-50 animate-bounce bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold">
          {toast}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">لوحة الإدارة</h1>
            <p className="text-slate-400 mt-2 italic text-sm">متابعة طلبات العملاء والفنيين بشكل مباشر</p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex gap-3 overflow-x-auto pb-2 w-full md:w-auto">
            <div className="bg-slate-800/50 p-3 px-5 rounded-2xl border border-slate-700 text-center">
              <p className="text-[10px] uppercase text-slate-500 font-bold">إنتظار</p>
              <p className="text-xl font-black text-amber-500">{stats.pending}</p>
            </div>
            <div className="bg-slate-800/50 p-3 px-5 rounded-2xl border border-slate-700 text-center">
              <p className="text-[10px] uppercase text-slate-500 font-bold">مقبول</p>
              <p className="text-xl font-black text-emerald-500">{stats.approved}</p>
            </div>
            <div className="bg-slate-800/50 p-3 px-5 rounded-2xl border border-slate-700 text-center">
              <p className="text-[10px] uppercase text-slate-500 font-bold">مرفوض</p>
              <p className="text-xl font-black text-rose-500">{stats.rejected}</p>
            </div>
          </div>
        </div>

        {/* Tabs Control */}
        <div className="flex gap-2 mb-8 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 w-fit">
          {["pending", "approved", "rejected"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tab === t ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              {t === "pending" ? "قيد المعالجة" : t === "approved" ? "تمت الموافقة" : "المرفوضة"}
            </button>
          ))}
        </div>

        {/* List of Cards */}
        <div className="grid gap-6 grid-cols-1">
          {filtered.length === 0 && (
            <div className="text-center py-20 bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-800 text-slate-500">
              لا توجد طلبات في هذا القسم حالياً
            </div>
          )}
          
          {filtered.map(b => (
            <div key={b._id} className="group bg-slate-900 border border-slate-800 p-6 rounded-[2rem] hover:shadow-2xl hover:border-blue-500/30 transition-all duration-300">
              <div className="flex flex-col lg:flex-row gap-8">
                
                {/* Info Section */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-blue-400 font-bold text-xs uppercase tracking-widest border-r-4 border-blue-500 pr-3">تفاصيل العميل</h3>
                    <p className="text-lg font-bold text-white leading-none">{b.userId?.name || "اسم غير معروف"}</p>
                    <div className="text-sm text-slate-400 space-y-1">
                      <p> {b.userId?.email}</p>
                      <p> {b.userId?.phone}</p>
                      <p> {b.userId?.address}</p>
                      <p className="text-slate-300 bg-slate-800/50 p-3 rounded-xl mt-2 italic text-xs leading-relaxed border border-slate-700">"{b.details}"</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-emerald-400 font-bold text-xs uppercase tracking-widest border-r-4 border-emerald-500 pr-3">تفاصيل الفني</h3>
                    <p className="text-lg font-bold text-white leading-none">{b.craftsmanId?.userId?.name}</p>
                    <div className="text-sm text-slate-400 space-y-1">
                      <p> الاميل: {b.craftsmanId?.userId?.email}</p>            
                      <p> رقم: {b.craftsmanId?.userId?.phone}</p>
                      <p>  {b.craftsmanId?.address}</p>
                      <p> التخصص: {b.craftsmanId?.jobTitle}</p>
                      <p className="text-emerald-500 font-bold"> التكلفة: {b.price} ج.م</p>
                      <p 
                        className="text-slate-300 bg-slate-800/50 p-3 rounded-xl mt-2 italic text-xs leading-relaxed border border-slate-700">
                        رد الفني: {b.craftsmanReply || "لا يوجد رد"}</p>

                    </div>
                  </div>
                </div>

                {/* Actions Section */}
                <div className="lg:w-1/3 flex flex-col justify-between gap-4 border-t lg:border-t-0 lg:border-r border-slate-800 pt-6 lg:pt-0 lg:pr-8">
                  <div className="flex flex-wrap gap-2">
                    {b.status === "pending" && (
                      <button onClick={() => action(`/api/admin/bookings/approve/${b._id}`, "تم القبول")} 
                              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-xs font-bold transition-colors">موافقة</button>
                    )}
                    {b.status !== "rejected" && (
                      <button onClick={() => action(`/api/admin/bookings/reject/${b._id}`, "تم الرفض")} 
                              className="flex-1 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white py-2 rounded-xl text-xs font-bold transition-all border border-rose-500/20">رفض</button>
                    )}
                    {(b.status === "approved" || b.status === "rejected") && (
                      <button onClick={() => action(`/api/admin/bookings/pending/${b._id}`, "تمت الإعادة")} 
                              className="flex-1 bg-slate-700 text-white py-2 rounded-xl text-xs font-bold hover:bg-slate-600">انتظار</button>
                    )}
                    <button onClick={async () => { if(confirm("حذف؟")) action(`/api/admin/bookings/delete/${b._id}`, "تم الحذف"); }} 
                            className="p-2 px-4 bg-slate-800 hover:bg-rose-900 text-slate-400 hover:text-white rounded-xl text-xs transition-colors italic">حذف</button>
                  </div>

                  <div className="space-y-2">
                     <p 
                        className="text-slate-300 bg-slate-800/50 p-3 rounded-xl mt-2 italic text-xs leading-relaxed border border-slate-700">
                        رد الادمن: {b.adminMessage || "لا يوجد رد"}
                     </p>
                    <textarea
                      placeholder="اكتب تعليمات للإدارة أو الصنايعي..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs focus:border-blue-500 outline-none transition-all resize-none h-20"
                      onChange={e => setReply({ ...reply, [b._id]: e.target.value })}
                    />
                    <button
                      onClick={() => sendReply(b._id)}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 transition-all"
                    >
                      تحديث الرسالة والرد
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
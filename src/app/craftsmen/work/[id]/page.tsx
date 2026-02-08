"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function WorkPage() {
  const { id } = useParams();
  const [job, setJob]: any = useState(null);
  const [reply, setReply] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetch(`/api/craftsmen/work/${id}`)
      .then(res => res.json())
      .then(data => setJob(data.job));
  }, [id]);

  const send = async (decision: string) => {
    await fetch(`/api/craftsmen/work/${id}`, {
      method: "PUT",
      body: JSON.stringify({ reply, price, decision }),
    });
    alert("تم الإرسال");
  };

  if (!job) return null;

  return (
    <div className="p-6 mt-20 max-w-3xl mx-auto text-white">

      <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-xl">

        <h2 className="text-2xl font-bold mb-3">تفاصيل الطلب</h2>
        <p className="text-slate-300 mb-4">{job.details}</p>

        {job.adminMessage && (
          <div className="mb-5 bg-emerald-900/40 border border-emerald-600 p-4 rounded-xl">
            <p className="text-emerald-300 font-semibold text-sm">📩 رسالة الأدمن:</p>
            <p className="text-sm mt-1">{job.adminMessage}</p>
          </div>
        )}

        <textarea
          className="w-full bg-slate-800 p-3 rounded-xl mb-3"
          placeholder="اكتب ردك هنا..."
          onChange={e => setReply(e.target.value)}
        />

        <input
          type="number"
          className="w-full bg-slate-800 p-3 rounded-xl mb-4"
          placeholder="حدد السعر"
          onChange={e => setPrice(e.target.value)}
        />

        <div className="flex gap-4">
          <button
            onClick={() => send("accepted")}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 p-3 rounded-xl font-semibold"
          >
            موافق
          </button>

          <button
            onClick={() => send("declined")}
            className="flex-1 bg-red-600 hover:bg-red-500 p-3 rounded-xl font-semibold"
          >
            غير موافق
          </button>
        </div>

      </div>
    </div>
  );
}

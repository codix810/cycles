"use client";
import { useEffect, useState } from "react";

export default function MyWork() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/craftsmen/my-work")
      .then(res => res.json())
      .then(data => setJobs(data.jobs));
  }, []);

  return (
    <div className="p-6 mt-20 max-w-4xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-8">الشغل المتاح</h1>

{jobs.map(job => (
  <div key={job._id} className="bg-slate-900 border border-slate-700 p-5 rounded-2xl mb-6">

    <div className="flex justify-between">
      <div>
        <p className="font-semibold">اسم الطالب:
          {job.userId.name}</p>
          <p className="text-sm text-slate-400"> العنوان :
          {job.userId.address}</p>
        <p className="text-sm text-slate-400">الوصف:
          {job.details}</p>
        <p className="text-sm text-slate-400"> التكلفه :
          {job.price}</p>

      </div>

     {job.status === "pending" && (
  <span className="bg-amber-600 px-3 py-1 rounded text-xs">
     الطلب قيد مراجعة الأدمن
  </span>
)}

{job.status === "approved" && (
  <span className="bg-emerald-600 px-3 py-1 rounded text-xs">
     تم اعتماد الطلب — كمل الاتفاق
  </span>
)}

    </div>

    {job.adminMessage && (
      <div className="mt-3 bg-emerald-900/40 border border-emerald-600 p-3 rounded-xl">
        <p className="text-emerald-300 text-sm font-semibold">رسالة الأدمن:</p>
        <p className="text-sm">{job.adminMessage}</p>
      </div>
    )}

    <a
      href={`/craftsmen/work/${job._id}`}
      className="inline-block mt-4 bg-sky-600 px-4 py-2 rounded-xl text-sm"
    >
      فتح الطلب
    </a>
  </div>
))}

    </div>
  );
}

"use client";
import { useEffect, useState } from "react";

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [toast, setToast] = useState("");

  const load = async () => {
    const res = await fetch("/api/admin/reviews");
    const data = await res.json();
    setReviews(data.reviews || []);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("حذف التقييم؟")) return;

    await fetch(`/api/admin/reviews/delete/${id}`, {
      method: "DELETE",
    });

    setToast("تم حذف التقييم");
    load();
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-white mt-20">

      {toast && (
        <div className="fixed top-5 right-5 bg-emerald-600 px-4 py-2 rounded-xl">
          {toast}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">إدارة التقييمات</h1>

      <div className="grid gap-5">

        {reviews.map(r => (
          <div key={r._id}
            className="bg-slate-900 border border-slate-700 p-5 rounded-2xl">

            {/* Reviewer */}
            <p className="font-semibold">
              👤 المستخدم: {r.userId?.name}
            </p>

            <p className="text-sm text-slate-400">
              {r.userId?.email}
            </p>

            {/* Craftsman */}
            <p className="mt-2 font-semibold">
              🛠 الصنايعي:
              {r.craftsmanId?.userId?.name}
            </p>

            {/* Rating */}
            <p className="mt-2 text-yellow-400">
              ⭐ {r.rating} / 5
            </p>

            {/* Comment */}
            <p className="mt-2 text-slate-300">
              {r.comment || "بدون تعليق"}
            </p>

            {/* Date */}
            <p className="text-xs text-slate-500 mt-2">
              {new Date(r.createdAt).toLocaleString()}
            </p>

            {/* Delete */}
            <button
              onClick={() => remove(r._id)}
              className="mt-4 bg-red-600 px-4 py-2 rounded-xl"
            >
              حذف التقييم
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}
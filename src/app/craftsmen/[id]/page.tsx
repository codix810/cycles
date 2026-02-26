"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCraftsmenRatings } from "@/lib/reviewService";

export default function CraftsmanDetails() {
  const { id } = useParams();
const [ratingStats, setRatingStats] = useState({ avg: 0, count: 0 });

  const [craftsman, setCraftsman] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState(0);

  const [details, setDetails] = useState("");
  const [price, setPrice] = useState("");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const load = async () => {
    const res = await fetch(`/api/craftsmen/${id}`);
    const data = await res.json();
    setCraftsman(data.craftsman);
  };

  const loadReviews = async () => {
    const res = await fetch(`/api/reviews/${id}`);
    const data = await res.json();
    setReviews(data.reviews);
    setAvgRating(Math.round(data.avg));
  };

useEffect(() => {
  const init = async () => {
    await load();

    const data = await getCraftsmenRatings([id as string]);
    const stat = data.stats[0];

    if (stat) {
      setRatingStats({
        avg: Number(stat.avg.toFixed(1)),
        count: stat.count
      });
    }
  };

  init();
}, []);


  const sendBooking = async () => {
    await fetch("/api/bookings/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ craftsmanId: id, details, price }),
    });
    setDetails(""); setPrice("");
  };

const sendReview = async () => {
  await fetch("/api/reviews/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ craftsmanId: id, rating, comment }),
  });

  setComment("");

  const data = await getCraftsmenRatings([id as string]);
  const stat = data.stats[0];

  if (stat) {
    setRatingStats({
      avg: Number(stat.avg.toFixed(1)),
      count: stat.count
    });
  }
};


  if (!craftsman) return null;

  return (
    <div className="bg-slate-100 min-h-screen p-6 mt-20">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* 🔹 كارت البيانات */}
        <div className="bg-white rounded-2xl shadow p-6 flex gap-6">
          <img src={craftsman.profileImage} className="w-12 h-12 rounded-xl object-cover" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{craftsman.userId.name}</h1>
            <p className="text-gray-500">{craftsman.jobTitle}</p>
            <p className="text-gray-500"> العنوان   :  {craftsman.address} </p>
            <p className="text-gray-500"> {craftsman.experienceYears} :خبرة </p>
            <p className="text-gray-500">{craftsman.description}</p>

            <div className="flex items-center mt-2">
{[1,2,3,4,5].map(s => (
  <span key={s} className={s <= Math.round(ratingStats.avg) ? "text-orange-500" : "text-gray-300"}>★</span>
))}
<span className="ml-2 text-sm text-gray-500">
  ({ratingStats.count}) • {ratingStats.avg || "جديد"}
</span>

            </div>
          </div>
        </div>

        {/* 🔹 معرض الأعمال */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-bold mb-3">أعمال سابقة</h2>
          <div className="grid grid-cols-3 gap-3">
            {craftsman.workImages.map((img:string,i:number)=>(
              <img key={i} src={img} className="h-32 w-full object-cover rounded-lg"/>
            ))}
          </div>
        </div>

        {/* 🔹 الطلب */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-bold mb-3">اطلب الصنايعي</h2>

          <textarea
            placeholder="وصف الشغل المطلوب"
            value={details}
            onChange={e=>setDetails(e.target.value)}
            className="w-full border rounded-xl p-3 mb-3"
          />

          <input
            type="number"
            placeholder="التكلفة المتوقعة"
            value={price}
            onChange={e=>setPrice(e.target.value)}
            className="w-full border rounded-xl p-3 mb-3"
          />

          <button onClick={sendBooking}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl w-full font-bold">
            إرسال الطلب
          </button>
        </div>

        {/* 🔹 التقييم */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-bold mb-3">قيّم الصنايعي</h2>

          <div className="flex mb-3">
            {[1,2,3,4,5].map(s => (
              <span key={s}
                onClick={()=>setRating(s)}
                className={`text-3xl cursor-pointer ${s<=rating?"text-orange-500":"text-gray-300"}`}>
                ★
              </span>
            ))}
          </div>

          <textarea
            placeholder="اكتب رأيك"
            value={comment}
            onChange={e=>setComment(e.target.value)}
            className="w-full border rounded-xl p-3 mb-3"
          />

          <button onClick={sendReview}
            className="bg-slate-900 text-white px-6 py-3 rounded-xl w-full font-bold">
            إرسال التقييم
          </button>
        </div>

      </div>
    </div>
  );
}

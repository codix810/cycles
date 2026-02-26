"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getCraftsmenRatings } from "@/lib/reviewService";

export default function ProfilePage() {
  const [data, setData] = useState<any>(null);
const [stats, setStats] = useState<any>(null);
const [userStats, setUserStats] = useState<any>(null);
const [ratingStats, setRatingStats] = useState({ avg: 0, count: 0 });
const [bookings, setBookings] = useState<any[]>([]);
const [editingId, setEditingId] = useState<string | null>(null);
const [editDetails, setEditDetails] = useState("");
const [editPrice, setEditPrice] = useState("");
const [now, setNow] = useState(Date.now());
const [confirmId, setConfirmId] = useState<string | null>(null);
const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
const [editRating, setEditRating] = useState(5);
const [editComment, setEditComment] = useState("");
type Review = {
  _id: string;
  rating: number;
  comment: string;
  craftsmanId?: any;
};

const [myReviews, setMyReviews] = useState<Review[]>([]);
const totalSpent = bookings
  .filter(b => b.status === "approved")
  .reduce((sum, b) => sum + (Number(b.price) || 0), 0);

useEffect(() => {
  const interval = setInterval(() => {
    setNow(Date.now());
  }, 60000);

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  fetch("/api/reviews")
    .then(r => r.json())
    .then(d => setMyReviews(d.reviews || []));
}, []);


useEffect(() => {
  fetch("/api/user/bookings")
    .then(r => r.json())
    .then(d => setBookings(d.bookings || []));
}, []);

useEffect(() => {
  const init = async () => {
    const profile = await fetch("/api/profile").then(r => r.json());
    setData(profile);

    const s = await fetch("/api/craftsmen/stats").then(r => r.json());
    setStats(s);

    const us = await fetch("/api/user/stats").then(r => r.json());
    setUserStats(us);

    if (profile.role === "craftsman" && profile.craftsman?._id) {
      const r = await getCraftsmenRatings([profile.craftsman._id]);
      const stat = r.stats[0];
      if (stat) {
        setRatingStats({
          avg: Number(stat.avg.toFixed(1)),
          count: stat.count
        });
      }
    }
  };

  init();
}, []);

const getRemainingTime = (date?: string) => {
  if (!date) return "";

  const end = new Date(date).getTime();
  if (isNaN(end)) return "";

  const diff = end - now;
  if (diff <= 0) return "انتهى الوقت";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return `${hours} س ${minutes} د`;
};

const cancelBooking = async (id: string) => {
  await fetch(`/api/bookings/cancel/${id}`, { method: "PUT" });

  // حذف من الواجهة فورًا
  setBookings(prev => prev.filter(b => b._id !== id));

  setConfirmId(null);
};

const updateBooking = async (id: string) => {
  const res = await fetch(`/api/bookings/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      details: editDetails,
      price: Number(editPrice)
    })
  });

  if (!res.ok) return;

  setBookings(prev =>
    prev.map(b =>
      b._id === id
        ? { ...b, details: editDetails, price: Number(editPrice) }
        : b
    )
  );

  setEditingId(null);
};

const updateReview = async (id: string) => {
  const res = await fetch(`/api/reviews/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      rating: editRating,
      comment: editComment,
    }),
  });

  if (!res.ok) return;

  const data = await res.json();

  setMyReviews(prev =>
    prev.map(r =>
      r._id === id
        ? { ...r, rating: editRating, comment: editComment }
        : r
    )
  );

  setEditingReviewId(null);
};


const deleteReview = async (id: string) => {
  if (!confirm("حذف التقييم؟")) return;

  const res = await fetch(`/api/reviews/delete/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) return;

  setMyReviews(prev => prev.filter(r => r._id !== id));
};


  if (!data) return <p className="p-10 text-center">جاري التحميل...</p>;

  const { role, user, craftsman } = data;

  return (
    <div className="min-h-screen bg-gray-50 flex mt-20">

      {/* ===== SIDEBAR ===== */}
      <aside className="w-72 bg-[#0F766E] text-white p-6 hidden md:flex flex-col">
        <div className="text-center mb-8">
          <img src={craftsman?.profileImage || "/avatar.png"} className="w-24 h-24 mx-auto rounded-full border-4 border-white" />
          <h2 className="mt-1 font-bold text-lg">{user.name}</h2>

          <p className="text-sm opacity-80">{role === "craftsman" ? craftsman.jobTitle : "مستخدم"}</p>
          
        </div>

        <nav className="space-y-3 text-sm">
          <Link href="/profile" className="block hover:bg-white/10 p-2 rounded">الملف الشخصي</Link>
          <Link href="/profile/edit" className="block hover:bg-white/10 p-2 rounded">تعديل البيانات</Link>
          {role === "craftsman" && (
            <>
              <Link href="/craftsman/my-work" className="block hover:bg-white/10 p-2 rounded">الطلبات</Link>
              <Link href="/craftsman/services" className="block hover:bg-white/10 p-2 rounded">الخدمات</Link>
            </>
          )}
          <button onClick={() => fetch("/api/auth/logout").then(()=>location.href="/login")} className="w-full text-left hover:bg-red-500/30 p-2 rounded mt-4">تسجيل خروج</button>
        </nav>
      </aside>

      {/* ===== CONTENT ===== */}
      <main className="flex-1 p-6 space-y-6">

        {/* HEADER CARD */}
        <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">مرحباً، {user.name}</h1>
                      <h4 className="mt-1 font-bold text-sm">{user.phone}</h4>
          <h4 className="mt-1 font-bold text-sm">{user.email}</h4>
            <p className="text-gray-500">{role === "craftsman" ? "لوحة تحكم الصنايعي" : "لوحة تحكم المستخدم"}</p>
          </div>
          <Link href="/profile/edit" className="bg-teal-600 text-white px-4 py-2 rounded-xl">تعديل</Link>
        </div>

        {/* ==== المستخدم العادي ==== */}
        
{role !== "craftsman" && userStats && (
  <>
  <div className="grid md:grid-cols-4 gap-6">
    <StatCard title="عدد الطلبات" value={userStats.total} />
    <StatCard title="طلبات مكتملة" value={userStats.completed} />
    <StatCard title="طلبات جارية" value={userStats.ongoing} />
<StatCard title="إجمالي المدفوع" value={`₺ ${totalSpent}`} />
    
  </div>
<div className="bg-white rounded-2xl shadow p-6">
  <h2 className="font-bold text-lg mb-6">طلباتي</h2>

  {bookings.length === 0 && (
    <p className="text-gray-400">لا توجد طلبات</p>
  )}

  {bookings.map((b) => (
    <div
      key={b._id}
      className="border border-gray-200 rounded-2xl p-5 mb-4 hover:shadow-md transition"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-lg">
            {b.craftsmanId?.userId?.name}
          </p>
          <p className="text-gray-500 text-sm">
            {b.craftsmanId?.jobTitle}
          </p>
        </div>

        <span
          className={`px-3 py-1 text-xs rounded-full font-semibold ${
            b.status === "approved"
              ? "bg-emerald-100 text-emerald-600"
              : b.status === "rejected"
              ? "bg-red-100 text-red-600"
              : "bg-amber-100 text-amber-600"
          }`}
        >
          {b.status === "approved"
            ? "تمت الموافقة"
            : b.status === "rejected"
            ? "مرفوض"
            : "قيد الانتظار"}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <p><strong>الوصف:</strong> {b.details}</p>
        <p><strong>السعر:</strong> ₺ {b.price || 0}</p>

        {b.adminMessage && (
          <p className="text-blue-600">
            <strong>رسالة الأدمن:</strong> {b.adminMessage}
          </p>
        )}

        {b.craftsmanReply && (
          <p className="text-purple-600">
            <strong>رد الصنايعي:</strong> {b.craftsmanReply}
          </p>
        )}

{b.status === "pending" && (
  <>
    <p className="text-xs text-amber-600 mt-1">
       الرد خلال: {getRemainingTime(b.expiresAt)}
    </p>

    <div className="flex gap-3 mt-4">

      <button
        onClick={() => {
          setEditingId(b._id);
          setEditDetails(b.details);
          setEditPrice(b.price || "");
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg text-sm transition"
      >
        تعديل
      </button>

      <button
        onClick={() => setConfirmId(b._id)}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg text-sm transition"
      >
        إلغاء
      </button>

    </div>
    {editingId === b._id && (
  <div className="mt-3 space-y-2 bg-gray-50 p-4 rounded-xl">
    <textarea
      value={editDetails}
      onChange={e => setEditDetails(e.target.value)}
      className="w-full border rounded-lg p-2 text-sm"
    />

    <input
      type="number"
      value={editPrice}
      onChange={e => setEditPrice(e.target.value)}
      className="w-full border rounded-lg p-2 text-sm"
    />

    <div className="flex gap-2">
      <button
        onClick={() => updateBooking(b._id)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-sm"
      >
        حفظ
      </button>

      <button
        onClick={() => setEditingId(null)}
        className="bg-gray-400 text-white px-3 py-1 rounded-lg text-sm"
      >
        إلغاء
      </button>
    </div>
  </div>
)}

  </>
)}



      </div>
    </div>
  ))}
</div>
<div className="bg-white rounded-2xl shadow p-6">
  <h2 className="font-bold text-lg mb-6">تقييماتي</h2>

  {myReviews.length === 0 && (
    <p className="text-gray-400">لم تقم بتقييم أحد بعد</p>
  )}

 {myReviews.map((r: any) => (
  <div key={r._id} className="border rounded-xl p-4 mb-3">

    <p className="font-bold">
      {r.craftsmanId?.userId?.name}
    </p>

    {editingReviewId === r._id ? (
      <>
        <div className="flex mt-2">
          {[1,2,3,4,5].map(s => (
            <span
              key={s}
              onClick={() => setEditRating(s)}
              className={`text-2xl cursor-pointer ${
                s <= editRating ? "text-orange-500" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          value={editComment}
          onChange={e => setEditComment(e.target.value)}
          className="w-full border rounded-lg p-2 mt-2 text-sm"
        />

        <div className="flex gap-2 mt-2">
          <button
            onClick={() => updateReview(r._id)}
            className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-sm"
          >
            حفظ
          </button>

          <button
            onClick={() => setEditingReviewId(null)}
            className="bg-gray-400 text-white px-3 py-1 rounded-lg text-sm"
          >
            إلغاء
          </button>
        </div>
      </>
    ) : (
      <>
        <div className="flex mt-1">
          {[1,2,3,4,5].map(s => (
            <span
              key={s}
              className={
                s <= r.rating
                  ? "text-orange-500 text-xl"
                  : "text-gray-300 text-xl"
              }
            >
              ★
            </span>
          ))}
        </div>

        <p className="text-sm text-gray-600 mt-2">
          {r.comment}
        </p>

        <div className="flex gap-3 mt-3">
          <button
            onClick={() => {
              setEditingReviewId(r._id);
              setEditRating(r.rating);
              setEditComment(r.comment);
            }}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
          >
            تعديل
          </button>

          <button
            onClick={() => deleteReview(r._id)}
            className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
          >
            حذف
          </button>
        </div>
      </>
    )}
  </div>
))}

</div>

  </>
        )}

        {/* ==== الصنايعي ==== */}
          {role === "craftsman" && craftsman && stats && (

          <>
            <div className="grid md:grid-cols-1 gap-6">

  <StatCard
    title="التقييم"
    value={`⭐ ${ratingStats.avg || "جديد"} (${ratingStats.count})`}
  />
  </div>
  <div className="grid md:grid-cols-4 gap-6">


<StatCard title="كل الطلبات" value={stats.totalRequests} />

<StatCard title="طلبات وافق عليها الأدمن" value={stats.adminApproved} />

<StatCard title="طلبات منجزة" value={stats.completed} />

<StatCard title="إجمالي الأرباح" value={`₺ ${stats.earnings}`} />

</div>

            {/* نبذة */}
<Card>
  <h3 className="font-bold text-lg mb-4">التخصص والخبره</h3>

  <div className="grid md:grid-cols-3 gap-6 text-sm">

    <div className="bg-gray-50 p-4 rounded-xl">
      <p className="text-gray-500 mb-1">التخصص</p>
      <p className="font-bold text-teal-700">{craftsman.jobTitle}</p>
    </div>

    <div className="bg-gray-50 p-4 rounded-xl">
      <p className="text-gray-500 mb-1">سنين الخبرة</p>
      <p className="font-bold text-teal-700">{craftsman.experienceYears} سنة</p>
    </div>

    <div className="bg-gray-50 p-4 rounded-xl">
      <p className="text-gray-500 mb-1">الحالة</p>
      <p className={`font-bold ${craftsman.isApproved ? "text-green-600" : "text-orange-500"}`}>
        {craftsman.isApproved ? "معتمد" : "قيد المراجعة"}
      </p>
    </div>

  </div>

  <div className="mt-6">
    <p className="text-gray-500 mb-1">نبذة تعريفية</p>
    <p>{craftsman.description}</p>
  </div>
</Card>


            {/* معرض الأعمال */}
            <Card>
              <h3 className="font-bold text-lg mb-4">معرض أعمالك</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {craftsman.workImages.map((img: string, i: number) => (
                  <motion.img key={i} whileHover={{ scale: 1.05 }} src={img} className="rounded-xl shadow" />
                ))}
              </div>
            </Card>
             {/* معرض الأعمال */}
            <Card>
              <h3 className="font-bold text-lg mb-4">صورة البطاقه</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <img src={craftsman?.idCardImage || "/avatar.png"} className="rounded-xl shadow"  />

              </div>
            </Card>


          </>
        )}
        {confirmId && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center"
    >
      <h3 className="text-lg font-bold mb-4">
        هل أنت متأكد من إلغاء الطلب؟
      </h3>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => cancelBooking(confirmId)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          نعم، إلغاء
        </button>

        <button
          onClick={() => setConfirmId(null)}
          className="bg-gray-300 px-4 py-2 rounded-lg"
        >
          رجوع
        </button>
      </div>
    </motion.div>
  </div>
)}

      </main>
    </div>
  );
}

const Card = ({ children }: any) => (
  <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="bg-white p-6 rounded-2xl shadow">
    {children}
  </motion.div>
);

const StatCard = ({ title, value }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow text-center">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className="text-2xl font-bold mt-2">{value}</h2>
  </div>
);

"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ProfilePage() {
  const [data, setData] = useState<any>(null);
const [stats, setStats] = useState<any>(null);
const [userStats, setUserStats] = useState<any>(null);

useEffect(() => {
  fetch("/api/profile").then(r => r.json()).then(setData);
  fetch("/api/craftsmen/stats").then(r => r.json()).then(setStats);
    fetch("/api/user/stats").then(r => r.json()).then(setUserStats);

}, []);



  if (!data) return <p className="p-10 text-center">جاري التحميل...</p>;

  const { role, user, craftsman } = data;

  return (
    <div className="min-h-screen bg-gray-50 flex mt-20">

      {/* ===== SIDEBAR ===== */}
      <aside className="w-72 bg-[#0F766E] text-white p-6 hidden md:flex flex-col">
        <div className="text-center mb-8">
          <img src={craftsman?.profileImage || "/avatar.png"} className="w-24 h-24 mx-auto rounded-full border-4 border-white" />
          <h2 className="mt-3 font-bold text-lg">{user.name}</h2>
          <p className="text-sm opacity-80">{role === "craftsman" ? craftsman.jobTitle : "مستخدم"}</p>
        </div>

        <nav className="space-y-3 text-sm">
          <Link href="/profile" className="block hover:bg-white/10 p-2 rounded">الملف الشخصي</Link>
          <Link href="/profile/edit" className="block hover:bg-white/10 p-2 rounded">تعديل البيانات</Link>
          {role === "craftsman" && (
            <>
              <Link href="/craftsman/bookings" className="block hover:bg-white/10 p-2 rounded">الطلبات</Link>
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
            <p className="text-gray-500">{role === "craftsman" ? "لوحة تحكم الصنايعي" : "لوحة تحكم المستخدم"}</p>
          </div>
          <Link href="/profile/edit" className="bg-teal-600 text-white px-4 py-2 rounded-xl">تعديل</Link>
        </div>

        {/* ==== المستخدم العادي ==== */}
{role !== "craftsman" && userStats && (
  <div className="grid md:grid-cols-4 gap-6">
    <StatCard title="عدد الطلبات" value={userStats.total} />
    <StatCard title="طلبات مكتملة" value={userStats.completed} />
    <StatCard title="طلبات جارية" value={userStats.ongoing} />
    <StatCard title="إجمالي المدفوع" value={`₺ ${userStats.spent}`} />
  </div>
        )}

        {/* ==== الصنايعي ==== */}
          {role === "craftsman" && craftsman && stats && (

          <>
   <div className="grid md:grid-cols-4 gap-6">
    <StatCard title="التقييم" value={`⭐ ${stats.rating}`} />
    <StatCard title="طلبات منجزة" value={stats.completed} />
    <StatCard title="طلبات قيد التنفيذ" value={stats.inProgress} />
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

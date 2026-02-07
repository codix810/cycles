"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ProfilePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalImg, setModalImg] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/profile");
      const d = await res.json();
      setData(d);
      setLoading(false);
    };
    load();
  }, []);

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف الحساب؟")) return;
    await fetch("/api/delete-account", { method: "DELETE" });
    window.location.href = "/login";
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout");
    window.location.href = "/login";
  };

  if (loading)
    return <p className="p-10 text-xl text-center animate-pulse">جاري التحميل...</p>;
  if (data?.error)
    return <p className="p-10 text-xl text-red-500 text-center">{data.error}</p>;

  const { role, user, craftsman } = data;

  const Card = ({ children }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-lg p-6 rounded-2xl mb-6 border border-gray-100 backdrop-blur-sm"
    >
      {children}
    </motion.div>
  );

  const openModal = (img: string) => setModalImg(img);
  const closeModal = () => setModalImg(null);

  return (
    <div className="max-w-3xl mx-auto p-4 mt-10">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text">
        الملف الشخصي
      </h1>

      {/* بيانات المستخدم */}
      <Card>
        <h2 className="text-2xl font-bold mb-4 text-blue-700">بيانات الحساب</h2>
        <p><strong>الاسم:</strong> {user.name}</p>
        <p><strong>الإيميل:</strong> {user.email}</p>
        <p><strong>رقم الهاتف:</strong> {user.phone}</p>
        <p><strong>الدور:</strong> {role}</p>

        <div className="flex gap-3 mt-5">
         <Link
            href="profile/edit"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-bold shadow hover:bg-blue-700"
          >
            تعديل البيانات
          </Link>
          <button
            onClick={handleLogout}
            className="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition"
          >
            تسجيل خروج
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
          >
            حذف الحساب
          </button>
        </div>
      </Card>

      {/* بيانات الصنايعي */}
      {role === "craftsman" && craftsman && (
        <Card>
          <h2 className="text-2xl font-bold mb-4 text-blue-700">بيانات الصنايعي</h2>
          <p><strong>مجال الشغل:</strong> {craftsman.jobTitle}</p>
          <p><strong>الوصف:</strong> {craftsman.description}</p>
          <p><strong>سنين الخبرة:</strong> {craftsman.experienceYears}</p>
          <p><strong>العنوان:</strong> {craftsman.address}</p>
          <p><strong>الحالة:</strong> {craftsman.status}</p>
          <p><strong>موافقة الأدمن:</strong> {craftsman.isApproved ? "✔️ مقبول" : "❌ تحت المراجعة"}</p>

          <div className="mt-6">
            <h3 className="font-bold mb-3 text-lg">الصورة الشخصية</h3>
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={craftsman.profileImage}
              onClick={() => openModal(craftsman.profileImage)}
              className="w-40 rounded-xl cursor-pointer shadow"
            />
          </div>

          <div className="mt-6">
            <h3 className="font-bold mb-3 text-lg">صورة البطاقة</h3>
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={craftsman.idCardImage}
              onClick={() => openModal(craftsman.idCardImage)}
              className="w-52 rounded-xl cursor-pointer shadow"
            />
          </div>

          <div className="mt-6">
            <h3 className="font-bold mb-3 text-lg">صور الشغل</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {craftsman.workImages.map((img: string, i: number) => (
                <motion.img
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  src={img}
                  onClick={() => openModal(img)}
                  className="rounded-xl w-full cursor-pointer shadow"
                />
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Modal للصور */}
      {modalImg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <motion.img
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            src={modalImg}
            className="max-w-[90%] max-h-[90%] rounded-2xl shadow-2xl"
          />
        </motion.div>
      )}
    </div>
  );
}
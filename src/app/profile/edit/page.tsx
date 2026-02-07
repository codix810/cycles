"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function EditProfile() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<any>({});
  const [newIdCard, setNewIdCard] = useState<File | null>(null);
  const [newProfileImg, setNewProfileImg] = useState<File | null>(null);
  const [newWorkImages, setNewWorkImages] = useState<FileList | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/profile");
      const d = await res.json();
      setData(d);

      setForm({
        name: d.user.name,
        phone: d.user.phone,
        jobTitle: d.craftsman?.jobTitle || "",
        description: d.craftsman?.description || "",
        experienceYears: d.craftsman?.experienceYears || "",
        address: d.craftsman?.address || "",
      });

      setLoading(false);
    };

    load();
  }, []);

  const uploadCloud = async (file: File) => {
    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", "unsigned_dashboard");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY}/image/upload`,
      { method: "POST", body }
    );

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async () => {

    // حماية ضد null error
    const craftsman = data?.craftsman || null;

    let idCardImage = craftsman?.idCardImage || null;
    let profileImage = craftsman?.profileImage || null;
    let workImages = craftsman?.workImages || [];

    if (newIdCard) idCardImage = await uploadCloud(newIdCard);
    if (newProfileImg) profileImage = await uploadCloud(newProfileImg);

    if (newWorkImages) {
      workImages = [];
      for (let i = 0; i < newWorkImages.length; i++) {
        const url = await uploadCloud(newWorkImages[i]);
        workImages.push(url);
      }
    }

    const body: any = {
      name: form.name,
      phone: form.phone,
      password: form.password,
    };

    if (data.role === "craftsman" && craftsman) {
      Object.assign(body, {
        jobTitle: form.jobTitle,
        description: form.description,
        experienceYears: form.experienceYears,
        address: form.address,
        idCardImage,
        profileImage,
        workImages,
      });
    }

    await fetch("/api/update-profile", {
      method: "PUT",
      body: JSON.stringify(body),
    });

    window.location.href = "/profile";
  };

  if (loading)
    return <p className="p-10 text-xl text-center animate-pulse">جاري التحميل...</p>;

  const { role } = data;
  const craftsman = data?.craftsman || null;

  return (
    <div className="max-w-3xl mx-auto p-4 mt-10">
      <h1
        className="text-4xl font-bold mb-8 text-center  
        bg-gradient-to-r from-indigo-500 to-purple-600 
        text-transparent bg-clip-text"
      >
        تعديل البيانات
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-lg border p-6 rounded-2xl space-y-4"
      >
        <input
          className="w-full p-3 border rounded-xl"
          placeholder="الاسم"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full p-3 border rounded-xl"
          placeholder="رقم الهاتف"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          type="password"
          className="w-full p-3 border rounded-xl"
          placeholder="كلمة مرور جديدة (اختياري)"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {role === "craftsman" && craftsman && (
          <>
            <input
              className="w-full p-3 border rounded-xl"
              placeholder="مجال الشغل"
              value={form.jobTitle}
              onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
            />

            <input
              className="w-full p-3 border rounded-xl"
              placeholder="وصف العمل"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <input
              className="w-full p-3 border rounded-xl"
              placeholder="سنين الخبرة"
              value={form.experienceYears}
              onChange={(e) =>
                setForm({ ...form, experienceYears: e.target.value })
              }
            />

            <input
              className="w-full p-3 border rounded-xl"
              placeholder="العنوان"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />

            <label className="font-bold mt-2">صورة البطاقة (اختياري)</label>
            <input type="file" onChange={(e) => setNewIdCard(e.target.files?.[0] || null)} />

            <label className="font-bold mt-2">الصورة الشخصية (اختياري)</label>
            <input type="file" onChange={(e) => setNewProfileImg(e.target.files?.[0] || null)} />

            <label className="font-bold mt-2">صور الشغل الجديدة (اختياري)</label>
            <input type="file" multiple onChange={(e) => setNewWorkImages(e.target.files)} />
          </>
        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold mt-6 hover:bg-indigo-700 transition"
        >
          حفظ التعديلات
        </button>
      </motion.div>
    </div>
  );
}

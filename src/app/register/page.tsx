"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import join from "../../assets/images/register.png";

type Role = "client" | "craftsman";

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState<Role>("client");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    jobTitle: "",
    description: "",
    experienceYears: "",
    address: "",
  });

  const [idCardImage, setIdCardImage] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [workImages, setWorkImages] = useState<FileList | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const uploadToCloudinary = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "unsigned_dashboard");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY}/image/upload`,
      { method: "POST", body: data }
    );

    const result = await res.json();
    return result.secure_url as string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.password) {
      alert("من فضلك املأ البيانات الأساسية");
      return;
    }

    if (role === "craftsman") {
      if (
        !form.jobTitle ||
        !form.description ||
        !form.experienceYears ||
        !form.address ||
        !idCardImage ||
        !profileImage
      ) {
        alert("من فضلك املأ كل بيانات الصنايعي");
        return;
      }
    }

    setLoading(true);

    try {
      let idCardURL = "";
      let profileURL = "";
      const workImagesURLs: string[] = [];

      if (role === "craftsman") {
        idCardURL = await uploadToCloudinary(idCardImage!);
        profileURL = await uploadToCloudinary(profileImage!);

        if (workImages) {
          for (const img of Array.from(workImages)) {
            workImagesURLs.push(await uploadToCloudinary(img));
          }
        }
      }

      const endpoint =
        role === "client"
          ? "/api/auth/register"
          : "/api/auth/register-craftsman";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          role,
          idCardImage: idCardURL,
          profileImage: profileURL,
          workImages: workImagesURLs,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "حصل خطأ أثناء التسجيل");
        return;
      }

      router.push("/");
    } catch {
      alert("مشكلة في الاتصال");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 ">
    {/* Form Side */}
    <div className="flex items-center justify-center px-8 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <h2 className="text-center text-2xl font-bold text-[#0D9488] mb-6">
          إنشاء حساب جديد
        </h2>

        {/* Role */}
        <div className="flex gap-4 justify-center mb-6">
          {["client", "craftsman"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r as Role)}
              className={`px-5 py-2 rounded-xl font-bold transition
                ${
                  role === r
                    ? "bg-[#0D9488] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
            >
              {r === "client" ? "عميل" : "صنايعي"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Shared Inputs */}
          <input
            name="name"
            placeholder="الاسم"
            onChange={handleChange}
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-[#0D9488] outline-none"
          />
          <input
            name="email"
            placeholder="الإيميل"
            onChange={handleChange}
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-[#0D9488] outline-none"
          />
          <input
            name="phone"
            placeholder="رقم التليفون"
            onChange={handleChange}
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-[#0D9488] outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="كلمة المرور"
            onChange={handleChange}
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-[#0D9488] outline-none"
          />

          {/* Craftsman Fields */}
          {role === "craftsman" && (
            <div className="space-y-4">
              <input name="jobTitle" onChange={handleChange} placeholder="مجال العمل" className="input" />
              <input name="description" onChange={handleChange} placeholder="الوصف" className="input" />
              <input name="experienceYears" onChange={handleChange} placeholder="سنين الخبرة" className="input" />
              <input name="address" onChange={handleChange} placeholder="العنوان" className="input" />

              <input type="file" onChange={(e) => setIdCardImage(e.target.files?.[0] || null)} />
              <input type="file" onChange={(e) => setProfileImage(e.target.files?.[0] || null)} />
              <input type="file" multiple onChange={(e) => setWorkImages(e.target.files)} />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[#0D9488] text-white py-3 rounded-xl font-bold hover:opacity-90"
          >
            {loading ? "جاري التسجيل..." : "تسجيل"}
          </button>
        </form>
      </motion.div>
    </div>
    
    {/* Image Side */}
    <div className="relative hidden lg:block">
      <Image
        src={join}
        alt="Join us"
        fill
        className="object-cover brightness-90"
        priority
      />
    </div>

  </div>
);

}

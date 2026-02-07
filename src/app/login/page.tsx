"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import loginImg from "../../assets/images/register.png"; // عدل المسار لو مختلف

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("من فضلك املأ كل البيانات");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطأ في تسجيل الدخول");
        return;
      }

      router.push("/");
    } catch {
      setError("مشكلة في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      
      {/* Image Side */}
      <div className="relative hidden lg:block">
        <Image
          src={loginImg}
          alt="Login"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <h1 className="text-2xl font-bold text-center text-[#0D9488] mb-6">
            تسجيل الدخول
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm mb-1 text-gray-600">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0D9488]"
                placeholder="example@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-1 text-gray-600">
                كلمة المرور
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0D9488]"
                placeholder="********"
              />
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 text-sm text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0D9488] text-white py-3 rounded-xl font-bold text-lg hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "جاري تسجيل الدخول..." : "دخول"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            معندكش حساب؟{" "}
            <Link
              href="/register"
              className="text-[#0D9488] font-semibold hover:underline"
            >
              اعمل حساب جديد
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

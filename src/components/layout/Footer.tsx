"use client";
import Link from "next/link";
import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 py-12 border-t">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        
        {/* Logo & Description */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-900">صنايعي</h2>
          <p className="text-gray-600 text-sm">
            منصة موثوقة تربطك بأفضل الحرفيين المحليين في منطقتك بسرعة وسهولة.
          </p>

          {/* Socials */}
          <div className="flex gap-4 mt-2 text-gray-500">
            <a href="#" className="hover:text-blue-600 transition">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-pink-500 transition">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-sky-500 transition">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-blue-700 transition">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2">
          <h3 className="text-gray-900 font-semibold text-lg mb-2">
            روابط سريعة
          </h3>
          
          <Link href="/" className="hover:text-gray-900 transition">
            الرئيسية
          </Link>
          <a href="/services" className="hover:text-gray-900 transition">
            الخدمات
          </a>
          <a href="/top-workers" className="hover:text-gray-900 transition">
            أفضل الصنايعية
          </a>
          <a href="/contact" className="hover:text-gray-900 transition">
            تواصل معنا
          </a>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-2">
          <h3 className="text-gray-900 font-semibold text-lg mb-2">
            تواصل معنا
          </h3>
          <p>📧 info@sanaee.com</p>
          <p>📞 0123456789</p>
          <p>📍 القاهرة، مصر</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 border-t pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} صنايعي. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
};

export default Footer;

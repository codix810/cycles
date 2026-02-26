import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import NavWrapper from "@/components/NavWrapper";
import Footer from "@/components/layout/Footer";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  display: "swap", // تحسين الأداء
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sanayie.com"),

  title: {
    default: "صنايعي | Sanayie",
    template: "%s | صنايعي",
  },

  description:
    "منصة صنايعي تربطك بأفضل الحرفيين والصنايعية في منطقتك بسهولة وأمان. Sanayie connects you with trusted local craftsmen instantly.",

  keywords: [
    "صنايعي",
    "حرفيين",
    "سباك",
    "كهربائي",
    "نجار",
    "خدمات منزلية",
    "craftsmen",
    "handyman",
    "home services",
    "local workers",
  ],

  authors: [{ name: "Sanayie Team" }],
  creator: "Sanayie",
  publisher: "Sanayie",

  alternates: {
    canonical: "/",
    languages: {
      ar: "/ar",
      en: "/en",
    },
  },

  openGraph: {
    title: "صنايعي | أفضل منصة للحرفيين",
    description:
      "ابحث عن أفضل الصنايعية في منطقتك بسرعة وأمان عبر منصة صنايعي.",
    url: "https://sanayie.com",
    siteName: "صنايعي",
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Sanayie Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "صنايعي | Sanayie",
    description: "أفضل منصة للعثور على الصنايعية والحرفيين بسهولة.",
    images: ["/og.jpg"],
  },

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" >
      <body className={`${cairo.className} antialiased bg-white text-gray-900`}>
        <NavWrapper />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

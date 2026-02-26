import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import NavWrapper from "@/components/NavWrapper";
import Footer from "@/components/layout/Footer";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sanayie.com"),

  title: {
    default: "صنايعي | Sanayie - أفضل منصة للعثور على الصنايعية والحرفيين",
    template: "%s | صنايعي",
  },

  description:
    "صنايعي هي منصة ذكية تساعدك في العثور على أفضل الصنايعية والحرفيين الموثوقين بالقرب منك بسرعة وأمان. احجز سباك، كهربائي، نجار، نقاش وغيرهم خلال دقائق. Sanayie connects you with trusted local craftsmen instantly.",

  keywords: [
    "صنايعي",
    "حجز صنايعي",
    "أفضل سباك",
    "كهربائي قريب",
    "نجار محترف",
    "خدمات منزلية",
    "craftsmen egypt",
    "handyman near me",
    "home services egypt",
  ],

  openGraph: {
    title:
      "صنايعي | احجز أفضل الصنايعية والحرفيين في منطقتك خلال دقائق",
    description:
      "ابحث وقارن واحجز أفضل الصنايعية الموثوقين بسهولة. تقييمات حقيقية، سرعة في الوصول، وخدمة آمنة بالكامل عبر منصة صنايعي.",
    url: "https://sanayie.com",
    siteName: "صنايعي",
    locale: "ar_EG",
    type: "website",

    images: [
      {
        url: "https://sanayie.com/og.jpg",
        width: 1200,
        height: 630,
        alt: "منصة صنايعي - Sanayie Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Sanayie | منصة صنايعي",
    description:
      "أفضل منصة للعثور على الحرفيين والصنايعية بسهولة وأمان.",
    images: ["https://sanayie.com/og.jpg"],
  },

  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icon.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar">
      <body className={`${cairo.className} antialiased`}>
        <NavWrapper />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

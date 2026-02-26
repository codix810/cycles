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

const SITE_URL = "https://sanayie.vercel.app"; // ← غيره بدومينك الحقيقي

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "صنايعي | ابحث عن أفضل الحرفيين في منطقتك",
    template: "%s | صنايعي",
  },

  description:
    "صنايعي منصة ذكية تربطك بأفضل الصنايعية والحرفيين الموثقين بالقرب منك. احجز سباك، كهربائي، نجار، نقاش والمزيد بسهولة وأمان.",

  keywords: [
    "صنايعي",
    "حجز صنايعي",
    "سباك",
    "كهربائي",
    "نجار",
    "خدمات منزلية",
    "craftsmen",
    "handyman egypt",
    "home services egypt",
  ],

  openGraph: {
    title: "صنايعي | أفضل منصة للحرفيين في مصر",
    description:
      "ابحث واحجز أفضل الصنايعية الموثقين في منطقتك خلال دقائق عبر منصة صنايعي.",
    url: SITE_URL,
    siteName: "صنايعي",
    locale: "ar_EG",
    type: "website",

    images: [
      {
        url: `${SITE_URL}/icon.png`, // لازم absolute
        width: 1200,
        height: 630,
        alt: "منصة صنايعي",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "صنايعي | Sanayie",
    description: "منصة حجز الصنايعية والحرفيين في مصر.",
    images: [`${SITE_URL}/icon.png`],
  },

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" >
      <body className={`${cairo.className} antialiased`}>
        <NavWrapper />
        <main>{children}</main>
        <Footer />

        {/* ⭐ Structured Data (Google Rich Result) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "صنايعي",
              url: SITE_URL,
              description:
                "منصة تربطك بأفضل الصنايعية والحرفيين في مصر بسهولة وأمان.",
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/craftsmen?search={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
// import font
import {Cairo } from "next/font/google";
import "./globals.css";
import NavWrapper from "@/components/NavWrapper";
import Footer from "@/components/layout/Footer";

//font same as figma 
const cairo = Cairo ({
  subsets: ["arabic","latin"],
  weight: ["400", "500", "700"],
});


export const metadata: Metadata = {
  title: "Houda",
  description: "Craftsmen Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" >
      <body className={`${cairo.className}  antialiased`}>
        <NavWrapper />
        <div className="">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

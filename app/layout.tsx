import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ope Rowland — Ministry, Intimacy & Purpose",
  description:
    "Discover transformative insights on spiritual growth, intimacy with God, ministry and living out your calling through the books, talks and teachings of Ope Rowland.",
  keywords: [
    "Ope Rowland",
    "Christian books",
    "Christian ministry",
    "MIV Word House",
    "Men of Issachar Vision",
    "spiritual growth",
    "intimacy with God",
    "Christian teachings",
  ],
  openGraph: {
    title: "Ope Rowland — Find. Groom. Operate.",
    description:
      "Helping believers find, groom and operate in their ministries.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable} noise`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
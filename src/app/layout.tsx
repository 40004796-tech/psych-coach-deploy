import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import StickyCTA from "@/components/StickyCTA";
// import { SessionProvider } from "next-auth/react";

const brandSans = Plus_Jakarta_Sans({
  variable: "--font-brand-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "心青心理教练 | 温馨·青春·正能量",
  description: "连接专业心理教练，陪你走向更好的自己。",
  applicationName: "心青心理教练",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "心青心理教练 | 温馨·青春·正能量",
    description: "连接专业心理教练，陪你走向更好的自己。",
    url: "/",
    siteName: "心青心理教练",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "心青心理教练",
    description: "温馨、青春、正能量的心理成长伙伴。",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#ff8ba7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${brandSans.variable} font-sans antialiased`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-foreground focus:text-background focus:px-3 focus:py-2">跳到主要内容</a>
        <Navbar />
        {children}
        <StickyCTA />
      </body>
    </html>
  );
}

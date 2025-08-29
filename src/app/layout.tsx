import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OptiMind AI Ecosystem - Intelligent AI Platform",
  description: "A comprehensive artificial intelligence platform designed to revolutionize how businesses and individuals interact with advanced AI technologies.",
  keywords: ["OptiMind", "AI", "Artificial Intelligence", "Machine Learning", "Automation", "Analytics", "Next.js", "TypeScript", "Tailwind CSS"],
  authors: [{ name: "OptiMind AI Team" }],
  openGraph: {
    title: "OptiMind AI Ecosystem",
    description: "Comprehensive AI platform for intelligent automation and analytics",
    url: "https://optimind.ai",
    siteName: "OptiMind AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OptiMind AI Ecosystem",
    description: "Comprehensive AI platform for intelligent automation and analytics",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Private Photo Guardian",
  description: "Secure photo scanning and organization with AI-powered content detection",
  keywords: ["photo scanning", "AI content detection", "privacy", "security", "Next.js"],
  authors: [{ name: "Photo Guardian Team" }],
  openGraph: {
    title: "Private Photo Guardian",
    description: "Secure photo scanning and organization with AI-powered content detection",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Private Photo Guardian",
    description: "Secure photo scanning and organization with AI-powered content detection",
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
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

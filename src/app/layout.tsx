import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ProspectOS — The Smart Outreach Platform",
  description: "Find leads, verify emails, personalize outreach, automate follow-ups, and manage your complete sales pipeline from one beautiful workspace.",
  keywords: ["sales", "outreach", "lead generation", "email outreach", "CRM", "cold email", "B2B SaaS"],
  authors: [{ name: "ProspectOS Team" }],
  openGraph: {
    title: "ProspectOS — The Smart Outreach Platform",
    description: "The AI operating system for winning more clients. Find, enrich, and convert leads in one unified dashboard.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

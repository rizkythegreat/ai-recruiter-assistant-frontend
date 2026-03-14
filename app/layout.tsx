import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import AppsProvider from "./context/AppsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RecruitAI - AI-Powered Recruitment Assistant",
  description: "Efficiently rank and analyze candidates with AI.",
  icons: {
    icon: "/logo-cv-assistants.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="cupcake">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppsProvider>
          <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6 lg:p-12 bg-base-100">
            <div className="max-w-6xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
        </AppsProvider>
      </body>
    </html>
  );
}

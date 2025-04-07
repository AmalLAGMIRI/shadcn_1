"use client";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator"
import { useState } from "react";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = useState(false);
  return (
    <html lang="en">
      <body
        className={`${theme ? "bg-white text-black" : "bg-black text-white"}
               text-white flex flex-col min-h-screen w-full justify-center items-center `}>
        <Header theme={theme} setTheme={setTheme} />
        <Separator className="bg-gray-400/80" />
        <div className="flex flex-col justify-center items-center w-[90%] border-[0.5] border-white/50 min-h-screen">
        {children}
        </div>
        <Separator className="bg-gray-400/80" />
        <Footer />
      </body>
    </html>
  );
}

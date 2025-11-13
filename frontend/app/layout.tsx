"use client";

import { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";
import { AppNavbar } from "@/components/layout/AppNavbar";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href={"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect width='16' height='16' fill='%2300e5c3'/%3E%3C/svg%3E"}
        />
      </head>
      <body className="min-h-screen bg-[radial-gradient(circle_at_top,_#0a1f1a,_#040d11_60%)] text-white">
        <Providers>
          <div className="relative min-h-screen overflow-hidden">
            <span className="noise-overlay" />
            <AppNavbar />
            <main className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-20 pt-12">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}


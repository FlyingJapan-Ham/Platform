import type { ReactNode } from "react";

import "./globals.css";
import { MainNav } from "../components/site/MainNav";
import { SiteFooter } from "../components/site/SiteFooter";

export const metadata = {
  title: "Flying Japan Rentals",
  description:
    "USJ Power-Up Band, Harry Potter Wand, Dyson/ReFa 헤어 기기 렌탈 플랫폼",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="light-theme">
        <div className="min-h-screen flex flex-col">
          <MainNav />
          <main className="flex-1 bg-transparent">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}

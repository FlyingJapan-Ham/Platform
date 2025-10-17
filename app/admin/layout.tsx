import type { ReactNode } from "react";
import Link from "next/link";

import { AdminSidebar } from "../../components/admin/AdminSidebar";

export const metadata = {
  title: "Flying Japan Admin",
  description: "재고 및 수익 관리 백오피스",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-sky-50 text-slate-900">
      <AdminSidebar />
      <div className="flex w-full flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white/85 px-6 py-4 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Flying Japan Admin
            </p>
            <p className="text-base text-slate-600">
              재고와 수익 지표를 한곳에서 관리하세요.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-blue-300 hover:text-blue-500"
          >
            스토어로 이동
          </Link>
        </header>
        <main className="flex-1 bg-slate-50 px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}

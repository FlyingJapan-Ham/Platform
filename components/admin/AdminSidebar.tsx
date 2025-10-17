"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminNav = [
  { label: "대시보드", href: "/admin" },
  { label: "재고 관리", href: "/admin/inventory" },
  { label: "주문 관리", href: "/admin/orders" },
  { label: "수익 리포트", href: "/admin/reports" },
  { label: "리뷰 관리", href: "/admin/reviews" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-60 flex-col border-r border-slate-200 bg-white/90 p-6 shadow md:flex">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Admin
        </p>
        <p className="mt-2 text-lg font-bold text-slate-900">Flying Japan</p>
      </div>
      <nav className="flex flex-col gap-2">
        {adminNav.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-xl px-4 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-600",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

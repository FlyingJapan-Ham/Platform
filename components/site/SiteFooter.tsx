import type { Route } from "next";
import Link from "next/link";

type FooterLinkItem =
  | { label: string; href: Route }
  | { label: string; href: { pathname: Route; hash?: string } };

const footerLinks: Array<{
  title: string;
  items: FooterLinkItem[];
}> = [
  {
    title: "Flying Japan",
    items: [
      { label: "회사 소개", href: "/about" },
      { label: "파트너십", href: "/partnership" },
      { label: "채용", href: "/careers" },
    ],
  },
  {
    title: "고객 지원",
    items: [
      { label: "USJ 가이드", href: "/support/usj-guide" },
      { label: "파손 신고", href: "/damage-report" },
      { label: "FAQ", href: { pathname: "/support", hash: "faq" } },
    ],
  },
  {
    title: "정책",
    items: [
      { label: "이용 약관", href: "/terms" },
      { label: "개인정보 처리방침", href: "/privacy" },
      { label: "연체 요금 정책", href: "/late-policy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-gradient-to-r from-indigo-50 via-white to-sky-50 py-12">
      <div className="container grid gap-8 md:grid-cols-[2fr,3fr]">
        <div className="space-y-3">
          <p className="text-lg font-semibold text-slate-900">
            Flying Japan Rentals
          </p>
          <p className="text-sm text-slate-600">
            오사카 USJ 테마파크 아이템과 프리미엄 뷰티 디바이스를 합리적으로
            렌탈하세요. 3일 기본 요금, 연체 자동 계산, 반납 리마인더까지 한 번에.
          </p>
          <p className="text-xs text-slate-500">
            ⓒ {new Date().getFullYear()} Flying Japan. All rights reserved.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                {group.title}
              </p>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <li
                    key={
                      typeof item.href === "string"
                        ? item.href
                        : `${item.href.pathname}#${item.href.hash ?? ""}`
                    }
                  >
                    <Link
                      className="text-sm text-slate-500 transition hover:text-blue-500"
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

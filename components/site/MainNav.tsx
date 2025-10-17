"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

const primaryNav: NavItem[] = [
  { label: "홈", href: "/" },
  { label: "USJ 렌탈", href: "/usj" },
  { label: "뷰티 디바이스", href: "/beauty" },
  { label: "바로 예약", href: "/book-now" },
  { label: "예약 조회", href: "/lookup" },
  { label: "고객센터", href: "/support" },
  { label: "USJ 팁", href: "/usj-tips" },
  {
    label: "플라잉패스",
    href: "https://cafe.naver.com/d2d2d2",
    external: true,
  },
];

export function MainNav() {
  const [openMenu, setOpenMenu] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const router = useRouter();

  const handleNavigate = () => {
    setOpenMenu(false);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchKeyword.trim();
    if (trimmed.length === 0) {
      return;
    }

    router.push(`/book-now?search=${encodeURIComponent(trimmed)}`);
    setOpenMenu(false);
  };

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded border border-slate-300 text-slate-500 hover:border-blue-300 hover:text-blue-500"
            onClick={() => setOpenMenu((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <span className="sr-only">Toggle menu</span>
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <path d="M2 4h14M2 9h14M2 14h14" />
            </svg>
          </button>
          <Link
            className="text-lg font-semibold tracking-wide uppercase text-slate-800"
            href="/"
            onClick={handleNavigate}
          >
            Flying Japan
          </Link>
        </div>

        <nav
          className={[
            "flex-1 md:flex items-center justify-between gap-6",
            openMenu ? "block" : "hidden md:flex",
          ].join(" ")}
        >
          <ul className="mt-4 flex flex-col gap-2 md:mt-0 md:flex-row md:items-center md:gap-4">
            {primaryNav.map((item) => (
              <li key={item.href}>
                {item.external ? (
                  <a
                    className="text-sm font-medium text-slate-600 transition hover:text-blue-500"
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleNavigate}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    className="text-sm font-medium text-slate-600 transition hover:text-blue-500"
                    href={item.href}
                    onClick={handleNavigate}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-col gap-3 md:mt-0 md:flex-row md:items-center md:gap-4">
            <form className="relative" onSubmit={handleSearch}>
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden
              >
                <circle cx="7" cy="7" r="5" />
                <path d="m11 11 4 4" />
              </svg>
              <input
                type="search"
                placeholder="Dyson 에어랩 검색"
                className="h-10 w-full rounded border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
              />
            </form>

            <div className="flex items-center gap-3 md:gap-4">
              <Link
                href="/cart"
                className="inline-flex h-10 items-center justify-center gap-2 rounded border border-slate-300 px-4 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-500"
                onClick={handleNavigate}
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden
                >
                  <path d="M3 3h2l.4 2M7 9h6l2-5H5.4" />
                  <circle cx="7" cy="15" r="1" />
                  <circle cx="13" cy="15" r="1" />
                </svg>
                장바구니
              </Link>
              <Link
                href="/account"
                className="inline-flex h-10 items-center justify-center rounded bg-blue-500 px-4 text-sm font-semibold text-white shadow hover:bg-blue-400"
                onClick={handleNavigate}
              >
                계정
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";

import { homeCategories } from "../../data/home";

export function CategoryHighlights() {
  return (
    <section className="border-b border-slate-200 bg-white py-16">
      <div className="container space-y-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
              인기 렌탈 카테고리
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              지금 가장 많이 예약되는 상품을 빠르게 확인하세요.
            </p>
          </div>
          <Link
            href="/book-now"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-blue-300 hover:text-blue-500"
          >
            전체 상품 보기
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {homeCategories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-500">
                  {category.badge}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-600">
                  {category.priceLabel}
                </span>
              </div>
              <div className="mt-5 h-40 rounded-2xl border border-slate-200 bg-slate-100">
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                  이미지 플레이스홀더
                </div>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">
                {category.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {category.description}
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-500">
                예약하기
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="transition group-hover:translate-x-1"
                  aria-hidden
                >
                  <path d="m6 4 4 4-4 4" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

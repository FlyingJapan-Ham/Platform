import Link from "next/link";

import { usjTips } from "../../data/usjTips";

export default function UsjTipsPage() {
  return (
    <div className="border-b border-slate-800 bg-slate-950 py-16">
      <div className="container space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            USJ Tips & Guide
          </h1>
          <p className="text-sm text-slate-300">
            파워업 밴드, 마법 지팡이, 파크 동선을 효율적으로 즐기는 노하우를
            모았습니다.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {usjTips.map((post) => (
            <Link
              key={post.slug}
              href={`/usj-tips/${post.slug}`}
              className="group rounded-3xl border border-slate-800 bg-slate-900/60 p-6 transition hover:-translate-y-1 hover:border-blue-500/40 hover:bg-slate-900/80"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">
                {post.readingTime}
              </p>
              <h2 className="mt-3 text-lg font-semibold text-white">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-slate-300">{post.summary}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-300">
                자세히 보기
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
              </span>
            </Link>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
          <h2 className="text-lg font-semibold text-blue-200">
            파크 일정표 다운로드
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            시즌별 추천 루트와 대기시간 가이드를 확인하고 싶다면 아래 링크를
            확인하세요.
          </p>
          <Link
            href="/usj-tips/seasonal-itinerary-download"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-300"
          >
            일정표 받기
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="transition hover:translate-x-1"
              aria-hidden
            >
              <path d="m6 4 4 4-4 4" />
            </svg>
          </Link>
        </section>
      </div>
    </div>
  );
}

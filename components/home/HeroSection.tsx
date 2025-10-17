import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-sky-100 via-white to-indigo-100 py-20">
      <div className="container flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full max-w-2xl space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-500">
              일본 한정 렌탈샵
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Flying Japan
              <span className="text-blue-500"> 렌탈 스토어</span>
            </h1>
            <p className="text-base text-slate-600">
              USJ 파크 굿즈와 프리미엄 뷰티 디바이스를 원하는 날짜에 간단히
              픽업하세요. 3일 기본 요금, 실시간 재고, 연체 알림까지 모두 자동.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:items-stretch lg:justify-start">
              <Link
                href="/book-now"
                className="inline-flex items-center justify-center rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-400"
              >
                예약 바로 진행
              </Link>
              <Link
                href="/usj"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-500"
              >
                USJ 상품 둘러보기
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full max-w-lg">
          <div className="rounded-3xl border border-blue-200 bg-white/90 p-8 shadow-2xl shadow-blue-200/50">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
              예약 하이라이트
            </p>
            <ul className="mt-6 space-y-5">
              {[
                {
                  title: "3일 13,000원",
                  subtitle: "USJ Power-Up Band",
                },
                {
                  title: "100V 호환",
                  subtitle: "Dyson · ReFa 헤어 디바이스",
                },
                {
                  title: "자동 알림",
                  subtitle: "D+1 연체 SMS · 파손 신고",
                },
              ].map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-blue-100 bg-white px-5 py-4 shadow-sm"
                >
                  <p className="text-base font-semibold text-slate-900">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.subtitle}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

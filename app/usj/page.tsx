import Link from "next/link";

import { usjProducts } from "../../data/catalog";

export default function UsjPage() {
  return (
    <div className="space-y-16 py-16">
      <section className="border-b border-slate-800 bg-slate-950">
        <div className="container grid gap-10 py-12 md:grid-cols-[1.1fr,0.9fr] md:items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center rounded-full bg-blue-500/15 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-200">
              USJ 전용 렌탈존
            </span>
            <h1 className="text-3xl font-bold text-white md:text-4xl">
              파크 안에서도, 밖에서도 완벽한 USJ 여행
            </h1>
            <p className="text-sm text-slate-300">
              인터랙티브 지팡이부터 파워업 밴드, 번들 구성까지. Flying Japan 난바
              여행자센터에서 픽업하고 바로 USJ로 이동하세요.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book-now"
                className="inline-flex items-center justify-center rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-400"
              >
                예약 바로 진행
              </Link>
              <Link
                href="#usj-products"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 hover:border-slate-500"
              >
                인기 상품 보기
              </Link>
            </div>
            <ul className="grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
              <li>• 난바 여행자센터 픽업 09:00 ~ 20:00</li>
              <li>• 파크 내 사용법 가이드 QR 제공</li>
              <li>• 연장/반납 문자 알림</li>
              <li>• 번들 예약 시 10% 할인</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
            <p className="text-sm font-semibold text-blue-200">
              난바 여행자센터 안내
            </p>
            <p className="mt-2 text-xs text-slate-400">
              오사카 OCAT 1층 Flying Japan 여행자센터에서 예약 상품을 픽업하세요.
            </p>
            <div className="mt-6 h-60 rounded-2xl border border-slate-800 bg-slate-900/80">
              <div className="flex h-full items-center justify-center text-xs text-slate-600">
                USJ 지도 플레이스홀더
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-slate-900/80 px-4 py-3 text-xs text-slate-300">
              <p>평균 픽업 소요 시간: 4분</p>
              <p>주문 마감: 이용일 전날 22:00</p>
            </div>
          </div>
        </div>
      </section>

      <section id="usj-products" className="container space-y-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              USJ 인기 렌탈 상품
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              파크 경험을 극대화하는 필수 아이템을 미리 예약하세요.
            </p>
          </div>
          <Link
            href="/usj-bundle"
            className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:border-blue-400 hover:text-white"
          >
            번들 프로모션 보기
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {usjProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group flex h-full flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/60 p-6 transition hover:-translate-y-1 hover:border-blue-500/40 hover:bg-slate-900/80"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {product.badges.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full bg-blue-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-200"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                <div className="h-40 rounded-2xl border border-slate-800 bg-slate-900/60">
                  <div className="flex h-full items-center justify-center text-xs text-slate-600">
                    제품 이미지
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {product.name}
                </h3>
                <p className="text-sm text-slate-400">{product.description}</p>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm text-blue-200">
                  <span>{product.price}</span>
                  <span>{product.availability}</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {product.bullets.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-center gap-2 rounded-full bg-slate-800/60 px-3 py-2"
                    >
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-400" />
                      {item.label}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between text-sm font-medium text-blue-300">
                  <span>{product.lateFee}</span>
                  <span className="inline-flex items-center gap-2">
                    상세 보기
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
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-800 bg-slate-950">
        <div className="container grid gap-8 py-12 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">
              USJ 방문 전 꼭 확인하세요
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>• 이용일 전날 22시까지 무료 취소 가능</li>
              <li>• 파손 시 즉시 앱에서 신고 후 안내받기</li>
              <li>• 파워업 밴드는 Nintendo 계정과 연동 필요</li>
              <li>• 지팡이는 반납 후 재살균 처리 진행</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-sm font-semibold text-blue-200">
              자주 묻는 질문
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>Q. 현장에서 연장할 수 있나요? — 앱에서 바로 연장 신청이 가능해요.</li>
              <li>
                Q. 보증금이 있나요? — 별도 보증금 없이 카드로 간편 결제됩니다.
              </li>
              <li>
                Q. 픽업 시 신분증이 필요하나요? — 예약자 여권 or 운전면허증을
                지참해주세요.
              </li>
            </ul>
            <Link
              href="/support/usj-guide"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-300"
            >
              USJ 이용 가이드 보기
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
          </div>
        </div>
      </section>
    </div>
  );
}

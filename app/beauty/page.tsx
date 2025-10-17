import Link from "next/link";

import { beautyProducts } from "../../data/catalog";

export default function BeautyPage() {
  return (
    <div className="space-y-16 py-16">
      <section className="border-b border-slate-800 bg-slate-950">
        <div className="container grid gap-10 py-12 md:grid-cols-[1.1fr,0.9fr] md:items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center rounded-full bg-purple-500/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-purple-200">
              Beauty & Hair Tools
            </span>
            <h1 className="text-3xl font-bold text-white md:text-4xl">
              여행 중에도 살롱 퀄리티 스타일링
            </h1>
            <p className="text-sm text-slate-300">
              Dyson, ReFa, Trike 등 프리미엄 디바이스를 일본 전압에 맞춰 안전하게
              렌탈하세요. 모든 상품은 Flying Japan 난바 여행자센터에서 픽업합니다.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book-now"
                className="inline-flex items-center justify-center rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-400"
              >
                재고 확인 후 예약
              </Link>
              <Link
                href="#beauty-products"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 hover:border-slate-500"
              >
                제품 비교 보기
              </Link>
            </div>
            <ul className="grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
              <li>• 100V 전압 호환 기기 전용</li>
              <li>• 살균 후 개별 패키징</li>
              <li>• 난바 센터 현장 픽업</li>
              <li>• 브러시/노즐 전부 포함</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
            <p className="text-sm font-semibold text-purple-200">
              스타일링 팁 카드
            </p>
            <p className="mt-2 text-xs text-slate-400">
              헤어 타입별 추천 온도, 브러시 조합을 예약 완료 시 카드로 보내드려요.
            </p>
            <div className="mt-6 h-60 rounded-2xl border border-slate-800 bg-slate-900/80">
              <div className="flex h-full items-center justify-center text-xs text-slate-600">
                뷰티 무드 이미지
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-slate-900/80 px-4 py-3 text-xs text-slate-300">
              <p>여행자센터 운영: 09:00 ~ 20:00</p>
              <p>픽업 위치: 난바 OCAT 1층 Flying Japan</p>
            </div>
          </div>
        </div>
      </section>

      <section id="beauty-products" className="container space-y-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              프리미엄 뷰티 기기 베스트
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              전압 호환과 클리닝 상태까지 검증된 디바이스만 추천합니다.
            </p>
          </div>
          <Link
            href="/support"
            className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:border-blue-400 hover:text-white"
          >
            사용 가이드 문의
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {beautyProducts.map((product) => (
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
                      className="rounded-full bg-purple-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-purple-200"
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
        <div className="container grid gap-8 py-12 md:grid-cols-[1.2fr,0.8fr] md:items-center">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">
              비교표로 한눈에 확인
            </h3>
            <div className="overflow-hidden rounded-3xl border border-slate-800">
              <table className="w-full border-separate border-spacing-0 text-sm text-slate-300">
                <thead className="bg-slate-900/80 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-4 py-3 text-left">제품명</th>
                    <th className="px-4 py-3 text-left">무게</th>
                    <th className="px-4 py-3 text-left">전압</th>
                    <th className="px-4 py-3 text-left">특징</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-800">
                    <td className="px-4 py-3">Dyson Airwrap</td>
                    <td className="px-4 py-3">≈ 600g</td>
                    <td className="px-4 py-3">100V 전용</td>
                    <td className="px-4 py-3">멀티 스타일링, 브러시 6종</td>
                  </tr>
                  <tr className="border-t border-slate-800">
                    <td className="px-4 py-3">ReFa 스트레이트 아이론</td>
                    <td className="px-4 py-3">≈ 295g</td>
                    <td className="px-4 py-3">100V 전용</td>
                    <td className="px-4 py-3">휴대용, 열 보호 매트 포함</td>
                  </tr>
                  <tr className="border-t border-slate-800">
                    <td className="px-4 py-3">Trike Hair Dryer</td>
                    <td className="px-4 py-3">≈ 450g</td>
                    <td className="px-4 py-3">100V 전용</td>
                    <td className="px-4 py-3">고속 건조, 노즐 3종 포함</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
            <p className="text-sm font-semibold text-blue-200">
              예약 TIP
            </p>
            <ul className="mt-3 space-y-2">
              <li>• 아침 스타일링용이면 Dyson, 야간 촬영이면 ReFa 추천</li>
              <li>• 3일 이상 예약 시 무료 어댑터 제공</li>
              <li>• 픽업 전날 문자로 준비 완료 알림 발송</li>
            </ul>
            <Link
              href="/support"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-300"
            >
              상담원과 채팅하기
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

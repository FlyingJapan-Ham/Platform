import Link from "next/link";

import { CategoryHighlights } from "../components/home/CategoryHighlights";
import { HeroSection } from "../components/home/HeroSection";
import { FeaturedProducts } from "../components/home/FeaturedProducts";
import { InventorySummary } from "../components/home/InventorySummary";
import { PriceCalculatorPreview } from "../components/home/PriceCalculatorPreview";
import { ReviewCarousel } from "../components/home/ReviewCarousel";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryHighlights />
      <FeaturedProducts />
      <PriceCalculatorPreview />
      <InventorySummary />
      <ReviewCarousel />
      <section className="border-b border-slate-200 bg-white py-16">
        <div className="container space-y-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
                지금 바로 경험해보세요
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                상품 선택부터 반납까지 3단계면 충분합니다.
              </p>
            </div>
            <Link
              href="/book-now"
              className="inline-flex items-center justify-center rounded-full bg-blue-500 px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-blue-400"
            >
              예약 시작
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "01. 상품 선택",
                text: "USJ / 뷰티 카테고리에서 원하는 아이템을 선택하세요.",
              },
              {
                title: "02. 가격 확인",
                text: "날짜와 수량을 입력하면 총액이 바로 계산됩니다.",
              },
              {
                title: "03. 픽업 & 반납",
                text: "Flying Japan 난바 여행자센터에서 픽업·반납하고 USJ로 이동!",
              },
            ].map((step) => (
              <div
                key={step.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm"
              >
                <p className="text-sm font-semibold text-blue-500">
                  {step.title}
                </p>
                <p className="mt-2 text-sm text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

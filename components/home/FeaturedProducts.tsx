import Link from "next/link";

import { featuredProducts } from "../../data/home";

export function FeaturedProducts() {
  return (
    <section className="border-b border-slate-200 bg-white py-16">
      <div className="container space-y-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
              지금 예약되는 상품
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              재고 확인 후 바로 장바구니에 담아보세요.
            </p>
          </div>
          <Link
            href="/book-now"
            className="inline-flex items-center justify-center rounded-full bg-blue-500 px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-blue-400"
          >
            예약 진행
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-500">
                    {product.badge}
                  </span>
                  <span className="text-xs text-slate-500">실시간 재고</span>
                </div>
                <div className="h-36 rounded-2xl border border-slate-200 bg-slate-100">
                  <div className="flex h-full items-center justify-center text-xs text-slate-500">
                    제품 이미지
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {product.name}
                </h3>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-semibold text-blue-500">
                  {product.price}
                </span>
                <span className="inline-flex items-center gap-2 text-sm text-blue-500">
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

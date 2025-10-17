import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getProductBySlug,
  usjProducts,
  beautyProducts,
} from "../../../data/catalog";
import { getReviewsByProductSlug } from "../../../data/reviews";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  const allProducts = [...usjProducts, ...beautyProducts];
  return allProducts.map((product) => ({
    slug: product.slug,
  }));
}

function formatReviewDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString("ko-KR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function renderStars(rating: number) {
  return "★".repeat(rating).padEnd(5, "☆");
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const reviews = getReviewsByProductSlug(product.slug);
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length
      : null;

  return (
    <div className="section-light py-16">
      <div className="container grid gap-10 md:grid-cols-[1.1fr,0.9fr] md:items-start">
        <section className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            {product.badges.map((badge) => (
              <span key={badge} className="tag-light">
                {badge}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            {product.name}
          </h1>
          <p className="text-sm text-slate-600">{product.description}</p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="card-light text-sm text-slate-600">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                기본 요금
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {product.price}
              </p>
              <p className="mt-2 text-xs text-slate-500">{product.lateFee}</p>
            </div>
            <div className="card-light text-sm text-slate-600">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                실시간 재고
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {product.availability}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              포함 혜택
            </h2>
            <ul className="space-y-2 text-sm text-slate-600">
              {product.bullets.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs text-slate-600"
                >
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-400" />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {reviews.length > 0 ? (
            <div className="card-light space-y-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    이용자 후기
                  </h2>
                  <p className="text-xs text-slate-500">
                    실제 렌탈 고객의 경험을 확인해 보세요.
                  </p>
                </div>
                {averageRating ? (
                  <p className="text-sm font-semibold text-blue-600">
                    평균 {averageRating.toFixed(1)}점 · 후기 {reviews.length}개
                  </p>
                ) : null}
              </div>
              <ul className="space-y-4">
                {reviews.map((review) => (
                  <li
                    key={review.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900">
                        {review.author}
                      </p>
                      <span className="text-xs text-slate-500">
                        {formatReviewDate(review.createdAt)}
                      </span>
                      <span className="text-xs text-amber-500">
                        {renderStars(review.rating)}
                      </span>
                      {review.tripType ? (
                        <span className="text-xs text-slate-400">
                          · {review.tripType}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 text-sm text-slate-600">
                      {review.content}
                    </p>
                    {review.response ? (
                      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-slate-600">
                        <p className="font-semibold text-blue-600">
                          {review.response.author}
                        </p>
                        <p className="mt-1 text-slate-500">
                          {formatReviewDate(review.response.createdAt)}
                        </p>
                        <p className="mt-2 leading-relaxed text-slate-600">
                          {review.response.content}
                        </p>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <Link
            href="/book-now"
            className="inline-flex items-center justify-center rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-400"
          >
            예약 일정 선택하기
          </Link>
        </section>

        <aside className="space-y-6">
          <div className="h-60 rounded-3xl border border-slate-200 bg-slate-100">
            <div className="flex h-full items-center justify-center text-xs text-slate-500">
              제품 이미지
            </div>
          </div>
          <div className="card-light text-sm text-slate-600">
            <p className="text-sm font-semibold text-blue-600">이용 안내</p>
            <ul className="mt-3 space-y-2 text-xs text-slate-500">
              <li>• 예약자 본인 확인 후 픽업 가능</li>
              <li>• 반납 시 상태 확인 후 문자 안내</li>
              <li>• 파손 시 교환/복구 옵션 선택 가능</li>
            </ul>
          </div>
          <div className="card-light text-sm text-slate-600">
            <p className="text-sm font-semibold text-blue-600">
              함께 보면 좋은 제품
            </p>
            <ul className="mt-3 space-y-2 text-xs text-blue-600">
              <li>
                <Link href="/products/mario-power-up-band">
                  Mario Power-Up Band →
                </Link>
              </li>
              <li>
                <Link href="/products/usj-bundle-set">
                  USJ 번들 세트 →
                </Link>
              </li>
              <li>
                <Link href="/beauty">Beauty & Hair Tools 보기 →</Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

"use client";

import { FormEvent, useMemo, useState } from "react";

import {
  getProductName,
  getAllReviews,
  type ProductReview,
  type ReviewStatus,
} from "../../../data/reviews";

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

const statusOptions: Array<{ label: string; value: ReviewStatus | "ALL" }> = [
  { label: "전체", value: "ALL" },
  { label: "노출중", value: "PUBLISHED" },
  { label: "숨김", value: "HIDDEN" },
  { label: "검수 대기", value: "PENDING" },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ProductReview[]>(getAllReviews());
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | "ALL">("ALL");
  const [productFilter, setProductFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeModal, setActiveModal] = useState<{
    type: "respond" | "status";
    review: ProductReview;
  } | null>(null);
  const [responseContent, setResponseContent] = useState("");
  const [nextStatus, setNextStatus] = useState<ReviewStatus>("PUBLISHED");

  const productOptions = useMemo(() => {
    const unique = Array.from(
      new Set(reviews.map((review) => review.productSlug)),
    );
    return unique.map((slug) => ({
      slug,
      label: getProductName(slug),
    }));
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchStatus =
        statusFilter === "ALL" || review.status === statusFilter;
      const matchProduct =
        productFilter === "ALL" || review.productSlug === productFilter;
      const lowerSearch = searchTerm.trim().toLowerCase();
      const matchSearch =
        lowerSearch.length === 0 ||
        review.author.toLowerCase().includes(lowerSearch) ||
        review.content.toLowerCase().includes(lowerSearch) ||
        review.orderId?.toLowerCase().includes(lowerSearch) ||
        getProductName(review.productSlug)
          .toLowerCase()
          .includes(lowerSearch);
      return matchStatus && matchProduct && matchSearch;
    });
  }, [reviews, statusFilter, productFilter, searchTerm]);

  const summary = useMemo(() => {
    const published = reviews.filter((review) => review.status === "PUBLISHED");
    const pending = reviews.filter((review) => review.status === "PENDING");
    const hidden = reviews.filter((review) => review.status === "HIDDEN");
    const average =
      published.length > 0
        ? published.reduce((sum, review) => sum + review.rating, 0) /
          published.length
        : 0;
    return {
      total: reviews.length,
      average,
      published: published.length,
      pending: pending.length,
      hidden: hidden.length,
    };
  }, [reviews]);

  const openResponseModal = (review: ProductReview) => {
    setActiveModal({ type: "respond", review });
    setResponseContent(review.response?.content ?? "");
  };

  const openStatusModal = (review: ProductReview, status: ReviewStatus) => {
    setActiveModal({ type: "status", review });
    setNextStatus(status);
  };

  const closeModal = () => {
    setActiveModal(null);
    setResponseContent("");
  };

  const handleResponseSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeModal || activeModal.type !== "respond") {
      return;
    }
    const trimmed = responseContent.trim();
    setReviews((prev) =>
      prev.map((review) =>
        review.id === activeModal.review.id
          ? {
              ...review,
              response:
                trimmed.length > 0
                  ? {
                      author: "Flying Japan CS",
                      content: trimmed,
                      createdAt: new Date().toISOString(),
                    }
                  : undefined,
              status:
                review.status === "PENDING" && trimmed.length > 0
                  ? "PUBLISHED"
                  : review.status,
            }
          : review,
      ),
    );
    closeModal();
  };

  const handleStatusSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeModal || activeModal.type !== "status") {
      return;
    }
    setReviews((prev) =>
      prev.map((review) =>
        review.id === activeModal.review.id
          ? {
              ...review,
              status: nextStatus,
            }
          : review,
      ),
    );
    closeModal();
  };

  return (
    <>
      <div className="space-y-8">
        <section className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              리뷰 관리
            </h1>
            <p className="text-sm text-slate-600">
              고객 후기 상태를 업데이트하고 답변을 남길 수 있습니다.
            </p>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "전체 리뷰",
              value: `${summary.total.toLocaleString("ko-KR")}건`,
            },
            {
              title: "평균 평점",
              value: `${summary.average.toFixed(1)}점`,
            },
            {
              title: "노출중",
              value: `${summary.published.toLocaleString("ko-KR")}건`,
            },
            {
              title: "검수 대기",
              value: `${summary.pending.toLocaleString("ko-KR")}건`,
            },
          ].map((card) => (
            <div key={card.title} className="card-light text-sm text-slate-600">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                {card.title}
              </p>
              <p className="mt-3 text-2xl font-bold text-slate-900">
                {card.value}
              </p>
            </div>
          ))}
        </section>

        <section className="card-light space-y-4 text-sm text-slate-600">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-xs text-slate-500">
                상태
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value as ReviewStatus | "ALL",
                    )
                  }
                  className="ml-2 rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-300 focus:outline-none"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-slate-500">
                상품
                <select
                  value={productFilter}
                  onChange={(event) => setProductFilter(event.target.value)}
                  className="ml-2 rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-300 focus:outline-none"
                >
                  <option value="ALL">전체 상품</option>
                  {productOptions.map((option) => (
                    <option key={option.slug} value={option.slug}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <input
              type="search"
              placeholder="고객 / 내용 / 주문번호 검색"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none md:w-72"
            />
          </div>

          <div className="overflow-auto">
            <table className="min-w-full border-collapse text-sm text-slate-600">
              <thead className="bg-slate-100 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">고객</th>
                  <th className="px-4 py-3 text-left">상품</th>
                  <th className="px-4 py-3 text-left">평점</th>
                  <th className="px-4 py-3 text-left">내용</th>
                  <th className="px-4 py-3 text-left">작성일</th>
                  <th className="px-4 py-3 text-left">상태</th>
                  <th className="px-4 py-3 text-left">조치</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="border-t border-slate-200">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">
                        {review.author}
                      </p>
                      <p className="text-xs text-slate-500">
                        {review.orderId ?? "주문번호 없음"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {getProductName(review.productSlug)}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {review.rating}점
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {review.content}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {formatReviewDate(review.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span
                        className={[
                          "rounded-full px-3 py-1 font-medium",
                          review.status === "PUBLISHED"
                            ? "bg-blue-100 text-blue-600"
                            : review.status === "PENDING"
                            ? "bg-amber-100 text-amber-600"
                            : "bg-slate-200 text-slate-600",
                        ].join(" ")}
                      >
                        {review.status === "PUBLISHED"
                          ? "노출중"
                          : review.status === "PENDING"
                          ? "검수 대기"
                          : "숨김"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
                          onClick={() => openResponseModal(review)}
                        >
                          답변 작성
                        </button>
                        {review.status !== "PUBLISHED" ? (
                          <button
                            type="button"
                            className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
                            onClick={() =>
                              openStatusModal(review, "PUBLISHED")
                            }
                          >
                            공개
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
                            onClick={() => openStatusModal(review, "HIDDEN")}
                          >
                            숨김
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredReviews.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-slate-500">
                조건에 맞는 리뷰가 없습니다.
              </p>
            ) : null}
          </div>
        </section>
      </div>

      {activeModal?.type === "respond" ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overlay-backdrop backdrop-blur">
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  리뷰 답변
                </h3>
                <p className="text-xs text-slate-500">
                  {getProductName(activeModal.review.productSlug)} ·{" "}
                  {activeModal.review.author}
                </p>
              </div>
              <button
                type="button"
                className="text-slate-500 hover:text-slate-700"
                onClick={closeModal}
                aria-label="답변 모달 닫기"
              >
                ✕
              </button>
            </div>
            <form className="mt-4 space-y-4" onSubmit={handleResponseSubmit}>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">고객 후기</p>
                <p className="mt-2 leading-relaxed">
                  {activeModal.review.content}
                </p>
              </div>
              <label className="space-y-2 text-xs text-slate-500">
                답변 내용
                <textarea
                  className="h-32 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none"
                  value={responseContent}
                  onChange={(event) => setResponseContent(event.target.value)}
                  placeholder="고객에게 전달할 답변을 작성하세요."
                />
              </label>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-400"
                  onClick={closeModal}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-400"
                >
                  답변 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {activeModal?.type === "status" ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overlay-backdrop backdrop-blur">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                리뷰 상태 변경
              </h3>
              <button
                type="button"
                className="text-slate-500 hover:text-slate-700"
                onClick={closeModal}
                aria-label="상태 변경 모달 닫기"
              >
                ✕
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {getProductName(activeModal.review.productSlug)} ·{" "}
              {activeModal.review.author}
            </p>
            <form className="mt-4 space-y-4" onSubmit={handleStatusSubmit}>
              <label className="space-y-2 text-xs text-slate-500">
                상태 선택
                <select
                  value={nextStatus}
                  onChange={(event) =>
                    setNextStatus(event.target.value as ReviewStatus)
                  }
                  className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none"
                >
                  <option value="PUBLISHED">노출중</option>
                  <option value="HIDDEN">숨김</option>
                  <option value="PENDING">검수 대기</option>
                </select>
              </label>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-400"
                  onClick={closeModal}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-400"
                >
                  상태 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

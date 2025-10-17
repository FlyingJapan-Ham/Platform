"use client";

import { useEffect, useState } from "react";

import { customerReviews } from "../../data/home";

export function ReviewCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % customerReviews.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  const activeReview = customerReviews[activeIndex];

  return (
    <section className="border-b border-slate-200 bg-gradient-to-br from-white via-indigo-50 to-sky-100 py-16">
      <div className="container grid gap-8 md:grid-cols-[1fr,1fr] md:items-center">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
            여행자들이 남긴 실사용 후기
          </h2>
          <p className="text-sm text-slate-600">
            예약부터 반납까지의 경험을 실제 이용자 목소리로 확인해보세요.
          </p>
          <div className="flex gap-2">
            {customerReviews.map((review, index) => (
              <button
                key={review.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={[
                  "h-2 w-6 rounded-full transition",
                  index === activeIndex ? "bg-blue-500" : "bg-slate-300",
                ].join(" ")}
                aria-label={`리뷰 ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <article className="rounded-3xl border border-blue-200 bg-white/90 p-8 shadow-xl shadow-blue-100/40">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
            고객 후기
          </p>
          <h3 className="mt-4 text-xl font-semibold text-slate-900">
            {activeReview.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {activeReview.content}
          </p>
          <p className="mt-6 text-xs text-slate-500">{activeReview.author}</p>
        </article>
      </div>
    </section>
  );
}

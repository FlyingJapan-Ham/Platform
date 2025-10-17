"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type LookupResult = {
  code: string;
  status: "픽업 예정" | "픽업 완료" | "반납 중" | "반납 완료";
  timeline: Array<{ label: string; timestamp: string }>;
};

export default function LookupPage() {
  const [orderCode, setOrderCode] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<LookupResult | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!orderCode.trim() || !phone.trim()) {
      return;
    }

    const mockTimeline: LookupResult = {
      code: orderCode.trim(),
      status: "픽업 예정",
        timeline: [
          {
            label: "예약 완료",
            timestamp: "2025-02-10 21:12",
          },
          {
            label: "픽업 일정 안내 발송",
            timestamp: "2025-02-11 09:00",
          },
          {
            label: "픽업 예정",
            timestamp: "2025-02-14 09:30 (난바 여행자센터)",
          },
        ],
      };

    setResult(mockTimeline);
  };

  return (
    <div className="border-b border-slate-800 bg-slate-950 py-16">
      <div className="container grid gap-12 md:grid-cols-[1fr,1fr] md:items-start">
        <section className="space-y-5">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            주문 조회 & 반납 상태 확인
          </h1>
          <p className="text-sm text-slate-300">
            주문 코드와 전화번호를 입력하면 배송, 픽업, 반납 현황과 연체 알림
            내역을 확인할 수 있어요.
          </p>

          <form
            className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6"
            onSubmit={handleSubmit}
          >
            <label className="space-y-2 text-sm text-slate-300">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                주문 코드
              </span>
              <input
                type="text"
                placeholder="예: FJ-20241012-AB12"
                value={orderCode}
                onChange={(event) => setOrderCode(event.target.value)}
                className="h-11 w-full rounded border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
                required
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                연락처 (예약 시 입력한 번호)
              </span>
              <input
                type="tel"
                placeholder="010-0000-0000"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="h-11 w-full rounded border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
                required
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-blue-500 py-3 text-sm font-semibold text-white hover:bg-blue-400"
            >
              주문 찾기
            </button>
            <p className="text-xs text-slate-500">
              주문 내용을 찾을 수 없다면 고객센터로 문의해주세요.
            </p>
          </form>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-sm font-semibold text-blue-200">
              조회 시 확인 가능 정보
            </p>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li>• 픽업 예정 시간 & 장소</li>
              <li>• 현재 상태 (예약완료 / 픽업완료 / 반납중 / 반납완료)</li>
              <li>• 연체 안내 및 연장 옵션</li>
              <li>• 파손 신고 내용 & 진행 현황</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
            <p className="text-sm font-semibold text-blue-200">
              연체 알림 안내
            </p>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li>D-1 : 예약번호 + 반납 시간 알림</li>
              <li>D+0 : 반납 완료 확인 요청</li>
              <li>D+1 : 연체 요금 청구 전 SMS</li>
            </ul>
            <Link
              href="/support"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-300"
            >
              추가 문의하기
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

          {result ? (
            <div className="rounded-3xl border border-blue-500/20 bg-blue-950/30 p-6 text-sm text-blue-100">
              <p className="font-semibold">
                주문 {result.code} · 현재 상태: {result.status}
              </p>
              <ul className="mt-4 space-y-2 text-xs">
                {result.timeline.map((item) => (
                  <li
                    key={item.label}
                    className="rounded-2xl border border-blue-500/30 bg-blue-500/5 px-3 py-2"
                  >
                    <p className="font-semibold text-blue-200">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-blue-300">
                      {item.timestamp}
                    </p>
                  </li>
                ))}
              </ul>
              <Link
                href="/damage-report"
                className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-blue-200"
              >
                파손 신고하기 →
              </Link>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { calculatorProducts } from "../../data/home";

const MAX_DAYS = 7;

function formatKRW(value: number) {
  return value.toLocaleString("ko-KR");
}

export function PriceCalculatorPreview() {
  const [productId, setProductId] = useState(calculatorProducts[0].id);
  const [days, setDays] = useState(3);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const selected = useMemo(
    () =>
      calculatorProducts.find((item) => item.id === productId) ??
      calculatorProducts[0],
    [productId],
  );

  const extraDays = Math.max(days - 3, 0);
  const total = (selected.basePrice + extraDays * selected.lateFee) * quantity;

  const handleNavigate = () => {
    router.push(
      `/book-now?product=${productId}&days=${days}&qty=${quantity}`,
    );
  };

  return (
    <section className="border-b border-slate-200 bg-sky-50/40 py-16">
      <div className="container grid gap-10 md:grid-cols-[1fr,0.9fr] md:items-center">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
            가격 계산도 쇼핑처럼 간단하게
          </h2>
          <p className="text-sm text-slate-600">
            날짜와 수량을 조절하면 즉시 총액을 확인할 수 있어요. Checkout 화면과
            동일한 로직으로 연동됩니다.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "3일 기본요금 자동 적용",
              "추가 일수 즉시 반영",
              "수량별 합계 계산",
              "예약 화면과 실시간 연동",
            ].map((feature) => (
              <div
                key={feature}
                className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-xs font-medium text-slate-600 shadow-sm"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-blue-200 bg-white p-6 shadow-xl shadow-blue-100/40">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                제품 선택
              </label>
              <select
                className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:border-blue-300 focus:outline-none"
                value={productId}
                onChange={(event) => setProductId(event.target.value)}
              >
                {calculatorProducts.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  대여 일수 (3~{MAX_DAYS}일)
                </label>
                <input
                  type="range"
                  min={3}
                  max={MAX_DAYS}
                  value={days}
                  onChange={(event) => setDays(Number(event.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-slate-500">
                  선택: {days}일 (추가 {extraDays}일)
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  수량
                </label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:border-blue-300 focus:outline-none"
                  value={quantity}
                  onChange={(event) => setQuantity(Number(event.target.value))}
                />
              </div>
            </div>

            <div className="rounded-xl border border-blue-100 bg-sky-50 p-4 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>기본 3일 요금</span>
                <span>{formatKRW(selected.basePrice)}원</span>
              </div>
              <div className="mt-2 flex justify-between text-slate-500">
                <span>추가/연체 요금</span>
                <span>
                  {extraDays > 0
                    ? `+ ${formatKRW(extraDays * selected.lateFee)}원`
                    : "없음"}
                </span>
              </div>
              <div className="mt-3 border-t border-blue-100 pt-3 text-sm font-semibold text-slate-900">
                <div className="flex justify-between">
                  <span>총액 (수량 {quantity}개)</span>
                  <span>{formatKRW(total)}원</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="w-full rounded bg-blue-500 py-3 text-sm font-semibold text-white hover:bg-blue-400"
              onClick={handleNavigate}
            >
              예약 페이지로 이동
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

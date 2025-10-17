"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { calculatorProducts } from "../../data/home";

type RentalProductSelection = {
  productId: string;
  quantity: number;
};

type RentalFormState = {
  items: RentalProductSelection[];
  startDate: string;
  endDate: string;
  pickupOption: string;
};

type SelectionDetail = {
  selection: RentalProductSelection;
  product: (typeof calculatorProducts)[number];
  baseSubtotal: number;
  extraSubtotal: number;
  total: number;
};

const pickupOptions = ["Flying Japan 난바 여행자센터 픽업"];
const MAX_QUANTITY = 6;

function clampQuantity(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.min(Math.max(Math.trunc(value), 1), MAX_QUANTITY);
}

function calculateDays(startDate: string, endDate: string) {
  if (!startDate || !endDate) {
    return 3;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 3;
  }

  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return Math.min(Math.max(diffDays, 1), 14);
}

function findCalculatorProduct(token: string | null | undefined) {
  if (!token) return undefined;
  return calculatorProducts.find(
    (item) => item.id === token || item.slug === token,
  );
}

function formatKRW(value: number) {
  return value.toLocaleString("ko-KR");
}

export default function BookNowPage() {
  const router = useRouter();
  const params = useSearchParams();

  const [formState, setFormState] = useState<RentalFormState>(() => {
    const startDate = params.get("start") ?? "";
    const endDate = params.get("end") ?? "";
    const pickupOption = params.get("pickup") ?? pickupOptions[0];
    const fallbackProduct = calculatorProducts[0];
    const fallbackQuantity = clampQuantity(Number(params.get("qty") ?? 1));
    const items: RentalProductSelection[] = [];

    const encodedItems = params.get("items");
    if (encodedItems) {
      encodedItems
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
        .forEach((entry) => {
          const [token, qtyRaw] = entry.split(":");
          const product = findCalculatorProduct(token);
          if (!product) return;
          const quantity = clampQuantity(Number(qtyRaw ?? 1));
          const existing = items.find((item) => item.productId === product.id);
          if (existing) {
            existing.quantity = clampQuantity(existing.quantity + quantity);
          } else {
            items.push({ productId: product.id, quantity });
          }
        });
    }

    if (items.length === 0) {
      const singleToken = params.get("product") ?? fallbackProduct?.id ?? "";
      const singleProduct = findCalculatorProduct(singleToken);
      if (singleProduct) {
        items.push({
          productId: singleProduct.id,
          quantity: fallbackQuantity,
        });
      }
    }

    if (items.length === 0 && fallbackProduct) {
      items.push({
        productId: fallbackProduct.id,
        quantity: fallbackQuantity,
      });
    }

    return {
      items,
      startDate,
      endDate,
      pickupOption,
    };
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const rentalDays = calculateDays(formState.startDate, formState.endDate);
  const extraDays = Math.max(rentalDays - 3, 0);

  const selectionDetails = useMemo<SelectionDetail[]>(() => {
    return formState.items
      .map((selection) => {
        const product = findCalculatorProduct(selection.productId);
        if (!product) return null;
        const baseSubtotal = product.basePrice * selection.quantity;
        const extraSubtotal =
          extraDays > 0
            ? product.lateFee * extraDays * selection.quantity
            : 0;
        return {
          selection,
          product,
          baseSubtotal,
          extraSubtotal,
          total: baseSubtotal + extraSubtotal,
        };
      })
      .filter((detail): detail is SelectionDetail => detail !== null);
  }, [formState.items, extraDays]);

  const totalPrice = selectionDetails.reduce(
    (sum, detail) => sum + detail.total,
    0,
  );
  const totalQuantity = selectionDetails.reduce(
    (sum, detail) => sum + detail.selection.quantity,
    0,
  );
  const canSubmit = selectionDetails.length > 0;

  const handleProductChange = (index: number, nextProductId: string) => {
    setFormState((prev) => ({
      ...prev,
      items: prev.items.map((item, idx) =>
        idx === index ? { ...item, productId: nextProductId } : item,
      ),
    }));
  };

  const handleQuantityChange = (index: number, nextQuantity: number) => {
    setFormState((prev) => ({
      ...prev,
      items: prev.items.map((item, idx) =>
        idx === index
          ? { ...item, quantity: clampQuantity(nextQuantity) }
          : item,
      ),
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormState((prev) => {
      const nextItems = prev.items.filter((_, idx) => idx !== index);
      if (nextItems.length === 0) {
        const fallbackProduct = calculatorProducts[0];
        if (fallbackProduct) {
          nextItems.push({ productId: fallbackProduct.id, quantity: 1 });
        }
      }
      return {
        ...prev,
        items: nextItems,
      };
    });
  };

  const handleAddItem = () => {
    setFormState((prev) => {
      const usedIds = new Set(prev.items.map((item) => item.productId));
      const nextProduct =
        calculatorProducts.find((product) => !usedIds.has(product.id)) ??
        calculatorProducts[0];
      if (!nextProduct) {
        return prev;
      }
      return {
        ...prev,
        items: [
          ...prev.items,
          {
            productId: nextProduct.id,
            quantity: 1,
          },
        ],
      };
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setSuccessMessage(null);

    setTimeout(() => {
      const validSelections = selectionDetails;
      if (validSelections.length === 0) {
        setIsSubmitting(false);
        setSuccessMessage("선택한 상품을 확인해 주세요.");
        return;
      }

      const encodedItems = validSelections
        .map(
          (detail) => `${detail.product.slug}:${detail.selection.quantity}`,
        )
        .join(",");

      if (!encodedItems) {
        setIsSubmitting(false);
        setSuccessMessage("선택한 상품을 확인해 주세요.");
        return;
      }

      const searchParams = new URLSearchParams();
      searchParams.set("items", encodedItems);
      if (formState.startDate) {
        searchParams.set("start", formState.startDate);
      }
      if (formState.endDate) {
        searchParams.set("end", formState.endDate);
      }
      searchParams.set("pickup", formState.pickupOption);
      searchParams.set("days", rentalDays.toString());

      setIsSubmitting(false);
      setSuccessMessage(
        `총 ${validSelections.length}종 (${totalQuantity}개) 상품이 장바구니에 담겼어요.`,
      );
      router.push(`/cart?${searchParams.toString()}`);
    }, 400);
  };

  return (
    <div className="border-b border-slate-800 bg-slate-950 py-16">
      <div className="container grid gap-12 md:grid-cols-[1.1fr,0.9fr] md:items-start">
        <section className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white md:text-4xl">
              원하는 날짜에 바로 예약하기
            </h1>
            <p className="text-sm text-slate-300">
              여러 상품을 한 번에 예약하고 총액을 확인하세요. Checkout 단계에서
              동일한 정보가 적용됩니다.
            </p>
          </div>

          <form
            className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">
              {selectionDetails.map((detail, index) => (
                <div
                  key={`${detail.product.id}-${index}`}
                  className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4"
                >
                  <div className="grid gap-4 md:grid-cols-[1fr,auto] md:items-end">
                    <label className="space-y-2 text-sm text-slate-300">
                      <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                        상품 {index + 1}
                      </span>
                      <select
                        className="h-11 w-full rounded border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
                        value={detail.selection.productId}
                        onChange={(event) =>
                          handleProductChange(index, event.target.value)
                        }
                      >
                        {calculatorProducts.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="flex flex-col items-start gap-2 md:flex-row md:items-end md:gap-3">
                      <label className="space-y-2 text-sm text-slate-300">
                        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                          수량
                        </span>
                        <input
                          type="number"
                          min={1}
                          max={MAX_QUANTITY}
                          className="h-11 w-28 rounded border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
                          value={detail.selection.quantity}
                          onChange={(event) =>
                            handleQuantityChange(
                              index,
                              Number(event.target.value),
                            )
                          }
                        />
                      </label>
                      {formState.items.length > 1 ? (
                        <button
                          type="button"
                          className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-red-400 hover:text-red-200"
                          onClick={() => handleRemoveItem(index)}
                        >
                          삭제
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-400">
                    <div className="flex justify-between text-sm text-slate-200">
                      <span>예상 금액</span>
                      <span className="font-semibold text-blue-200">
                        {formatKRW(detail.total)}원
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <span>기본 3일 요금</span>
                      <span>{formatKRW(detail.baseSubtotal)}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span>추가/연체 요금</span>
                      <span>
                        {extraDays > 0
                          ? `+ ${formatKRW(detail.extraSubtotal)}원 (추가 ${extraDays}일)`
                          : "추가 요금 없음"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="w-full rounded-full border border-dashed border-slate-600 py-2 text-sm font-semibold text-slate-200 hover:border-blue-400 hover:text-white"
              onClick={handleAddItem}
            >
              + 다른 상품 추가
            </button>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  대여 시작일
                </span>
                <input
                  type="date"
                  className="h-11 w-full rounded border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
                  value={formState.startDate}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      startDate: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  반납 예정일
                </span>
                <input
                  type="date"
                  className="h-11 w-full rounded border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
                  value={formState.endDate}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      endDate: event.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <label className="space-y-2 text-sm text-slate-300">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                픽업 옵션
              </span>
              <select
                value={formState.pickupOption}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    pickupOption: event.target.value,
                  }))
                }
                className="h-11 w-full rounded border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
              >
                {pickupOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500">
                모든 상품은 Flying Japan 난바 여행자센터에서만 픽업 및 반납이
                진행됩니다.
              </p>
            </label>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
              {selectionDetails.length > 0 ? (
                <div className="space-y-3">
                  {selectionDetails.map((detail) => (
                    <div key={detail.product.id}>
                      <div className="flex justify-between font-semibold text-white">
                        <span>
                          {detail.product.name} × {detail.selection.quantity}개
                        </span>
                        <span>{formatKRW(detail.total)}원</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        기본 {formatKRW(detail.baseSubtotal)}원
                        {extraDays > 0
                          ? ` · 추가 ${formatKRW(detail.extraSubtotal)}원`
                          : ""}
                      </p>
                    </div>
                  ))}
                  <div className="border-t border-slate-800 pt-3 text-sm font-semibold text-white">
                    <div className="flex justify-between">
                      <span>
                        총액 (상품 {selectionDetails.length}종, {totalQuantity}
                        개, {rentalDays}일)
                      </span>
                      <span>{formatKRW(totalPrice)}원</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  예약할 상품을 추가해 주세요.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-blue-500 py-3 text-sm font-semibold text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting || !canSubmit}
            >
              {isSubmitting ? "장바구니로 이동 중..." : "장바구니에 담기"}
            </button>
            <p className="text-xs text-slate-500">
              결제 단계에서 일정 변경 및 연장 신청을 다시 확인할 수 있어요.
            </p>

            {successMessage ? (
              <p className="rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-center text-xs text-blue-200">
                {successMessage}
              </p>
            ) : null}
          </form>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-sm font-semibold text-blue-200">예약 꿀팁</p>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li>• 이용일 3일 전 예약 시 모든 제품 할인 보장</li>
              <li>• 번들 상품은 장바구니에 담으면 자동 할인</li>
              <li>• 픽업 옵션은 Checkout에서 다시 변경 가능</li>
              <li>• 결제 전 재고가 변동되면 즉시 알림</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
            <p className="text-sm font-semibold text-blue-200">고객센터</p>
            <p className="mt-2 text-xs text-slate-400">
              운영시간 09:00~21:00 (JST)
            </p>
            <Link
              href="/support"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-300"
            >
              실시간 채팅 연결
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
            <p className="mt-4 text-xs text-slate-500">
              예약 완료 후에는 계정 페이지에서 일정을 다시 확인할 수 있어요.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

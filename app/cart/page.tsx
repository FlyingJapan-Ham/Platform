"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import { beautyProducts, usjProducts } from "../../data/catalog";

type CartItem = {
  slug: string;
  name: string;
  quantity: number;
  basePrice: number;
  lateFee: number;
  pickup: string;
  duration: string;
};

const allProducts = [...usjProducts, ...beautyProducts];

function clampQuantity(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.min(Math.max(Math.trunc(value), 1), 6);
}

function CartPageContent() {
  const router = useRouter();
  const params = useSearchParams();

  const parsedCartItems = useMemo<CartItem[]>(() => {
    const pickup = params.get("pickup") ?? "난바 여행자센터";
    const start = params.get("start");
    const end = params.get("end");
    const days = Number(params.get("days"));
    const durationLabel = start && end
      ? `${start} ~ ${end}`
      : Number.isFinite(days) && days > 0
      ? `${days}일 이용`
      : "3일 기본";

    const encodedItems = params.get("items");
    if (encodedItems) {
      const parsed = encodedItems
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((entry) => {
          const [slugToken, qtyRaw] = entry.split(":");
          const product = allProducts.find(
            (item) => item.slug === slugToken || item.id === slugToken,
          );
          if (!product) return null;
          const quantity = clampQuantity(Number(qtyRaw ?? 1));
          return {
            slug: product.slug,
            name: product.name,
            quantity,
            basePrice: product.basePriceValue,
            lateFee: product.lateFeeValue,
            pickup,
            duration: durationLabel,
          };
        })
        .filter((item): item is CartItem => item !== null);
      if (parsed.length > 0) {
        return parsed;
      }
    }

    const slug = params.get("product");
    if (slug) {
      const product = allProducts.find(
        (item) => item.slug === slug || item.id === slug,
      );
      if (product) {
        return [
          {
            slug: product.slug,
            name: product.name,
            quantity: clampQuantity(Number(params.get("qty") ?? 1)),
            basePrice: product.basePriceValue,
            lateFee: product.lateFeeValue,
            pickup,
            duration: durationLabel,
          },
        ];
      }
    }

    return [];
  }, [params]);

  const [items, setItems] = useState<CartItem[]>(() => {
    if (parsedCartItems.length > 0) {
      return parsedCartItems;
    }

    const defaultProduct = usjProducts[1];
    return [
      {
        slug: defaultProduct.slug,
        name: defaultProduct.name,
        quantity: 1,
        basePrice: defaultProduct.basePriceValue,
        lateFee: defaultProduct.lateFeeValue,
        pickup: "난바 여행자센터",
        duration: "3일 기본",
      },
    ];
  });

  const hasItems = items.length > 0;

  const totalAmount = items.reduce(
    (sum, item) => sum + item.basePrice * item.quantity,
    0,
  );

  const highestLateFee = items.reduce(
    (max, item) => Math.max(max, item.lateFee),
    0,
  );

  const handleQuantityChange = (slug: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.slug === slug
            ? {
                ...item,
                quantity: Math.min(Math.max(item.quantity + delta, 1), 6),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemove = (slug: string) => {
    setItems((prev) => prev.filter((item) => item.slug !== slug));
  };

  const handleCheckout = () => {
    if (!hasItems) {
      router.push("/book-now");
      return;
    }

    router.push("/checkout");
  };

  return (
    <div className="border-b border-slate-800 bg-slate-950 py-16">
      <div className="container space-y-8">
        <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">장바구니</h1>
            <p className="text-sm text-slate-300">
              예약할 상품과 픽업 옵션을 확인하고 결제를 진행하세요.
            </p>
          </div>
          <Link
            href="/book-now"
            className="inline-flex items-center justify-center rounded-full bg-blue-500 px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-blue-400"
          >
            다른 상품 추가
          </Link>
        </header>

        {hasItems ? (
          <section className="grid gap-6 md:grid-cols-[2fr,1fr] md:items-start">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.slug}
                  className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300"
                >
                  <h2 className="text-lg font-semibold text-white">
                    {item.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">{item.duration}</p>
                  <p className="text-sm text-slate-400">픽업: {item.pickup}</p>
                  <div className="mt-3 flex items-center gap-3 text-sm text-slate-300">
                    <span>수량</span>
                    <div className="flex items-center rounded-full border border-slate-700">
                      <button
                        type="button"
                        className="h-8 w-8 text-slate-200 hover:text-white"
                        onClick={() => handleQuantityChange(item.slug, -1)}
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="h-8 w-8 text-slate-200 hover:text-white"
                        onClick={() => handleQuantityChange(item.slug, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-blue-200">
                    {(item.basePrice * item.quantity).toLocaleString("ko-KR")}원
                  </p>
                  <div className="mt-4 flex gap-3">
                    <Link
                      href={`/book-now?product=${item.slug}&qty=${item.quantity}`}
                      className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-blue-400"
                    >
                      예약 옵션 수정
                    </Link>
                    <button
                      type="button"
                      className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-red-400 hover:text-red-200"
                      onClick={() => handleRemove(item.slug)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="space-y-4">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
                <h2 className="text-lg font-semibold text-white">요금 요약</h2>
                <div className="mt-4 space-y-2 text-sm text-slate-300">
                  <div className="flex justify-between">
                    <span>상품 총액</span>
                    <span>{totalAmount.toLocaleString("ko-KR")}원</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>연체 예정금</span>
                    <span>
                      추가 1일당 {highestLateFee.toLocaleString("ko-KR")}원
                    </span>
                  </div>
                </div>
                <div className="mt-4 border-t border-slate-800 pt-4 text-sm font-semibold text-white">
                  <div className="flex justify-between">
                    <span>결제 예정 금액</span>
                    <span>{totalAmount.toLocaleString("ko-KR")}원</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-6 w-full rounded-full bg-blue-500 py-3 text-sm font-semibold text-white hover:bg-blue-400"
                  onClick={handleCheckout}
                >
                  결제 진행
                </button>
              </div>
              <p className="text-xs text-slate-500">
                결제 완료 후 계정 페이지에서 주문과 반납 일정을 확인할 수 있습니다.
              </p>
            </aside>
          </section>
        ) : (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-10 text-center text-sm text-slate-300">
            <p>장바구니가 비어 있습니다.</p>
            <Link
              href="/book-now"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-500 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-400"
            >
              상품 보러 가기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center bg-slate-950 text-sm text-slate-400">
          장바구니 정보를 불러오는 중입니다...
        </div>
      }
    >
      <CartPageContent />
    </Suspense>
  );
}

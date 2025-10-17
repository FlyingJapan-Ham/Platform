import Link from "next/link";

import type { InventoryUnitRecord } from "../../data/admin";
import {
  adminSummaryCards,
  inventoryUnits,
  monthlyRevenue,
  reportMetrics,
} from "../../data/admin";

type ProductInventoryRow = {
  productName: string;
  productSlug: string;
  total: number;
  available: number;
  rented: number;
  returning: number;
  cleaning: number;
  lost: number;
  damaged: number;
  lostDamage: number;
};

const statusLabelMap: Record<InventoryUnitRecord["status"], string> = {
  AVAILABLE: "대기",
  RENTED: "대여 중",
  CLEANING: "클리닝",
  RETURNING: "반납 처리",
  LOST: "분실",
};

const statusBadgeTone: Record<InventoryUnitRecord["status"], string> = {
  AVAILABLE: "bg-slate-800 text-slate-300",
  RENTED: "bg-blue-500/20 text-blue-200",
  CLEANING: "bg-amber-500/20 text-amber-200",
  RETURNING: "bg-emerald-500/20 text-emerald-200",
  LOST: "bg-rose-500/20 text-rose-200",
};

export default function AdminDashboardPage() {
  const totalUnits = inventoryUnits.length;

  const summary = inventoryUnits.reduce(
    (acc, unit) => {
      acc.status[unit.status] += 1;
      if (unit.damageStatus === "DAMAGED") {
        acc.damage.damaged += 1;
      }
      if (unit.damageStatus === "LOST") {
        acc.damage.lost += 1;
      }
      return acc;
    },
    {
      status: {
        AVAILABLE: 0,
        RENTED: 0,
        CLEANING: 0,
        RETURNING: 0,
        LOST: 0,
      },
      damage: { damaged: 0, lost: 0 },
    } as {
      status: Record<InventoryUnitRecord["status"], number>;
      damage: { damaged: number; lost: number };
    },
  );

  const { status: statusCounts, damage: damageCounts } = summary;
  const overallRiskUnits = damageCounts.damaged + damageCounts.lost;
  const overallLossRate =
    totalUnits === 0 ? 0 : (overallRiskUnits / totalUnits) * 100;

  const productMap = inventoryUnits.reduce(
    (map, unit) => {
      const existing = map.get(unit.productSlug);
      if (!existing) {
        map.set(unit.productSlug, {
          productName: unit.productName,
          productSlug: unit.productSlug,
          total: 0,
          available: 0,
          rented: 0,
          returning: 0,
          cleaning: 0,
          lost: 0,
          damaged: 0,
          lostDamage: 0,
        });
      }
      const record = map.get(unit.productSlug)!;
      record.total += 1;
      switch (unit.status) {
        case "AVAILABLE":
          record.available += 1;
          break;
        case "RENTED":
          record.rented += 1;
          break;
        case "RETURNING":
          record.returning += 1;
          break;
        case "CLEANING":
          record.cleaning += 1;
          break;
        case "LOST":
          record.lost += 1;
          break;
        default:
          break;
      }
      if (unit.damageStatus === "DAMAGED") {
        record.damaged += 1;
      }
      if (unit.damageStatus === "LOST") {
        record.lostDamage += 1;
      }
      return map;
    },
    new Map<string, ProductInventoryRow>(),
  );

  const productSummaries = Array.from(productMap.values()).sort(
    (a, b) => b.total - a.total,
  );

  const activeRentals = inventoryUnits
    .filter(
      (unit) => unit.status === "RENTED" || unit.status === "RETURNING",
    )
    .sort(
      (a, b) =>
        new Date(b.lastActivity).getTime() -
        new Date(a.lastActivity).getTime(),
    );

  const lossStats = productSummaries
    .map((product) => {
      const riskCount = product.damaged + product.lostDamage;
      const rate = product.total === 0 ? 0 : (riskCount / product.total) * 100;
      return { ...product, riskCount, rate };
    })
    .filter((entry) => entry.riskCount > 0)
    .sort((a, b) => b.rate - a.rate);

  const inventoryHighlights = [
    {
      title: "전체 재고",
      value: `${totalUnits.toLocaleString("ko-KR")}대`,
      caption: "운영 중 장비",
      accent: "text-white",
    },
    {
      title: "대기",
      value: `${statusCounts.AVAILABLE.toLocaleString("ko-KR")}대`,
      caption: "즉시 출고 가능",
      accent: "text-emerald-300",
    },
    {
      title: "대여 중",
      value: `${(
        statusCounts.RENTED + statusCounts.RETURNING
      ).toLocaleString("ko-KR")}대`,
      caption: `반납 처리 ${statusCounts.RETURNING.toLocaleString("ko-KR")}대 포함`,
      accent: "text-blue-300",
    },
    {
      title: "손상/분실",
      value: `${overallRiskUnits.toLocaleString("ko-KR")}대`,
      caption: `손상 ${damageCounts.damaged} · 분실 ${damageCounts.lost}`,
      accent: "text-rose-300",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminSummaryCards.map((card) => (
          <div
            key={card.title}
            className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              {card.title}
            </p>
            <p className="mt-3 text-2xl font-bold text-white">{card.value}</p>
            <p
              className={[
                "mt-2 text-xs font-medium",
                card.trend === "up"
                  ? "text-emerald-300"
                  : card.trend === "down"
                  ? "text-rose-300"
                  : "text-slate-400",
              ].join(" ")}
            >
              {card.change}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {inventoryHighlights.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              {item.title}
            </p>
            <p className={`mt-3 text-2xl font-bold ${item.accent}`}>
              {item.value}
            </p>
            <p className="mt-1 text-xs text-slate-400">{item.caption}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                제품별 재고 현황
              </h2>
              <p className="text-xs text-slate-400">
                현재 등록된 재고를 제품 기준으로 집계했습니다.
              </p>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs font-semibold text-blue-300 hover:text-blue-200"
            >
              재고 상세 →
            </Link>
          </div>
          <div className="mt-6 overflow-auto">
            <table className="min-w-full border-collapse text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3 text-left">제품</th>
                  <th className="px-4 py-3 text-right">총 수량</th>
                  <th className="px-4 py-3 text-right">대기</th>
                  <th className="px-4 py-3 text-right">대여 중</th>
                  <th className="px-4 py-3 text-right">클리닝</th>
                  <th className="px-4 py-3 text-right">분실</th>
                  <th className="px-4 py-3 text-right">손상</th>
                </tr>
              </thead>
              <tbody>
                {productSummaries.map((product) => (
                  <tr
                    key={product.productSlug}
                    className="border-t border-slate-800 bg-slate-950/40 hover:bg-slate-900/60"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/products/${product.productSlug}`}
                        className="text-sm font-semibold text-blue-300 hover:text-blue-200"
                      >
                        {product.productName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {product.total.toLocaleString("ko-KR")}대
                    </td>
                    <td className="px-4 py-3 text-right">
                      {product.available.toLocaleString("ko-KR")}대
                    </td>
                    <td className="px-4 py-3 text-right">
                      {(product.rented + product.returning).toLocaleString(
                        "ko-KR",
                      )}
                      대
                    </td>
                    <td className="px-4 py-3 text-right">
                      {product.cleaning.toLocaleString("ko-KR")}대
                    </td>
                    <td className="px-4 py-3 text-right">
                      {product.lost.toLocaleString("ko-KR")}대
                    </td>
                    <td className="px-4 py-3 text-right">
                      {product.damaged.toLocaleString("ko-KR")}대
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {productSummaries.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-slate-500">
                재고 데이터가 없습니다.
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-lg font-semibold text-white">
              대여 중인 아이템
            </h2>
            <p className="text-xs text-slate-400">
              최근 활동 기준으로 정렬된 대여/반납 진행 중 장비입니다.
            </p>
            <ul className="mt-4 space-y-3">
              {activeRentals.length > 0 ? (
                activeRentals.map((unit) => (
                  <li
                    key={unit.id}
                    className="rounded-2xl bg-slate-900/60 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">
                        {unit.productName}
                      </p>
                      <span
                        className={[
                          "rounded-full px-3 py-1 text-xs font-medium",
                          statusBadgeTone[unit.status],
                        ].join(" ")}
                      >
                        {statusLabelMap[unit.status]}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                      재고 ID {unit.id} · 최근 활동 {unit.lastActivity}
                    </p>
                  </li>
                ))
              ) : (
                <li className="rounded-2xl bg-slate-900/60 p-4 text-xs text-slate-400">
                  진행 중인 대여가 없습니다.
                </li>
              )}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="flex items-baseline justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  손실률 통계
                </h2>
                <p className="text-xs text-slate-400">
                  손상 또는 분실로 표시된 유닛 비율입니다.
                </p>
              </div>
              <span className="text-xs font-medium text-rose-300">
                전체 {overallLossRate.toFixed(1)}%
              </span>
            </div>
            <ul className="mt-4 space-y-3">
              {lossStats.length > 0 ? (
                lossStats.slice(0, 5).map((entry) => (
                  <li
                    key={entry.productSlug}
                    className="rounded-2xl bg-slate-900/60 p-4"
                  >
                    <div className="flex items-center justify-between text-sm font-semibold text-white">
                      <span>{entry.productName}</span>
                      <span>{entry.rate.toFixed(1)}%</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                      손상 {entry.damaged.toLocaleString("ko-KR")}대 · 분실{" "}
                      {entry.lostDamage.toLocaleString("ko-KR")}대
                    </p>
                  </li>
                ))
              ) : (
                <li className="rounded-2xl bg-slate-900/60 p-4 text-xs text-slate-400">
                  손실로 분류된 장비가 아직 없습니다.
                </li>
              )}
            </ul>
            <p className="mt-4 text-xs text-slate-500">
              총 손실 {overallRiskUnits.toLocaleString("ko-KR")}대 · 재고 대비{" "}
              {overallLossRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                월별 렌탈 수익 추이
              </h2>
              <p className="text-xs text-slate-400">
                최근 6개월간 거래 금액(원)
              </p>
            </div>
            <Link
              href="/admin/reports"
              className="text-xs font-semibold text-blue-300 hover:text-blue-200"
            >
              상세 리포트 →
            </Link>
          </div>
          <div className="mt-6 h-56 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-400">
            <p>차트 플레이스홀더</p>
            <ul className="mt-4 space-y-1">
              {monthlyRevenue.map((point) => (
                <li key={point.month} className="flex justify-between">
                  <span>{point.month}</span>
                  <span>{point.value.toLocaleString("ko-KR")}원</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold text-white">
            주간 주요 지표
          </h2>
          <ul className="mt-4 space-y-4">
            {reportMetrics.slice(0, 2).map((metric) => (
              <li key={metric.title} className="rounded-2xl bg-slate-900/60 p-4">
                <p className="text-sm font-semibold text-blue-200">
                  {metric.title}
                </p>
                <ul className="mt-3 space-y-2 text-xs text-slate-300">
                  {metric.entries.map((entry) => (
                    <li key={entry.label} className="flex justify-between">
                      <span>{entry.label}</span>
                      <span>{entry.value}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

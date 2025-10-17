import Link from "next/link";

import { inventoryUnits } from "../../../data/admin";
import { InventoryTable } from "../../../components/admin/InventoryTable";

export default function AdminInventoryPage() {
  const totalUnits = inventoryUnits.length;
  const rentedUnits = inventoryUnits.filter(
    (unit) => unit.status === "RENTED",
  ).length;
  const damagedUnits = inventoryUnits.filter(
    (unit) => unit.damageStatus !== "NONE",
  ).length;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">재고 관리</h1>
          <p className="text-sm text-slate-400">
            USJ 굿즈와 뷰티 디바이스의 개별 재고 상태를 모니터링하세요.
          </p>
        </div>
        <Link
          href="/admin/reports"
          className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:border-blue-400 hover:text-white"
        >
          손익 리포트 보기
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            전체 재고
          </p>
          <p className="mt-2 text-2xl font-bold text-white">{totalUnits}대</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            대여 중
          </p>
          <p className="mt-2 text-2xl font-bold text-white">
            {rentedUnits}대
          </p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            파손/분실
          </p>
          <p className="mt-2 text-2xl font-bold text-white">
            {damagedUnits}대
          </p>
        </div>
      </section>

      <InventoryTable />
    </div>
  );
}

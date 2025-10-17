"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import type { InventoryUnitRecord } from "../../data/admin";
import { inventoryUnits } from "../../data/admin";

const statusFilters = [
  { label: "전체", value: "ALL" },
  { label: "대여 중", value: "RENTED" },
  { label: "대기", value: "AVAILABLE" },
  { label: "반납 처리", value: "RETURNING" },
  { label: "클리닝", value: "CLEANING" },
  { label: "분실", value: "LOST" },
];

const damageFilters = [
  { label: "전체", value: "ALL" },
  { label: "정상", value: "NONE" },
  { label: "파손", value: "DAMAGED" },
  { label: "분실", value: "LOST" },
];

const damageStatusOptions: {
  label: string;
  value: InventoryUnitRecord["damageStatus"];
}[] = [
  { label: "정상", value: "NONE" },
  { label: "파손", value: "DAMAGED" },
  { label: "분실", value: "LOST" },
];

export function InventoryTable() {
  const [units, setUnits] = useState(inventoryUnits);
  const [status, setStatus] = useState("ALL");
  const [damage, setDamage] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const handleDamageStatusChange = (
    id: string,
    nextDamageStatus: InventoryUnitRecord["damageStatus"],
  ) => {
    setUnits((previous) =>
      previous.map((unit) => {
        if (unit.id !== id) {
          return unit;
        }
        const nextStatus =
          nextDamageStatus === "LOST"
            ? "LOST"
            : nextDamageStatus === "DAMAGED"
            ? "CLEANING"
            : unit.status === "LOST" || unit.status === "CLEANING"
            ? "AVAILABLE"
            : unit.status;

        return {
          ...unit,
          damageStatus: nextDamageStatus,
          status: nextStatus,
          lastActivity: formatTimestamp(new Date()),
        };
      }),
    );
  };

  const filtered = useMemo(() => {
    return units.filter((unit) => {
      const matchStatus = status === "ALL" || unit.status === status;
      const matchDamage = damage === "ALL" || unit.damageStatus === damage;
      const matchSearch =
        searchTerm.trim().length === 0 ||
        unit.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchStatus && matchDamage && matchSearch;
    });
  }, [units, status, damage, searchTerm]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-slate-400">
            상태:
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="ml-2 rounded border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
            >
              {statusFilters.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-slate-400">
            파손:
            <select
              value={damage}
              onChange={(event) => setDamage(event.target.value)}
              className="ml-2 rounded border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
            >
              {damageFilters.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <input
          type="search"
          className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:outline-none md:w-64"
          placeholder="제품명 또는 재고 ID 검색"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-800">
        <table className="min-w-full border-collapse text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">재고 ID</th>
              <th className="px-4 py-3 text-left">제품</th>
              <th className="px-4 py-3 text-left">상태</th>
              <th className="px-4 py-3 text-left">파손</th>
              <th className="px-4 py-3 text-left">등록일</th>
              <th className="px-4 py-3 text-left">최근 활동</th>
              <th className="px-4 py-3 text-left">수익/손실</th>
              <th className="px-4 py-3 text-left">액션</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((unit) => (
              <tr
                key={unit.id}
                className="border-t border-slate-800 bg-slate-950/40 hover:bg-slate-900/60"
              >
                <td className="px-4 py-3 font-mono text-xs text-slate-400">
                  {unit.id}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/products/${unit.productSlug}`}
                    className="text-sm font-semibold text-blue-300 hover:text-blue-200"
                  >
                    {unit.productName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-xs">
                  <span className="rounded-full bg-slate-800 px-3 py-1">
                    {translateStatus(unit.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs">
                  <span
                    className={[
                      "rounded-full px-3 py-1",
                      unit.damageStatus === "NONE"
                        ? "bg-emerald-500/20 text-emerald-200"
                        : unit.damageStatus === "DAMAGED"
                        ? "bg-amber-500/20 text-amber-200"
                        : "bg-rose-500/20 text-rose-200",
                    ].join(" ")}
                  >
                    {translateDamage(unit.damageStatus)}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-400">
                  {unit.registrationDate}
                </td>
                <td className="px-4 py-3 text-xs text-slate-400">
                  {unit.lastActivity}
                </td>
                <td
                  className={[
                    "px-4 py-3 text-sm font-semibold",
                    unit.profitLoss >= 0
                      ? "text-emerald-300"
                      : "text-rose-300",
                  ].join(" ")}
                >
                  {unit.profitLoss >= 0 ? "+" : "-"}
                  {Math.abs(unit.profitLoss).toLocaleString("ko-KR")}원
                </td>
                <td className="px-4 py-3 text-xs">
                  <button className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:border-blue-400">
                    상세 보기
                  </button>
                  <label className="mt-2 block text-[10px] uppercase tracking-widest text-slate-500">
                    손상 상태
                    <select
                      value={unit.damageStatus}
                      onChange={(event) =>
                        handleDamageStatusChange(
                          unit.id,
                          event.target.value as InventoryUnitRecord["damageStatus"],
                        )
                      }
                      className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100"
                    >
                      {damageStatusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatTimestamp(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function translateStatus(
  status: "AVAILABLE" | "RENTED" | "CLEANING" | "RETURNING" | "LOST",
) {
  switch (status) {
    case "AVAILABLE":
      return "대기";
    case "RENTED":
      return "대여 중";
    case "CLEANING":
      return "클리닝";
    case "RETURNING":
      return "반납 처리";
    case "LOST":
      return "분실";
    default:
      return status;
  }
}

function translateDamage(status: "NONE" | "DAMAGED" | "LOST") {
  switch (status) {
    case "NONE":
      return "정상";
    case "DAMAGED":
      return "파손";
    case "LOST":
      return "분실";
    default:
      return status;
  }
}

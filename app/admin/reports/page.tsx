import Link from "next/link";

import { monthlyRevenue, reportMetrics } from "../../../data/admin";

export default function AdminReportsPage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">수익 리포트</h1>
          <p className="text-sm text-slate-400">
            카테고리별 실적과 손실 지표를 확인하고 CSV로 내보내세요.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:border-blue-400">
            CSV 내보내기
          </button>
          <Link
            href="/admin/inventory"
            className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:border-blue-400"
          >
            재고 페이지 이동
          </Link>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold text-white">월별 수익 요약</h2>
          <div className="mt-4 h-56 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-400">
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
          <h2 className="text-lg font-semibold text-white">주요 지표</h2>
          <ul className="mt-4 space-y-4">
            {reportMetrics.map((metric) => (
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

      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-300">
        <h2 className="text-lg font-semibold text-white">메모</h2>
        <ul className="mt-3 space-y-2 text-xs text-slate-400">
          <li>• CSV는 월/제품별 수익, 연체, 파손 데이터를 포함합니다.</li>
          <li>• 손실률 5% 이상 제품은 인벤토리 페이지에서 자동 강조됩니다.</li>
          <li>• 더 상세한 BI 분석은 Supabase 리포트 뷰를 활용하세요.</li>
        </ul>
      </section>
    </div>
  );
}

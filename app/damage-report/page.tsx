"use client";

import { FormEvent, useState } from "react";

const damageTypes = ["외관 손상", "작동 불가", "분실", "기타"];

export default function DamageReportPage() {
  const [formState, setFormState] = useState({
    orderCode: "",
    phone: "",
    type: damageTypes[0],
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.orderCode || !formState.phone || !formState.description) {
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="border-b border-slate-800 bg-slate-950 py-16">
      <div className="container space-y-6">
        <h1 className="text-3xl font-bold text-white md:text-4xl">
          파손 신고 & 복구 지원
        </h1>
        <p className="text-sm text-slate-300">
          제품에 이상이 생겼다면 바로 신고해주세요. 전문 상담사가 복구 또는
          교환 절차를 안내해 드립니다.
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
              value={formState.orderCode}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  orderCode: event.target.value,
                }))
              }
              required
              className="h-11 w-full rounded border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              연락 가능한 번호
            </span>
            <input
              type="tel"
              value={formState.phone}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, phone: event.target.value }))
              }
              required
              className="h-11 w-full rounded border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              파손 유형
            </span>
            <select
              value={formState.type}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, type: event.target.value }))
              }
              className="h-11 w-full rounded border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
            >
              {damageTypes.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              상세 설명
            </span>
            <textarea
              rows={6}
              value={formState.description}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              required
              className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              사진 첨부 (선택)
            </span>
            <input
              type="file"
              className="w-full rounded border border-dashed border-slate-700 bg-slate-900 px-3 py-3 text-xs text-slate-400 focus:border-blue-400 focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-blue-500 py-3 text-sm font-semibold text-white hover:bg-blue-400"
          >
            신고 접수
          </button>
          <p className="text-xs text-slate-500">
            접수 후 1시간 이내에 상담원이 연락드립니다.
          </p>
          {submitted ? (
            <p className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-center text-xs text-blue-200">
              신고가 접수되었습니다. 담당자가 곧 연락드릴게요.
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}

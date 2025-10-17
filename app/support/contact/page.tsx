"use client";

import { FormEvent, useState } from "react";

const inquiryTypes = [
  "단체(10인 이상) 예약",
  "파트너 제휴",
  "언론/미디어 협업",
  "기타 문의",
];

export default function SupportContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    type: inquiryTypes[0],
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="border-b border-slate-800 bg-slate-950 py-16">
      <div className="container space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            파트너십 & 기타 문의
          </h1>
          <p className="text-sm text-slate-300">
            단체 예약, 파트너 제휴, 미디어 협업 등 다양한 제안을 기다리고 있어요.
          </p>
        </header>
        <form
          className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6"
          onSubmit={handleSubmit}
        >
          <label className="space-y-2 text-sm text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              이름 / 회사명
            </span>
            <input
              type="text"
              value={formState.name}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, name: event.target.value }))
              }
              required
              className="h-11 w-full rounded border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              연락처
            </span>
            <input
              type="email"
              value={formState.email}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, email: event.target.value }))
              }
              required
              className="h-11 w-full rounded border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              문의 유형
            </span>
            <select
              value={formState.type}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, type: event.target.value }))
              }
              className="h-11 w-full rounded border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
            >
              {inquiryTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              문의 내용
            </span>
            <textarea
              rows={6}
              value={formState.message}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  message: event.target.value,
                }))
              }
              required
              className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-blue-500 py-3 text-sm font-semibold text-white hover:bg-blue-400"
          >
            문의 보내기
          </button>
          {submitted ? (
            <p className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-center text-xs text-blue-200">
              접수 완료! 담당자가 24시간 이내에 회신드립니다.
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}

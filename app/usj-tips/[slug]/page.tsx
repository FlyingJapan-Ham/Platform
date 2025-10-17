import Link from "next/link";
import { notFound } from "next/navigation";

import { getUsjTipBySlug } from "../../../data/usjTips";

type UsjTipPageProps = {
  params: { slug: string };
};

export default function UsjTipDetailPage({ params }: UsjTipPageProps) {
  const tip = getUsjTipBySlug(params.slug);

  if (!tip) {
    notFound();
  }

  return (
    <div className="border-b border-slate-800 bg-slate-950 py-16">
      <div className="container space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">
            {tip.readingTime}
          </p>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            {tip.title}
          </h1>
          <p className="text-sm text-slate-300">{tip.summary}</p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {tip.sections.map((section) => (
            <article
              key={section.heading}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300"
            >
              <h2 className="text-lg font-semibold text-blue-200">
                {section.heading}
              </h2>
              <p className="mt-3 text-sm text-slate-300">
                {section.description}
              </p>
            </article>
          ))}
        </section>

        {tip.cta ? (
          <Link
            href={tip.cta.href}
            className="inline-flex items-center justify-center rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-400"
          >
            {tip.cta.label}
          </Link>
        ) : null}

        <Link
          href="/usj-tips"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

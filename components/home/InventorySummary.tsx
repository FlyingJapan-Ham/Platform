import { inventoryHighlights } from "../../data/home";

export function InventorySummary() {
  return (
    <section className="border-b border-slate-200 bg-white py-16">
      <div className="container space-y-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
              Flying Japan만의 렌탈 혜택
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              여행자의 시간을 아껴주는 서비스 요소를 확인해 보세요.
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {inventoryHighlights.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div>
                <p className="text-sm font-semibold text-blue-500">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  {item.description}
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                {item.metrics.map((metric) => (
                  <li
                    key={metric}
                    className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2"
                  >
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-400" />
                    {metric}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

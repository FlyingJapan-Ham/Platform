import Link from "next/link";

export default function UsjGuidePage() {
  return (
    <div className="border-b border-slate-800 bg-slate-950 py-16">
      <div className="container space-y-10">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            USJ Power-Up Band & Wand 가이드
          </h1>
          <p className="text-sm text-slate-300">
            픽업부터 반납까지, 그리고 파크 내에서 200% 활용하는 방법을 안내해
            드려요.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
            <h2 className="text-lg font-semibold text-blue-200">
              1. 픽업 & 등록
            </h2>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li>• Flying Japan 난바 여행자센터에서 여권 확인 후 수령</li>
              <li>• Power-Up Band는 Nintendo 앱에서 프로필 등록</li>
              <li>• 인터랙티브 Wand는 안내 직원이 매직 스팟 사용법 시연</li>
            </ul>
          </article>
          <article className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
            <h2 className="text-lg font-semibold text-blue-200">
              2. 파크 내 활용 팁
            </h2>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li>• 마법 스팟은 오전에 사람이 적어요</li>
              <li>• 밴드 코인으로 미니게임 보상 교환 시 줄을 두 번 확인</li>
              <li>• Wand는 비 예보 시 제공되는 커버를 꼭 씌워주세요</li>
            </ul>
          </article>
          <article className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
            <h2 className="text-lg font-semibold text-blue-200">
              3. 반납 / 연장
            </h2>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li>• 난바 여행자센터에서 반납 완료 처리</li>
              <li>• 연장 시 앱에서 요청 → 문자 승인 후 자동 결제</li>
              <li>• 파손 시 즉시 사진을 첨부해 신고해주세요</li>
            </ul>
          </article>
          <article className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
            <h2 className="text-lg font-semibold text-blue-200">
              4. 자주 묻는 질문
            </h2>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li>Q. 파크 밖에서도 코인 확인이 되나요? → 네, 앱에서 가능합니다.</li>
              <li>Q. Wand가 작동하지 않아요. → 배터리 내장형이라 교체해드려요.</li>
              <li>Q. 비 오는 날 사용할 수 있나요? → 방수 커버로 보호되니 문제 없어요.</li>
            </ul>
          </article>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-xs text-slate-400">
          <p>
            추가 도움이 필요하면{" "}
            <Link
              href="/support"
              className="text-blue-300 underline-offset-2 hover:underline"
            >
              지원 센터
            </Link>
            로 문의하세요.
          </p>
        </section>
      </div>
    </div>
  );
}

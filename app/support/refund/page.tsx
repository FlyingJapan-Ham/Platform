import Link from "next/link";

export default function RefundSupportPage() {
  return (
    <div className="border-b border-slate-800 bg-slate-950 py-16">
      <div className="container space-y-6">
        <h1 className="text-3xl font-bold text-white md:text-4xl">
          환불 & 취소 안내
        </h1>
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
            <h2 className="text-lg font-semibold text-blue-200">
              취소 정책
            </h2>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li>• 이용일 24시간 전까지 전액 환불</li>
              <li>• 이용일 당일 취소 시 기본 요금의 50% 환불</li>
              <li>• 노쇼는 전액 청구되니 꼭 취소 신청해주세요</li>
            </ul>
          </article>
          <article className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
            <h2 className="text-lg font-semibold text-blue-200">
              환불 절차
            </h2>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li>• 주문 조회 페이지에서 취소 요청</li>
              <li>• 3영업일 이내 결제 수단으로 환불</li>
              <li>• 해외 카드 환불은 카드사 처리 시간에 따라 지연될 수 있어요</li>
            </ul>
          </article>
        </div>
        <p className="text-xs text-slate-400">
          기타 문의는{" "}
          <Link
            href="/support"
            className="text-blue-300 underline-offset-2 hover:underline"
          >
            고객 지원 센터
          </Link>
          로 연락해주세요.
        </p>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function CheckoutPage() {
  return (
    <div className="border-b border-slate-800 bg-slate-950 py-16">
      <div className="container space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            결제 단계
          </h1>
          <p className="text-sm text-slate-300">
            예약한 상품과 픽업 정보를 다시 확인한 뒤 결제를 완료하세요.
          </p>
        </header>
        <section className="grid gap-6 md:grid-cols-[1.2fr,0.8fr] md:items-start">
          <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
            <h2 className="text-lg font-semibold text-white">주문 요약</h2>
            <p>선택한 상품은 장바구니에서 가져옵니다. 결제 단계에서 다시 수정할 수 있어요.</p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• 픽업시간은 이용일 하루 전에 다시 안내됩니다.</li>
              <li>• 결제 시스템은 PortOne을 통해 안전하게 처리됩니다.</li>
              <li>• 카드 결제 후 영수증은 이메일로 발송됩니다.</li>
            </ul>
          </div>
          <aside className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
            <h2 className="text-lg font-semibold text-white">다음 단계</h2>
            <p className="text-xs text-slate-400">
              결제를 진행하려면 데모 환경에서는 아래 버튼을 눌러 완료 페이지로 이동하세요.
            </p>
            <Link
              href="/account"
              className="inline-flex w-full items-center justify-center rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-400"
            >
              결제 완료 처리
            </Link>
            <Link
              href="/cart"
              className="inline-flex w-full items-center justify-center rounded-full border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 hover:border-blue-400"
            >
              장바구니로 돌아가기
            </Link>
          </aside>
        </section>
      </div>
    </div>
  );
}

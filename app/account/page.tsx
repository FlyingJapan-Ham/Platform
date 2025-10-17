import Link from "next/link";

const orders = [
  {
    id: "FJ-20241012-AB12",
    product: "USJ Wand + Power-Up Band 번들",
    status: "픽업 예정",
    pickupDate: "2025.02.14",
    returnDate: "2025.02.16",
  },
];

export default function AccountPage() {
  return (
    <div className="section-light py-16">
      <div className="container space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            내 예약 내역
          </h1>
          <p className="text-sm text-slate-600">
            로그인하면 예약 상태와 연체 알림, 반납 기록을 확인할 수 있어요.
          </p>
        </header>

        <section className="card-light text-sm text-slate-600">
          <h2 className="text-lg font-semibold text-slate-900">최근 예약</h2>
          <div className="mt-4 divide-y divide-slate-200">
            {orders.map((order) => (
              <div key={order.id} className="py-4">
                <p className="text-sm font-semibold text-blue-600">
                  {order.product}
                </p>
                <p className="text-xs text-slate-500">{order.id}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                  <span>상태: {order.status}</span>
                  <span>픽업: {order.pickupDate}</span>
                  <span>반납: {order.returnDate}</span>
                </div>
                <Link
                  href={`/lookup?code=${order.id}`}
                  className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-blue-600"
                >
                  주문 상세 보기 →
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="card-light text-sm text-slate-600">
            <h3 className="text-sm font-semibold text-blue-600">연체 기록</h3>
            <p className="mt-2 text-xs text-slate-500">
              현재 연체된 주문은 없습니다. 반납 일정이 다가오면 문자와 이메일로
              알림을 보내드려요.
            </p>
          </div>
          <div className="card-light text-sm text-slate-600">
            <h3 className="text-sm font-semibold text-blue-600">즐겨찾기</h3>
            <p className="mt-2 text-xs text-slate-500">
              관심 있는 제품을 하트로 저장하면 재고가 확보될 때 알림을 드립니다.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

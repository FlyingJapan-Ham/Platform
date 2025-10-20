const latePolicyItems = [
  {
    title: "연체 기준",
    description:
      "계약된 반납 시간 이후 1시간이 지나면 연체로 간주되며, 안내 문자를 통해 즉시 통보됩니다.",
  },
  {
    title: "연체 요금",
    description:
      "제품별로 설정된 연체 요금이 1일 단위로 부과됩니다. 예: Power-Up Band 1일 3,000원.",
  },
  {
    title: "연체 요금 결제",
    description:
      "등록된 결제 수단으로 자동 청구되며, 결제 실패 시 고객센터에서 별도 연락을 드립니다.",
  },
  {
    title: "장기 미반납",
    description:
      "반납 예정일로부터 7일이 지나면 분실 처리되며, 제품 가격이 청구될 수 있습니다.",
  },
];

export default function LatePolicyPage() {
  return (
    <div className="container space-y-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900">연체 요금 정책</h1>
      <p className="text-sm leading-relaxed text-slate-600">
        연체를 최소화하기 위해 반납 하루 전과 당일 오전에 문자 알림을 보내드려요.
      </p>
      <dl className="space-y-5 text-sm leading-relaxed text-slate-600">
        {latePolicyItems.map((item) => (
          <div key={item.title}>
            <dt className="font-semibold text-slate-900">{item.title}</dt>
            <dd className="mt-2 text-slate-600">{item.description}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs text-slate-400">
        정책 관련 문의는 support@flyingjapan.co 로 연락해주세요.
      </p>
    </div>
  );
}

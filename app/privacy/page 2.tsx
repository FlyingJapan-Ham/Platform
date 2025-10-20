const policies = [
  {
    title: "수집하는 개인정보",
    description:
      "이름, 연락처, 예약 정보, 결제 내역 등 서비스 제공에 필요한 최소한의 정보만 수집합니다.",
  },
  {
    title: "개인정보 이용 목적",
    description:
      "예약 확인, 고객 상담, 서비스 개선, 법령 준수 등의 목적으로 개인정보를 이용합니다.",
  },
  {
    title: "보유 및 이용 기간",
    description:
      "관련 법령이 정한 기간 동안 보관하며, 기간 종료 후에는 안전한 방법으로 파기합니다.",
  },
  {
    title: "개인정보 보호 책임자",
    description:
      "privacy@flyingjapan.co 로 문의하시면 48시간 이내 답변을 드립니다.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="container space-y-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900">
        개인정보 처리방침
      </h1>
      <p className="text-sm leading-relaxed text-slate-600">
        Flying Japan은 이용자의 개인정보를 안전하게 보호하기 위해 암호화와
        권한 제어를 적용하고 있습니다.
      </p>
      <dl className="space-y-5 text-sm leading-relaxed text-slate-600">
        {policies.map((item) => (
          <div key={item.title}>
            <dt className="font-semibold text-slate-900">{item.title}</dt>
            <dd className="mt-2 text-slate-600">{item.description}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs text-slate-400">
        공지 일자: 2025년 3월 1일. 변경 사항은 본 페이지를 통해 안내됩니다.
      </p>
    </div>
  );
}

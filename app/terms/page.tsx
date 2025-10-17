const terms = [
  {
    title: "제1조 (목적)",
    description:
      "이 약관은 Flying Japan(이하 '회사')이 제공하는 렌탈 서비스 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.",
  },
  {
    title: "제2조 (이용 계약의 성립)",
    description:
      "이용 계약은 이용자가 회사가 정한 절차에 따라 렌탈을 신청하고, 회사가 이를 승낙함으로써 성립합니다.",
  },
  {
    title: "제3조 (이용자의 의무)",
    description:
      "이용자는 렌탈한 제품을 선량한 관리자의 주의로 사용하고, 손상이나 분실 시 지체 없이 회사에 알립니다.",
  },
  {
    title: "제4조 (서비스 이용 제한)",
    description:
      "회사는 이용자가 약관을 위반하거나 서비스 운영을 방해하는 경우 사전 통지 후 이용 계약을 해지할 수 있습니다.",
  },
];

export default function TermsPage() {
  return (
    <div className="container space-y-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900">이용 약관</h1>
      <p className="text-sm leading-relaxed text-slate-600">
        최신 이용 약관은 정식 서비스 오픈 시 공지되며, 아래 내용은 베타
        운영을 위한 기본 안내입니다.
      </p>
      <dl className="space-y-5 text-sm leading-relaxed text-slate-600">
        {terms.map((item) => (
          <div key={item.title}>
            <dt className="font-semibold text-slate-900">{item.title}</dt>
            <dd className="mt-2 text-slate-600">{item.description}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs text-slate-400">
        2025년 3월 1일 베타 버전. 내용은 사전 고지 없이 변경될 수 있습니다.
      </p>
    </div>
  );
}

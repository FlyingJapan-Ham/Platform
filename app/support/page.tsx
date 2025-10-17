import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="border-b border-slate-800 bg-slate-950 py-16">
      <div className="container space-y-12">
        <section className="grid gap-10 md:grid-cols-[1.1fr,0.9fr] md:items-start">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-white md:text-4xl">
              Flying Japan 고객 지원 센터
            </h1>
            <p className="text-sm text-slate-300">
              예약 변경, 픽업/반납 문의, 파손 신고까지 언제든지 도와드릴게요.
              운영시간: 09:00 ~ 21:00 (JST)
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href="mailto:help@flyingjapan.com"
                className="rounded-3xl border border-slate-800 bg-slate-900/60 px-4 py-4 text-sm text-slate-300 transition hover:border-blue-500/40 hover:bg-slate-900/80"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">
                  이메일
                </p>
                help@flyingjapan.com
              </a>
              <a
                href="tel:+810000000000"
                className="rounded-3xl border border-slate-800 bg-slate-900/60 px-4 py-4 text-sm text-slate-300 transition hover:border-blue-500/40 hover:bg-slate-900/80"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">
                  전화
                </p>
                (+81) 00-0000-0000
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
            <p className="text-sm font-semibold text-blue-200">
              실시간 채팅
            </p>
            <p className="mt-2 text-xs text-slate-400">
              앱 또는 웹 하단의 채팅 버튼을 눌러 상담을 시작하세요. 평균 응답
              시간 2분 이내.
            </p>
            <div className="mt-6 rounded-2xl bg-slate-900/80 px-4 py-3 text-xs text-slate-400">
              운영시간 외에는 메시지를 남겨주시면 다음 영업일에 답변드립니다.
            </div>
            <Link
              href="/support/usj-guide"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-300"
            >
              USJ 이용 가이드 바로가기
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="transition hover:translate-x-1"
                aria-hidden
              >
                <path d="m6 4 4 4-4 4" />
              </svg>
            </Link>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            자주 묻는 질문
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                question: "픽업 시간을 변경하고 싶어요.",
                answer:
                  "예약 후 받은 확인 메일 또는 계정 페이지에서 최소 2시간 전까지 변경할 수 있습니다.",
              },
              {
                question: "반납 연장이 가능한가요?",
                answer:
                  "주문 조회 페이지에서 연장 신청 후 결제를 완료하면 추가 1일 단위로 이용할 수 있습니다.",
              },
              {
                question: "파손이 발생했을 때는?",
                answer:
                  "즉시 파손 신고 폼을 작성해주세요. 사진 업로드 후 전문 상담사가 대응 안내 드립니다.",
              },
              {
                question: "보증금이 따로 있나요?",
                answer:
                  "기본적으로 보증금은 없으며, 반납 후 이상이 있을 경우에만 추가로 연락드립니다.",
              },
            ].map((item) => (
              <div
                key={item.question}
                className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6"
              >
                <p className="text-sm font-semibold text-blue-200">
                  {item.question}
                </p>
                <p className="mt-2 text-sm text-slate-300">{item.answer}</p>
                <Link
                  href="/support/usj-guide"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-300"
                >
                  자세히 보기 →
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">
            빠른 신고 / 요청
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/damage-report"
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300 transition hover:border-blue-500/40 hover:bg-slate-900/80"
            >
              <p className="text-sm font-semibold text-blue-200">파손 신고</p>
              <p className="mt-2 text-xs text-slate-400">
                파손 사진과 상황을 업로드하면 전담팀이 바로 안내드립니다.
              </p>
            </Link>
            <Link
              href="/support/refund"
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300 transition hover:border-blue-500/40 hover:bg-slate-900/80"
            >
              <p className="text-sm font-semibold text-blue-200">환불 / 취소</p>
              <p className="mt-2 text-xs text-slate-400">
                이용일 24시간 전까지는 전액 환불이 가능합니다.
              </p>
            </Link>
            <Link
              href="/support/contact"
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300 transition hover:border-blue-500/40 hover:bg-slate-900/80"
            >
              <p className="text-sm font-semibold text-blue-200">기타 문의</p>
              <p className="mt-2 text-xs text-slate-400">
                단체 예약, 파트너십 관련 문의도 이 페이지에서 접수해주세요.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

import type { Route } from "next";

type TipCta =
  | {
      label: string;
      href: Route;
    }
  | {
      label: string;
      productSlug: string;
    };

export type UsjTip = {
  slug: string;
  title: string;
  readingTime: string;
  summary: string;
  sections: Array<{
    heading: string;
    description: string;
  }>;
  cta?: TipCta;
};

export const usjTips: UsjTip[] = [
  {
    slug: "power-up-band-guide",
    title: "Power-Up Band 200% 활용법",
    readingTime: "읽는 시간 3분",
    summary:
      "미션 루트 추천, 코인 모으기, 캐릭터 스탬프 동선까지 한 번에 정리했습니다.",
    sections: [
      {
        heading: "코인 모으기 루트",
        description:
          "입장 즉시 키노피오 하우스 → 쿠파 성 → 요시 어드벤처 순으로 이동하면 30분 내 최대 코인을 확보할 수 있어요.",
      },
      {
        heading: "스탬프 챌린지",
        description:
          "6개 스탬프를 모으면 스페셜 굿즈 교환권이 제공됩니다. 난이도 높은 스탬프는 점심 이후 줄이 짧아요.",
      },
      {
        heading: "앱 연동 팁",
        description:
          "Nintendo 앱에서 가족 계정을 생성해 코인을 합산하세요. 가족끼리 공유하면 보상 속도가 2배!",
      },
    ],
    cta: {
      label: "Power-Up Band 예약하기",
      productSlug: "mario-power-up-band",
    },
  },
  {
    slug: "interactive-wand-map",
    title: "인터랙티브 Wand 스팟 지도",
    readingTime: "읽는 시간 4분",
    summary:
      "마법을 성공시키는 자세와 음성 가이드, 포토 스팟까지 실시간 업데이트!",
    sections: [
      {
        heading: "필수 마법 스팟",
        description:
          "올리밴더 상점 앞, 거울 창문, Hogsmeade 입구를 먼저 방문해보세요. 오전엔 줄이 짧습니다.",
      },
      {
        heading: "포토 스팟",
        description:
          "호그와트 성 인근 포토존에서 Wand 사용 장면을 촬영하면 SNS 이벤트 응모가 가능해요.",
      },
      {
        heading: "실패 없이 성공하는 자세",
        description:
          "손목 스냅보다 팔 전체를 부드럽게 움직여주세요. Wand 내 센서는 궤적을 감지합니다.",
      },
    ],
    cta: {
      label: "Harry Potter Wand 예약하기",
      productSlug: "harry-potter-wand",
    },
  },
  {
    slug: "usj-day-checklist",
    title: "USJ 당일 방문 체크리스트",
    readingTime: "읽는 시간 2분",
    summary:
      "개장 전 준비물, 입장 동선, 인기 어트랙션 대기시간 공략을 모았습니다.",
    sections: [
      {
        heading: "입장 전 준비물",
        description:
          "전자티켓, 여권, Power-Up Band 예약 확인서를 준비해주세요. 외부 음식은 규정상 제한될 수 있습니다.",
      },
      {
        heading: "동선 추천",
        description:
          "입장 후 닌텐도 월드 → 미니언 파크 → 해리포터 존 순서로 이동하면 대기 시간을 분산할 수 있어요.",
      },
      {
        heading: "비상 시 연락",
        description:
          "입장 후 문제가 생기면 Flying Japan 고객센터(앱 채팅)로 연락하면 픽업 시간 조정이 가능합니다.",
      },
    ],
    cta: {
      label: "예약 일정 확인하기",
      href: "/book-now",
    },
  },
  {
    slug: "seasonal-itinerary-download",
    title: "USJ 시즌별 일정표 다운로드",
    readingTime: "다운로드 가이드",
    summary:
      "성수기 / 비수기별 추천 루트와 대기시간 가이드를 PDF로 제공합니다.",
    sections: [
      {
        heading: "PDF 다운로드 안내",
        description:
          "계정을 생성하고 로그인하면 시즌별 상세 일정표(PDF)를 이메일로 발송해드립니다.",
      },
      {
        heading: "업데이트 일정",
        description:
          "봄·여름·할로윈·겨울 시즌 정보는 각각 1개월 전에 업데이트됩니다.",
      },
    ],
    cta: {
      label: "계정 만들고 일정표 받기",
      href: "/account",
    },
  },
];

export function getUsjTipBySlug(slug: string): UsjTip | undefined {
  return usjTips.find((tip) => tip.slug === slug);
}

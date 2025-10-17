export type ProductBullet = {
  label: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: "usj" | "beauty";
  price: string;
  lateFee: string;
  basePriceValue: number;
  lateFeeValue: number;
  description: string;
  badges: string[];
  bullets: ProductBullet[];
  availability: string;
};

export const usjProducts: Product[] = [
  {
    id: "harry-wand",
    slug: "harry-potter-wand",
    name: "Harry Potter Interactive Wand",
    category: "usj",
    price: "3일 13,000원",
    lateFee: "추가 1일당 3,000원",
    basePriceValue: 13000,
    lateFeeValue: 3000,
    description:
      "USJ 마법 월드에서만 만날 수 있는 인터랙티브 지팡이. 모든 마법 스팟에서 바로 사용 가능합니다.",
    badges: ["USJ TOP1", "실시간 재고"],
    bullets: [
      { label: "난바 여행자센터 픽업 포함" },
      { label: "스팟 맵 QR 가이드 제공" },
      { label: "워런티 케이스 동봉" },
    ],
    availability: "120개 중 120개 사용 가능",
  },
  {
    id: "mario-band",
    slug: "mario-power-up-band",
    name: "Mario Power-Up Band",
    category: "usj",
    price: "3일 13,000원",
    lateFee: "추가 1일당 3,000원",
    basePriceValue: 13000,
    lateFeeValue: 3000,
    description:
      "슈퍼 닌텐도 월드에서 게임과 미션을 즐길 수 있는 필수 아이템. 가족 단위 방문자에게 가장 인기 있습니다.",
    badges: ["Family Pick", "미니게임 연동"],
    bullets: [
      { label: "프로필 세팅 지원" },
      { label: "코인 집계 앱 안내" },
      { label: "다회 방문 할인 쿠폰" },
    ],
    availability: "120개 중 110개 사용 가능",
    reviews: [
      {
        id: "rev-mario-1",
        author: "박지원",
        rating: 5,
        date: "2025-02-05",
        tripType: "친구",
        content:
          "줄 서서 구매할 필요 없이 바로 픽업해서 좋았어요. 게임 연동 안내가 있어 초보도 어렵지 않았습니다.",
      },
      {
        id: "rev-mario-2",
        author: "정해린",
        rating: 4,
        date: "2024-11-18",
        tripType: "가족",
        content:
          "밴드 상태가 아주 깨끗했고 아이들이 정말 즐거워했어요. 반납 문자까지 챙겨줘서 안심됐습니다.",
      },
    ],
  },
  {
    id: "usj-bundle",
    slug: "usj-bundle-set",
    name: "USJ Wand + Power-Up Band 번들",
    category: "usj",
    price: "3일 24,000원",
    lateFee: "추가 1일당 5,000원",
    basePriceValue: 24000,
    lateFeeValue: 5000,
    description:
      "지팡이와 파워업 밴드를 함께 렌탈하면 10% 할인! 인기 아이템을 한번에 예약하세요.",
    badges: ["Bundle Deal", "10% OFF"],
    bullets: [
      { label: "공동 픽업/반납" },
      { label: "추가 굿즈 5% 할인 쿠폰" },
      { label: "연장 시 동일 할인 유지" },
    ],
    availability: "90개 중 72개 사용 가능",
  },
];

export const beautyProducts: Product[] = [
  {
    id: "dyson-airwrap",
    slug: "dyson-airwrap",
    name: "Dyson Airwrap Multi-Styler (Japan 100V)",
    category: "beauty",
    price: "3일 40,000원",
    lateFee: "추가 1일당 6,000원",
    basePriceValue: 40000,
    lateFeeValue: 6000,
    description:
      "여행 중에도 완벽한 스타일링을 도와주는 멀티 헤어 디바이스. 일본 100V 전압 호환 버전으로 안전하게 사용하세요.",
    badges: ["뷰티 베스트", "100V 호환"],
    bullets: [
      { label: "필수 어댑터 포함" },
      { label: "멀티 브러시 6종 세트" },
      { label: "살균 보관 파우치 제공" },
    ],
    availability: "45개 중 38개 사용 가능",
  },
  {
    id: "refa-iron",
    slug: "refa-straight-iron",
    name: "ReFa 스트레이트 아이론",
    category: "beauty",
    price: "3일 30,000원",
    lateFee: "추가 1일당 6,000원",
    basePriceValue: 30000,
    lateFeeValue: 6000,
    description:
      "휴대성이 뛰어난 프리미엄 스트레이트 아이론. 촬영, 이벤트, 웨딩 출장에 맞춤 추천 제품입니다.",
    badges: ["Lightweight", "여행 추천"],
    bullets: [
      { label: "열 보호 매트 포함" },
      { label: "퀵 가이드 제공" },
      { label: "난바 여행자센터 픽업 전용" },
    ],
    availability: "30개 중 24개 사용 가능",
  },
  {
    id: "trike-dryer",
    slug: "trike-hair-dryer",
    name: "Trike Hair Dryer (Premium Edition)",
    category: "beauty",
    price: "3일 30,000원",
    lateFee: "추가 1일당 6,000원",
    basePriceValue: 30000,
    lateFeeValue: 6000,
    description:
      "여행 중에도 살롱급 드라이를 위한 프리미엄 헤어드라이어. 샤크·T3 유사 스펙으로 고속 건조를 지원합니다.",
    badges: ["High Speed", "살롱 퀄리티"],
    bullets: [
      { label: "노즐 3종 제공" },
      { label: "1200W 출력" },
      { label: "일본 규격 플러그" },
    ],
    availability: "28개 중 18개 사용 가능",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return [...usjProducts, ...beautyProducts].find(
    (product) => product.slug === slug,
  );
}

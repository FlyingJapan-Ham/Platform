import { getProductName, productReviews } from "./reviews";

export const heroStocks = [
  { name: "Harry Potter Wand", current: 120, total: 120 },
  { name: "Mario Power-Up Band", current: 110, total: 120 },
  { name: "Dyson Airwrap", current: 38, total: 45 },
  { name: "ReFa 스트레이트 아이론", current: 24, total: 30 },
];

export const homeCategories = [
  {
    title: "USJ Attractions",
    description:
      "Power-Up Band, Harry Potter Wand, 파크 지도 픽업까지 한 번에.",
    href: "/usj",
    badge: "재고 200+",
    priceLabel: "3일 13,000원~",
    image: "/images/placeholder/usj-band.png",
  },
  {
    title: "Beauty & Hair Tools",
    description: "Dyson · ReFa · Trike 100V 호환. 난바 여행자센터 픽업 전용.",
    href: "/beauty",
    badge: "전압 100V",
    priceLabel: "3일 30,000원~",
    image: "/images/placeholder/dyson-airwrap.png",
  },
  {
    title: "USJ Tips",
    description: "Power-Up Band 사용법, 마법 스팟 공략, 반납팁 콘텐츠.",
    href: "/usj-tips",
    badge: "SEO",
    priceLabel: "가이드 무료",
    image: "/images/placeholder/usj-map.png",
  },
];

export const calculatorProducts = [
  {
    id: "usj-wand",
    slug: "harry-potter-wand",
    name: "Harry Potter Wand",
    basePrice: 13000,
    lateFee: 3000,
  },
  {
    id: "usj-mario-band",
    slug: "mario-power-up-band",
    name: "Mario Power-Up Band",
    basePrice: 13000,
    lateFee: 3000,
  },
  {
    id: "dyson-airwrap",
    slug: "dyson-airwrap",
    name: "Dyson Airwrap",
    basePrice: 40000,
    lateFee: 6000,
  },
  {
    id: "trike-dryer",
    slug: "trike-hair-dryer",
    name: "Trike Hair Dryer",
    basePrice: 30000,
    lateFee: 6000,
  },
];

export const inventoryHighlights = [
  {
    title: "픽업부터 반납까지 간편하게",
    description:
      "Flying Japan 난바 여행자센터 단일 거점에서 픽업과 반납을 진행합니다.",
    metrics: ["난바 센터 픽업", "현장 즉시 반납"],
  },
  {
    title: "연체 걱정 없는 알림",
    description:
      "반납 하루 전·당일에 문자 알림을 보내 연체비용 부담을 최소화합니다.",
    metrics: ["D-1, D-day 알림", "연장 옵션 안내"],
  },
  {
    title: "제품 상태 보증",
    description:
      "렌탈 전후 체크리스트로 깨끗하게 관리하고, 기본 소모품은 무료 제공해요.",
    metrics: ["살균/클리닝 완료", "예비 부품 제공"],
  },
];

export const customerReviews = productReviews
  .filter((review) => review.status === "PUBLISHED")
  .slice(0, 3)
  .map((review) => ({
    id: review.id,
    title: `${getProductName(review.productSlug)} 이용 후기`,
    content: review.content,
    author: review.author,
  }));

export const featuredProducts = [
  {
    id: "feature-wand",
    name: "Harry Potter Interactive Wand",
    price: "3일 13,000원",
    badge: "USJ TOP1",
    href: "/products/harry-potter-wand",
  },
  {
    id: "feature-band",
    name: "Mario Power-Up Band",
    price: "3일 13,000원",
    badge: "USJ 인기",
    href: "/products/mario-power-up-band",
  },
  {
    id: "feature-dyson",
    name: "Dyson Airwrap Multi-Styler",
    price: "3일 40,000원",
    badge: "뷰티 베스트",
    href: "/products/dyson-airwrap",
  },
  {
    id: "feature-refa",
    name: "ReFa 스트레이트 아이론",
    price: "3일 30,000원",
    badge: "100V 호환",
    href: "/products/refa-straight-iron",
  },
];

import type { Product } from "./catalog";
import { beautyProducts, usjProducts } from "./catalog";

export type ReviewStatus = "PUBLISHED" | "HIDDEN" | "PENDING";

export type ReviewResponse = {
  author: string;
  content: string;
  createdAt: string;
};

export type ProductReview = {
  id: string;
  productSlug: Product["slug"];
  author: string;
  rating: number;
  tripType?: string;
  content: string;
  createdAt: string;
  status: ReviewStatus;
  response?: ReviewResponse;
  orderId?: string;
};

export const productReviews: ProductReview[] = [
  {
    id: "REV-0001",
    productSlug: "harry-potter-wand",
    author: "김민지 · 가족여행",
    rating: 5,
    tripType: "가족여행",
    content:
      "아이들이 마법사 체험을 제대로 즐겼어요. 픽업도 5분이면 끝나고 반납 안내가 친절했습니다.",
    createdAt: "2025-01-22 14:10",
    status: "PUBLISHED",
    response: {
      author: "Flying Japan CS",
      content:
        "즐거운 여행 되셨다니 기쁩니다! 다음 방문 시 사용할 추가 쿠폰도 이메일로 발송해드렸어요.",
      createdAt: "2025-01-23 09:05",
    },
    orderId: "ORD-10452",
  },
  {
    id: "REV-0002",
    productSlug: "harry-potter-wand",
    author: "이수현 · 커플여행",
    rating: 4,
    tripType: "커플",
    content:
      "현장가보다 훨씬 저렴했고 지팡이 상태도 새것 같았습니다. 예약 두 번째인데 역시 만족!",
    createdAt: "2024-12-02 18:35",
    status: "PUBLISHED",
  },
  {
    id: "REV-0003",
    productSlug: "mario-power-up-band",
    author: "박지원 · 친구여행",
    rating: 5,
    tripType: "친구여행",
    content:
      "줄 서서 구매할 필요 없이 바로 픽업해서 좋았어요. 게임 연동 안내가 있어 초보도 어렵지 않았습니다.",
    createdAt: "2025-02-05 11:12",
    status: "PUBLISHED",
    response: {
      author: "Flying Japan CS",
      content:
        "연동 가이드가 도움이 되었다니 다행이에요. 다음 방문 때 사용 가능한 멤버십 포인트도 추가해드렸습니다.",
      createdAt: "2025-02-05 15:22",
    },
    orderId: "ORD-10422",
  },
  {
    id: "REV-0004",
    productSlug: "mario-power-up-band",
    author: "정해린 · 가족여행",
    rating: 4,
    tripType: "가족여행",
    content:
      "밴드 상태가 아주 깨끗했고 아이들이 정말 즐거워했어요. 반납 문자까지 챙겨줘서 안심됐습니다.",
    createdAt: "2024-11-18 09:45",
    status: "PUBLISHED",
  },
  {
    id: "REV-0005",
    productSlug: "dyson-airwrap",
    author: "서유진 · 커플여행",
    rating: 5,
    tripType: "커플여행",
    content:
      "숙소에서도 살롱 퀄리티 스타일링이 가능했어요. 100V 버전이라 변압기 걱정 없고 살균 포장도 마음에 들었습니다.",
    createdAt: "2025-02-01 08:20",
    status: "PUBLISHED",
    orderId: "ORD-10418",
  },
  {
    id: "REV-0006",
    productSlug: "dyson-airwrap",
    author: "박소연 · 친구여행",
    rating: 4,
    tripType: "친구여행",
    content:
      "브러시 구성이 다양해서 여러 스타일로 연출할 수 있었어요. 픽업 위치도 안내가 잘 되어 있었습니다.",
    createdAt: "2024-11-10 19:05",
    status: "PENDING",
  },
  {
    id: "REV-0007",
    productSlug: "refa-straight-iron",
    author: "이서현 · 출장",
    rating: 5,
    tripType: "출장",
    content:
      "출장 일정 내내 유용했습니다. 가볍고 온도 조절이 쉬워서 만족도가 높았어요.",
    createdAt: "2025-01-28 21:10",
    status: "PUBLISHED",
    response: {
      author: "Flying Japan CS",
      content: "출장 응원합니다! 필요한 액세서리가 있다면 언제든 문의 주세요.",
      createdAt: "2025-01-29 10:18",
    },
  },
  {
    id: "REV-0008",
    productSlug: "trike-hair-dryer",
    author: "한수빈 · 가족여행",
    rating: 5,
    tripType: "가족여행",
    content:
      "호텔 드라이기보다 훨씬 강력해서 머리 말리는 시간이 확 줄었어요. 가족 모두 만족했습니다.",
    createdAt: "2025-02-03 16:05",
    status: "PUBLISHED",
  },
  {
    id: "REV-0009",
    productSlug: "usj-bundle-set",
    author: "최다은 · 가족여행",
    rating: 5,
    tripType: "가족여행",
    content:
      "번들로 예약하니 할인도 되고 준비물이 한 번에 해결됐어요. 픽업 속도도 빨라서 다음에도 이용할 예정입니다.",
    createdAt: "2025-01-12 13:55",
    status: "PUBLISHED",
  },
  {
    id: "REV-0010",
    productSlug: "usj-bundle-set",
    author: "윤호진 · 커플여행",
    rating: 3,
    tripType: "커플여행",
    content:
      "번들은 좋았지만 예약 시간대를 바꾸고 싶은데 페이지에서 잘 보이지 않았어요.",
    createdAt: "2024-10-03 18:42",
    status: "PENDING",
  },
  {
    id: "REV-0011",
    productSlug: "trike-hair-dryer",
    author: "정예린 · 친구여행",
    rating: 4,
    tripType: "친구여행",
    content:
      "살롱급 바람이라 여행 사진 퀄리티가 달라졌어요. 반납 체크도 간단해서 스트레스 없었습니다.",
    createdAt: "2024-11-05 12:25",
    status: "PUBLISHED",
  },
];

export function getReviewsByProductSlug(slug: Product["slug"]) {
  return productReviews.filter(
    (review) => review.productSlug === slug && review.status === "PUBLISHED",
  );
}

export function getAllReviews() {
  return productReviews;
}

export function getProductName(slug: Product["slug"]) {
  const product = [...usjProducts, ...beautyProducts].find(
    (item) => item.slug === slug,
  );
  return product?.name ?? slug;
}

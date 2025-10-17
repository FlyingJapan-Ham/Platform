# Flying Japan 사이트 페이지 구성 및 메뉴 고도화 제안

Flying Japan의 핵심 비즈니스(USJ Mario Power-Up Band, Harry Potter Wand 중심의 테마파크 아이템 렌탈 + Dyson/ReFa/Trike 헤어 케어 기기 렌탈)를 중심으로 한 맞춤형 사이트 개편 제안이다. 고객 여정은 **상품 탐색 → 재고 확인 → 홀드/예약 → 결제 → 반납/사후 관리**로 설계하며, Next.js 기반 애플리케이션과 Prisma/Redis/BullMQ 등 기존 스택을 활용해 운영 최적화까지 고려한다.

## 1. 메인 메뉴 구조

| 메뉴 | 주요 내용 | 핵심 CTA / 기능 |
| --- | --- | --- |
| Home | USJ 프로모션, 재고 하이라이트, 가격 계산 미리보기, 리뷰 | `USJ 방문자 필수! 3일 13,000원`, 카테고리 탭, 계산기 CTA |
| USJ Attractions | Mario Power-Up Band, Harry Potter Wand 전용 목록 | 실시간 재고 바, USJ 지도 픽업, 번들 할인 |
| Beauty & Hair Tools | Dyson/ReFa/Trike 렌탈 기기 | 브랜드/전압 필터, 비교 표, 난바 여행자센터 픽업 안내 |
| Book Now | 날짜·수량 기반 예약/가격 계산 | React Hook Form 계산기, 가용성, 홀드 버튼 |
| Order Lookup | 주문/연체 상태 조회 | BullMQ D+1 SMS 안내, 연체 수수료 경고 |
| Support | USJ 가이드, FAQ, 파손 신고 | 인터랙티브 지도, 파손 신고 폼 |
| USJ Tips | 블로그/가이드 콘텐츠 | Power-Up Band 사용법, SEO 키워드 |
| Account | 회원 주문 내역, 연체 히스토리 | 로그인/게스트 조회, 알림 설정 |
| (Global) Search & Cart | 제품 검색, 장바구니 상태 | `Dyson 에어랩` 즉시 검색, 미니카트 |

모바일 전환 시 상단 검색 바로 고정하고, USJ 지도(픽업 포인트) 연동을 강조한다.

## 2. 주요 페이지 구성

| 경로 | 핵심 컴포넌트 | 연계 API/서비스 | 최적화 포인트 |
| --- | --- | --- | --- |
| `/` | USJ 히어로 배너, 카테고리 탭, 가격 계산 프리뷰, 리뷰 캐러셀 | `GET /products/availability`, BullMQ 리마인더 팝업 | “공원 구매 대신 렌탈” 메시지, 재고 요약 (Wand 120/120 등) |
| `/usj` | 제품 그리드, 재고 상태 바, USJ 지도 | `GET /products?category=usj`, Redis 실시간 재고 | 번들 할인 제안, Power-Up Band 기능 소개 |
| `/beauty` | 브랜드/가격 필터, Dyson vs. ReFa 비교 표 | `GET /products?category=beauty` | 100V 전압 강조, TikTok 후기 블록 |
| `/products/[id]` | 이미지 갤러리, 가용성 폼, 가격 구조(기본 3일 + 연체) | `GET /products/:id/availability`, `POST /checkout/hold`, `packages/core/pricing` | Penalty(USJ 3k/day, Dyson/Trike 6k/day) 노출, 대기 알림 |
| `/checkout` | 장바구니 요약, 연체 동의, 픽업/배송 옵션, PortOne 결제 | `POST /checkout/hold`, Redis 락, 비회원 SMS 인증 | 연체 자동 계산, “반납 시 검사” 안내 |
| `/lookup` | 주문 상태 타임라인, 연체 알림, 파손 신고 CTA | `GET /lookups/:code`, BullMQ D+1 알림 | 연체율 모니터링, 알림 재전송 |
| `/support/usj-guide` | USJ 이용 가이드, 마법 스팟 지도, FAQ | 정적/SSR 콘텐츠, SEO 메타 | “USJ Power-Up Band 렌탈” 키워드 |
| `/admin/inventory` | 재고 테이블(ID, Status, RegistrationDate, DamageStatus, ProfitLoss), 차트 | `GET /admin/inventory` (Prisma) | 개별 단위 수익 관리, 손실률 그래프 |
| `/admin/reports` | 수익/손실 대시보드, CSV Export | Prisma Raw Query (GROUP BY productId) | 월별/아이템별 필터, Wand 손실률 >5% 알람 |
| `/usj-bundle` | Band + Wand 번들 재고/할인 | 번들 재고 API | 번들 예약 촉진 |
| `/damage-report` | 파손 신고 폼 → 상태 업데이트 | `POST /admin/units/:id/update-damage` | BullMQ 손실 리포트 큐 |

## 3. 가격 구조 & 고객 여정

- **기본 정책**: 기본 3일 요금 + 추가일/연체 패널티 (USJ 3k/day, Dyson 6k/day, Trike 6k/day).  
- **가격 계산기**: React Hook Form + `POST /pricing/calculate` API. 입력: `productId`, `days`, `quantity`.  
- **고객 여정 단계**  
  1. 제품 선택 → 실시간 재고/가격 미리보기  
  2. 홀드/예약 → Redis 락 + PortOne 결제  
  3. 반납 → 상태 업데이트 (RETURNING → CLEANING → AVAILABLE), 손상 여부 기록  
  4. 사후 알림 → BullMQ D+1 연체 SMS, D+2 추가 알림 옵션  

재고 부족 시 대기 알림 등록(이메일/SMS) 기능을 제공한다.

## 4. 데이터베이스 및 백엔드 확장

### Prisma 모델 확장

```prisma
model InventoryUnit {
  id               String        @id @default(cuid())
  productId        String
  status           Status
  registrationDate DateTime
  damageStatus     DamageStatus? // NONE, DAMAGED, LOST
  profitLoss       Float?
  // ... existing fields
}

enum DamageStatus {
  NONE
  DAMAGED
  LOST
}
```

- 마이그레이션: `pnpm db:push` 실행 후 기존 데이터 `registrationDate`, `damageStatus`, `profitLoss` 백필.  
- 트랜잭션: 상태 변경 시 `profitLoss` 계산 (렌탈 수익 – 패널티 – 수리 비용).  
- `packages/core/services/inventory`에 관련 로직 추가.

### API 확장

- `GET /admin/units/:id` : 개별 재고 단위 상세 조회 (파손 여부, 등록일, 누적 수익).  
- `POST /admin/units/:id/update-damage` : 파손/분실 등록 → BullMQ 큐로 손실 리포트.  
- `POST /pricing/calculate` : 가격 계산 엔드포인트, 프런트와 체크아웃 모두 공유.  

### 재고/알림

- Redis 캐시: `stock:${productId}` 구조. 재고 < 20개 시 운영자 이메일/SMS.  
- USJ 번들 재고 = Band & Wand 중 최소값 기준.  
- BullMQ 워커: 연체 알림(D+1), 파손 보고서 처리, 저재고 알림 큐.

## 5. UI/UX & 마케팅 포인트

- **USJ 랜딩**: 히어로 배너(“USJ 방문자 필수!”), 테마파크 아이템 중심, 공원 내 구매 대비 렌탈 비용 비교(3,200~5,500 JPY vs. 13,000 KRW/3일).  
- **Beauty & Hair**: 일본 전압 100V 호환 강조, 여행 중 뷰티 케어 포지셔닝, 난바 여행자센터 픽업 안내 이미지.  
- **가격 슬라이더**: 3일 기본에서 일수 조정 시 즉시 총액/연체 예상 표시.  
- **리뷰/추천**: Power-Up Band 경험담, Dyson 스타일링 후기, TikTok/UCG 임베드.  
- **SEO**: “USJ Power-Up Band 렌탈”, “USJ Harry Potter Wand 대여”, “일본 여행 헤어 기기 렌탈” 키워드 중심 콘텐츠.  
- **프로모션**: 성수기(여름/휴가) 할인 배너, 번들 할인, 연장 시 패널티 절감 쿠폰.  

## 6. 운영 및 인프라 고려 사항

- **Supabase Read Replicas**: 재고/보고서 조회 증가 대비 읽기 부하 분산.  
- **테스트/모니터링**: 주문/연체 플로우에 e2e 테스트 추가, 손실률 >5% 알람 Slack 통합.  
- **반납 워크플로우**: `RETURNING → CLEANING → AVAILABLE` 단계에서 파손 검사, `damageStatus` 업데이트.  
- **ROI 측정**: `profitLoss` 기준 손실률 차트, 파손/분실 비용 추적 → Admin 대시보드에서 확인.  

---

이 구성안을 기반으로 페이지별 컴포넌트 설계 → API/DB 확장 → UI 시안 → 개발/테스트 순으로 단계적 구현을 진행한다.

## 구현 진행 현황

- `app/layout.tsx`, `components/site/*` : 글로벌 레이아웃과 네비게이션/푸터 스캐폴딩 완료.  
- `app/page.tsx` : 홈 랜딩 페이지 UI 섹션(히어로, 카테고리, 가격 계산 프리뷰, 재고/운영 하이라이트, 리뷰) 초안 구현.  
- `data/home.ts` : USJ/뷰티 제품, 재고, 리뷰 등 프런트 모킹 데이터 정리.  
- `/usj`, `/beauty`, `/products/[id]`, `/checkout`, `/lookup` 등 주요 경로에 대한 UI 시나리오 초안 및 링크 연동 완료.  
- 장바구니/예약/주문 조회/파손 신고 등 주요 버튼은 Next.js router로 연결되어 기본 동선 검증 가능.  
- `/admin`, `/admin/inventory`, `/admin/reports` 백오피스 라우트 초안과 사이드바 네비게이션 구축.  
- `data/admin.ts`, `components/admin/*` 로 운영 지표/재고 데이터 모킹 및 필터 가능한 재고 테이블 구현.

### 개발 환경

- Next.js 14 + Tailwind + TypeScript 스캐폴딩 완료.  
- Prisma + SQLite 구성 (`.env` 에 `DATABASE_URL="file:./prisma/dev.db"`).  
- 명령어: `pnpm install`, `pnpm db:push`, `pnpm dev`, `pnpm db:studio`.

export type InventoryUnitRecord = {
  id: string;
  productName: string;
  productSlug: string;
  status: "AVAILABLE" | "RENTED" | "CLEANING" | "RETURNING" | "LOST";
  damageStatus: "NONE" | "DAMAGED" | "LOST";
  registrationDate: string;
  lastActivity: string;
  profitLoss: number;
};

export type AdminSummaryCard = {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "steady";
};

export type OrderItemSummary = {
  name: string;
  productSlug: string;
  quantity: number;
  unitId?: string;
};

export type AdminOrderRecord = {
  id: string;
  customerName: string;
  email: string;
  items: OrderItemSummary[];
  orderDate: string;
  dueDate: string;
  returnDate?: string;
  paymentDate?: string;
  status: "IN_PROGRESS" | "COMPLETED" | "OVERDUE";
  totalAmount: number;
  notes?: string;
};

export const adminSummaryCards: AdminSummaryCard[] = [
  {
    title: "이번 달 총 렌탈 수익",
    value: "₩8,450,000",
    change: "+12.4% vs 지난달",
    trend: "up",
  },
  {
    title: "USJ 번들 예약률",
    value: "68%",
    change: "+6.2% QoQ",
    trend: "up",
  },
  {
    title: "연체 비율",
    value: "3.1%",
    change: "-0.8% vs 지난주",
    trend: "down",
  },
  {
    title: "파손/분실 케이스",
    value: "4건",
    change: "+1 신규 접수",
    trend: "steady",
  },
];

export const adminOrders: AdminOrderRecord[] = [
  {
    id: "ORD-10452",
    customerName: "김민지",
    email: "minji.kim@example.com",
    items: [
      {
        name: "Harry Potter Interactive Wand",
        productSlug: "harry-potter-wand",
        quantity: 1,
        unitId: "INV-0001",
      },
      {
        name: "Mario Power-Up Band",
        productSlug: "mario-power-up-band",
        quantity: 1,
        unitId: "INV-0125",
      },
    ],
    orderDate: "2025-02-08 09:15",
    dueDate: "2025-02-12",
    paymentDate: "2025-02-08 10:05",
    status: "IN_PROGRESS",
    totalAmount: 198000,
  },
  {
    id: "ORD-10448",
    customerName: "박지수",
    email: "jisoo.park@example.com",
    items: [
      {
        name: "Dyson Airwrap Multi-Styler",
        productSlug: "dyson-airwrap",
        quantity: 1,
        unitId: "INV-0301",
      },
    ],
    orderDate: "2025-02-06 08:45",
    dueDate: "2025-02-10",
    paymentDate: "2025-02-06 09:20",
    status: "OVERDUE",
    totalAmount: 154000,
    notes: "고객과 2차 연락 예정",
  },
  {
    id: "ORD-10441",
    customerName: "오세훈",
    email: "sehoon.oh@example.com",
    items: [
      {
        name: "USJ Wand + Power-Up Band 번들",
        productSlug: "usj-bundle-set",
        quantity: 2,
      },
      {
        name: "Trike Hair Dryer (Premium Edition)",
        productSlug: "trike-hair-dryer",
        quantity: 1,
        unitId: "INV-0513",
      },
    ],
    orderDate: "2025-02-02 12:10",
    dueDate: "2025-02-08",
    returnDate: "2025-02-07",
    paymentDate: "2025-02-02 13:40",
    status: "COMPLETED",
    totalAmount: 342000,
  },
  {
    id: "ORD-10435",
    customerName: "최다은",
    email: "daeun.choi@example.com",
    items: [
      {
        name: "ReFa 스트레이트 아이론",
        productSlug: "refa-straight-iron",
        quantity: 1,
        unitId: "INV-0458",
      },
    ],
    orderDate: "2025-01-30 07:55",
    dueDate: "2025-02-05",
    paymentDate: "2025-01-30 08:55",
    status: "OVERDUE",
    totalAmount: 98000,
    notes: "연체료 12,000원 부과됨",
  },
  {
    id: "ORD-10422",
    customerName: "한유진",
    email: "yujin.han@example.com",
    items: [
      {
        name: "Mario Power-Up Band",
        productSlug: "mario-power-up-band",
        quantity: 1,
        unitId: "INV-0182",
      },
      {
        name: "Harry Potter Interactive Wand",
        productSlug: "harry-potter-wand",
        quantity: 1,
        unitId: "INV-0002",
      },
    ],
    orderDate: "2025-01-25 10:35",
    dueDate: "2025-01-31",
    returnDate: "2025-01-31",
    paymentDate: "2025-01-25 11:10",
    status: "COMPLETED",
    totalAmount: 189000,
  },
  {
    id: "ORD-10418",
    customerName: "이수연",
    email: "suyeon.lee@example.com",
    items: [
      {
        name: "Dyson Airwrap Multi-Styler",
        productSlug: "dyson-airwrap",
        quantity: 1,
        unitId: "INV-0301",
      },
      {
        name: "Trike Hair Dryer (Premium Edition)",
        productSlug: "trike-hair-dryer",
        quantity: 1,
        unitId: "INV-0502",
      },
    ],
    orderDate: "2025-01-22 14:05",
    dueDate: "2025-01-28",
    returnDate: "2025-01-27",
    paymentDate: "2025-01-22 15:25",
    status: "COMPLETED",
    totalAmount: 298000,
  },
];

export const inventoryUnits: InventoryUnitRecord[] = [
  {
    id: "INV-0001",
    productName: "Harry Potter Interactive Wand",
    productSlug: "harry-potter-wand",
    status: "RENTED",
    damageStatus: "NONE",
    registrationDate: "2024-08-12",
    lastActivity: "2025-02-10 11:20",
    profitLoss: 87000,
  },
  {
    id: "INV-0002",
    productName: "Harry Potter Interactive Wand",
    productSlug: "harry-potter-wand",
    status: "AVAILABLE",
    damageStatus: "NONE",
    registrationDate: "2024-09-01",
    lastActivity: "2025-02-09 18:05",
    profitLoss: 94000,
  },
  {
    id: "INV-0125",
    productName: "Mario Power-Up Band",
    productSlug: "mario-power-up-band",
    status: "RETURNING",
    damageStatus: "NONE",
    registrationDate: "2024-07-21",
    lastActivity: "2025-02-10 08:10",
    profitLoss: 112000,
  },
  {
    id: "INV-0182",
    productName: "Mario Power-Up Band",
    productSlug: "mario-power-up-band",
    status: "CLEANING",
    damageStatus: "DAMAGED",
    registrationDate: "2024-06-30",
    lastActivity: "2025-02-09 21:30",
    profitLoss: 56000,
  },
  {
    id: "INV-0301",
    productName: "Dyson Airwrap Multi-Styler",
    productSlug: "dyson-airwrap",
    status: "RENTED",
    damageStatus: "NONE",
    registrationDate: "2024-10-04",
    lastActivity: "2025-02-10 10:00",
    profitLoss: 264000,
  },
  {
    id: "INV-0310",
    productName: "Dyson Airwrap Multi-Styler",
    productSlug: "dyson-airwrap",
    status: "AVAILABLE",
    damageStatus: "NONE",
    registrationDate: "2024-11-18",
    lastActivity: "2025-02-08 14:45",
    profitLoss: 164000,
  },
  {
    id: "INV-0458",
    productName: "ReFa 스트레이트 아이론",
    productSlug: "refa-straight-iron",
    status: "RENTED",
    damageStatus: "NONE",
    registrationDate: "2024-05-12",
    lastActivity: "2025-02-10 09:50",
    profitLoss: 78000,
  },
  {
    id: "INV-0502",
    productName: "Trike Hair Dryer (Premium Edition)",
    productSlug: "trike-hair-dryer",
    status: "AVAILABLE",
    damageStatus: "NONE",
    registrationDate: "2024-09-28",
    lastActivity: "2025-02-07 19:20",
    profitLoss: 42000,
  },
  {
    id: "INV-0513",
    productName: "Trike Hair Dryer (Premium Edition)",
    productSlug: "trike-hair-dryer",
    status: "RENTED",
    damageStatus: "NONE",
    registrationDate: "2024-09-28",
    lastActivity: "2025-02-10 07:55",
    profitLoss: 62000,
  },
  {
    id: "INV-0607",
    productName: "USJ Wand + Power-Up Band 번들",
    productSlug: "usj-bundle-set",
    status: "LOST",
    damageStatus: "LOST",
    registrationDate: "2024-03-19",
    lastActivity: "2025-02-06 16:40",
    profitLoss: -45000,
  },
];

export const reportMetrics = [
  {
    title: "카테고리별 수익",
    entries: [
      { label: "USJ Attractions", value: "₩5,820,000" },
      { label: "Beauty & Hair", value: "₩2,630,000" },
    ],
  },
  {
    title: "파손/분실 손실",
    entries: [
      { label: "Wand", value: "₩-120,000" },
      { label: "Power-Up Band", value: "₩-60,000" },
      { label: "Dyson Airwrap", value: "₩0" },
    ],
  },
  {
    title: "연체 발생 TOP",
    entries: [
      { label: "Mario Power-Up Band", value: "연체율 4.2%" },
      { label: "USJ 번들", value: "연체율 3.8%" },
    ],
  },
];

export const monthlyRevenue = [
  { month: "2024-09", value: 6200000 },
  { month: "2024-10", value: 6800000 },
  { month: "2024-11", value: 7100000 },
  { month: "2024-12", value: 7600000 },
  { month: "2025-01", value: 8050000 },
  { month: "2025-02", value: 8450000 },
];

"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";

import type { AdminOrderRecord } from "../../../data/admin";
import { adminOrders, inventoryUnits } from "../../../data/admin";
import { beautyProducts, usjProducts } from "../../../data/catalog";

type CalendarDay = {
  date: Date;
  inCurrentMonth: boolean;
  orders: AdminOrderRecord[];
};

const statusLabelMap = {
  IN_PROGRESS: "대여 진행",
  COMPLETED: "반납 완료",
  OVERDUE: "연체",
} as const;

const statusBadgeTone = {
  IN_PROGRESS: "bg-blue-500/20 text-blue-200",
  COMPLETED: "bg-emerald-500/20 text-emerald-200",
  OVERDUE: "bg-rose-500/20 text-rose-200",
} as const;

const statusFilterOptions: Array<{
  label: string;
  value: AdminOrderRecord["status"] | "ALL";
}> = [
  { label: "전체", value: "ALL" },
  { label: "대여 진행", value: "IN_PROGRESS" },
  { label: "반납 완료", value: "COMPLETED" },
  { label: "연체", value: "OVERDUE" },
];

function normalizeDateString(value: string) {
  if (value.includes("T")) return value;
  if (value.includes(" ")) return value.replace(" ", "T");
  return `${value}T00:00:00`;
}

function parseDate(dateString: string | undefined) {
  if (!dateString) return null;
  const date = new Date(normalizeDateString(dateString));
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

function buildCalendarDays(
  orders: AdminOrderRecord[],
  year: number,
  month: number,
): CalendarDay[] {
  const days: CalendarDay[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const leadingDays = firstDay.getDay();
  for (let i = leadingDays - 1; i >= 0; i -= 1) {
    const date = new Date(year, month, 1 - i - 1);
    days.push({ date, inCurrentMonth: false, orders: [] });
  }
  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const currentDate = new Date(year, month, day);
    const ordersForDay = orders.filter((order) => {
      const start = parseDate(order.orderDate);
      const end =
        parseDate(order.returnDate) ?? parseDate(order.dueDate) ?? start;
      if (!start || !end) return false;
      const dayTime = currentDate.setHours(0, 0, 0, 0);
      const startTime = new Date(start).setHours(0, 0, 0, 0);
      const endTime = new Date(end).setHours(0, 0, 0, 0);
      return dayTime >= startTime && dayTime <= endTime;
    });
    days.push({
      date: currentDate,
      inCurrentMonth: true,
      orders: ordersForDay,
    });
  }
  const trailingDays = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= trailingDays; i += 1) {
    const date = new Date(year, month + 1, i);
    days.push({ date, inCurrentMonth: false, orders: [] });
  }
  return days;
}

function formatOrderItems(
  items: AdminOrderRecord["items"],
) {
  return items
    .map((item) =>
      [
        item.name,
        item.quantity > 1 ? `x${item.quantity}` : null,
        item.unitId ? `#${item.unitId}` : null,
      ]
        .filter(Boolean)
        .join(" "),
    )
    .join(", ");
}

function formatDateTime(value: string | undefined, options?: Intl.DateTimeFormatOptions) {
  if (!value) return "—";
  const date = parseDate(value);
  if (!date) return value;
  return date.toLocaleString(
    "ko-KR",
    options ?? { dateStyle: "short", timeStyle: "short" },
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderRecord[]>(adminOrders);
  const [calendarDate, setCalendarDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [chargeModalOrder, setChargeModalOrder] =
    useState<AdminOrderRecord | null>(null);
  const [chargeAmount, setChargeAmount] = useState("");
  const [chargeNote, setChargeNote] = useState("");
  const [rescheduleModalOrder, setRescheduleModalOrder] =
    useState<AdminOrderRecord | null>(null);
  const [rescheduleData, setRescheduleData] = useState({
    orderDate: "",
    dueDate: "",
    returnDate: "",
  });
  const [editItemsModalOrder, setEditItemsModalOrder] =
    useState<AdminOrderRecord | null>(null);
  const [editedItems, setEditedItems] = useState<
    AdminOrderRecord["items"]
  >([]);
  const [statusFilter, setStatusFilter] = useState<AdminOrderRecord["status"] | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const productCatalog = useMemo(
    () => [...usjProducts, ...beautyProducts],
    [],
  );

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus =
        statusFilter === "ALL" || order.status === statusFilter;
      const lowerSearch = searchTerm.trim().toLowerCase();
      const matchSearch =
        lowerSearch.length === 0 ||
        order.customerName.toLowerCase().includes(lowerSearch) ||
        order.email.toLowerCase().includes(lowerSearch) ||
        order.id.toLowerCase().includes(lowerSearch) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(lowerSearch),
        );
      return matchStatus && matchSearch;
    });
  }, [orders, statusFilter, searchTerm]);

  const applyOrderUpdate = (
    orderId: string,
    updater: (order: AdminOrderRecord) => AdminOrderRecord,
  ) => {
    setOrders((previous) => {
      const next = previous.map((order) =>
        order.id === orderId ? updater(order) : order,
      );
      if (selectedDay) {
        const year = calendarDate.getFullYear();
        const month = calendarDate.getMonth();
        const days = buildCalendarDays(next, year, month);
        const refreshed = days.find(
          (day) =>
            day.date.toDateString() === selectedDay.date.toDateString(),
        );
        setSelectedDay(refreshed ?? null);
      }
      return next;
    });
  };

  const openChargeModal = (order: AdminOrderRecord) => {
    setChargeModalOrder(order);
    setChargeAmount("");
    setChargeNote("");
  };

  const closeChargeModal = () => {
    setChargeModalOrder(null);
    setChargeAmount("");
    setChargeNote("");
  };

  const openRescheduleModal = (order: AdminOrderRecord) => {
    setRescheduleModalOrder(order);
    setRescheduleData({
      orderDate: order.orderDate,
      dueDate: order.dueDate,
      returnDate: order.returnDate ?? "",
    });
  };

  const closeRescheduleModal = () => {
    setRescheduleModalOrder(null);
    setRescheduleData({
      orderDate: "",
      dueDate: "",
      returnDate: "",
    });
  };

  const openEditItemsModal = (order: AdminOrderRecord) => {
    setEditItemsModalOrder(order);
    setEditedItems(order.items.map((item) => ({ ...item })));
  };

  const closeEditItemsModal = () => {
    setEditItemsModalOrder(null);
    setEditedItems([]);
  };

  const handleChargeSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!chargeModalOrder) return;
    const parsedAmount = Number(chargeAmount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return;
    }
    applyOrderUpdate(chargeModalOrder.id, (order) => {
      const formattedAmount = `₩${parsedAmount.toLocaleString("ko-KR")}`;
      const notePrefix = "추가 청구";
      const details = chargeNote.trim();
      const nextNote = details.length > 0 ? `${notePrefix}: ${formattedAmount} (${details})` : `${notePrefix}: ${formattedAmount}`;
      const combinedNote = order.notes
        ? `${order.notes} / ${nextNote}`
        : nextNote;
      return {
        ...order,
        totalAmount: order.totalAmount + parsedAmount,
        notes: combinedNote,
      };
    });
    closeChargeModal();
  };

  const handleRescheduleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!rescheduleModalOrder) return;
    if (
      rescheduleData.orderDate.trim().length === 0 ||
      rescheduleData.dueDate.trim().length === 0
    ) {
      return;
    }
    applyOrderUpdate(rescheduleModalOrder.id, (order) => ({
      ...order,
      orderDate: rescheduleData.orderDate,
      dueDate: rescheduleData.dueDate,
      returnDate:
        rescheduleData.returnDate.trim().length > 0
          ? rescheduleData.returnDate
          : undefined,
    }));
    closeRescheduleModal();
  };

  const handleEditedItemChange = (
    index: number,
    updates: Partial<AdminOrderRecord["items"][number]>,
  ) => {
    setEditedItems((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...updates } : item,
      ),
    );
  };

  const handleEditItemsSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editItemsModalOrder) return;
    const sanitizedItems = editedItems.map((item) => {
      const product =
        productCatalog.find((candidate) => candidate.slug === item.productSlug);
      return {
        ...item,
        name: product ? product.name : item.name,
        unitId:
          item.unitId && item.unitId.trim().length > 0
            ? item.unitId.trim()
            : undefined,
      };
    });
    const totalAmount = sanitizedItems.reduce((sum, item) => {
      const product =
        productCatalog.find((candidate) => candidate.slug === item.productSlug);
      if (!product) {
        return sum;
      }
      return sum + product.basePriceValue * item.quantity;
    }, 0);
    applyOrderUpdate(editItemsModalOrder.id, (order) => ({
      ...order,
      items: sanitizedItems,
      totalAmount,
    }));
    closeEditItemsModal();
  };

  const totalOrders = orders.length;
  const inProgressCount = orders.filter(
    (order) => order.status === "IN_PROGRESS",
  ).length;
  const overdueOrders = orders.filter(
    (order) => order.status === "OVERDUE",
  );
  const completedCount = orders.filter(
    (order) => order.status === "COMPLETED",
  ).length;
  const overdueRate =
    totalOrders === 0 ? 0 : (overdueOrders.length / totalOrders) * 100;

  const lastUpdatedTimestamp = orders.reduce((latest, order) => {
    const comparableDates = [order.orderDate, order.dueDate];
    if (order.returnDate) {
      comparableDates.push(order.returnDate);
    }
    const orderLatest = Math.max(
      ...comparableDates.map((date) => new Date(date).getTime()),
    );
    return Math.max(latest, orderLatest);
  }, 0);
  const lastUpdatedLabel =
    lastUpdatedTimestamp > 0
      ? new Date(lastUpdatedTimestamp).toISOString().slice(0, 10)
      : "—";

  const orderSummaryCards = [
    {
      title: "전체 주문",
      value: `${totalOrders.toLocaleString("ko-KR")}건`,
      caption: "최근 30일 누적",
    },
    {
      title: "진행 중",
      value: `${inProgressCount.toLocaleString("ko-KR")}건`,
      caption: "반납 대기 주문",
    },
    {
      title: "연체",
      value: `${overdueOrders.length.toLocaleString("ko-KR")}건`,
      caption: `연체율 ${overdueRate.toFixed(1)}%`,
      accent: "text-rose-300",
    },
    {
      title: "반납 완료",
      value: `${completedCount.toLocaleString("ko-KR")}건`,
      caption: "정상 반납 처리",
      accent: "text-emerald-300",
    },
  ];

  const { calendarDays, calendarTitle } = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const days = buildCalendarDays(orders, year, month);
    const monthFormatter = new Intl.DateTimeFormat("ko-KR", {
      month: "long",
    });
    const title = `${year}년 ${monthFormatter.format(
      new Date(year, month, 1),
    )}`;
    return { calendarDays: days, calendarTitle: title };
  }, [calendarDate, orders]);

  const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];

  const handlePrevMonth = () => {
    setCalendarDate((prev) => {
      const year = prev.getFullYear();
      const month = prev.getMonth();
      return new Date(year, month - 1, 1);
    });
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCalendarDate((prev) => {
      const year = prev.getFullYear();
      const month = prev.getMonth();
      return new Date(year, month + 1, 1);
    });
    setSelectedDay(null);
  };

  const handleSelectDay = (day: CalendarDay) => {
    if (!day.inCurrentMonth) return;
    setSelectedDay(day);
  };

  return (
    <>
      <div className="space-y-8">
      <section className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">주문 관리</h1>
          <p className="text-sm text-slate-400">
            전체 주문 현황과 연체 케이스를 추적하고 필요한 조치를 진행하세요.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:border-blue-400">
            CSV 내보내기
          </button>
          <Link
            href="/admin/inventory"
            className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:border-blue-400"
          >
            재고 이동
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {orderSummaryCards.map((card) => (
          <div
            key={card.title}
            className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              {card.title}
            </p>
            <p
              className={[
                "mt-3 text-2xl font-bold text-white",
                card.accent ?? "",
              ].join(" ")}
            >
              {card.value}
            </p>
            <p className="mt-1 text-xs text-slate-400">{card.caption}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              월간 주문 캘린더
            </h2>
            <p className="text-xs text-slate-400">
              픽업일과 반납일 기준으로 주문을 달력에서 확인하세요.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 text-slate-200 hover:border-blue-400"
              onClick={handlePrevMonth}
              aria-label="Previous month"
            >
              <span aria-hidden>‹</span>
            </button>
            <span>{calendarTitle}</span>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 text-slate-200 hover:border-blue-400"
              onClick={handleNextMonth}
              aria-label="Next month"
            >
              <span aria-hidden>›</span>
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-2">
          <div className="grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
            {weekdayLabels.map((weekday) => (
              <span key={weekday}>{weekday}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 text-xs">
            {calendarDays.map((day) => {
              const dayNumber = day.date.getDate();
              const isToday =
                day.inCurrentMonth &&
                new Date().toDateString() === day.date.toDateString();
              const isSelected =
                selectedDay?.date.toDateString() === day.date.toDateString();
              return (
                <button
                  type="button"
                  key={`${day.date.toISOString()}-${day.inCurrentMonth}`}
                  onClick={() => handleSelectDay(day)}
                  className={[
                    "min-h-[120px] rounded-2xl border p-3 text-left transition",
                    day.inCurrentMonth
                      ? "border-slate-800 bg-slate-950/50 hover:border-blue-400"
                      : "cursor-default border-slate-900 bg-slate-950/20 text-slate-600",
                    isToday ? "border-blue-500/60" : "",
                    isSelected ? "ring-2 ring-blue-400" : "",
                  ].join(" ")}
                  disabled={!day.inCurrentMonth}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={[
                        "text-sm font-semibold",
                        day.inCurrentMonth ? "text-white" : "text-slate-500",
                      ].join(" ")}
                    >
                      {dayNumber}
                    </span>
                    {day.orders.length > 0 ? (
                      <span className="rounded-full bg-blue-500/30 px-2 py-0.5 text-[10px] font-semibold text-blue-100">
                        {day.orders.length}건
                      </span>
                    ) : null}
                  </div>
                  {day.orders.length > 0 ? (
                    <ul className="mt-2 space-y-1">
                      {day.orders.slice(0, 3).map((order) => (
                        <li
                          key={`${order.id}-${day.date.toISOString()}`}
                          className="rounded-xl border border-slate-800 bg-slate-900/60 px-2 py-1 text-[10px] text-slate-200"
                        >
                          <span className="font-semibold text-white">
                            {order.customerName}
                          </span>
                          <span className="ml-1 text-slate-400">
                            {statusLabelMap[order.status]}
                          </span>
                        </li>
                      ))}
                      {day.orders.length > 3 ? (
                        <li className="text-[10px] text-slate-400">
                          + {day.orders.length - 3}건 더 보기
                        </li>
                      ) : null}
                    </ul>
                  ) : (
                    <p className="mt-6 text-[10px] text-slate-600">
                      예정된 주문 없음
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {selectedDay ? (
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  {selectedDay.date.toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "short",
                  })}
                </p>
                <p className="text-xs text-slate-400">
                  총 {selectedDay.orders.length}건의 예약
                </p>
              </div>
              <button
                type="button"
                className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-blue-400"
                onClick={() => setSelectedDay(null)}
              >
                닫기
              </button>
            </div>
            {selectedDay.orders.length > 0 ? (
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                {selectedDay.orders.map((order) => (
                  <li
                    key={order.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-slate-400">
                          주문번호 {order.id}
                        </p>
                      </div>
                      <span
                        className={[
                          "rounded-full px-3 py-1 text-xs font-semibold",
                          statusBadgeTone[order.status],
                        ].join(" ")}
                      >
                        {statusLabelMap[order.status]}
                      </span>
                    </div>
                    <ul className="mt-2 space-y-1 text-xs text-slate-300">
                      {order.items.map((item, itemIndex) => (
                        <li key={`${item.productSlug}-${itemIndex}`}>
                          {item.name} · 수량 {item.quantity}
                          {item.unitId ? ` · 유닛 ${item.unitId}` : ""}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 grid gap-2 text-xs text-slate-400 md:grid-cols-4">
                      <p>주문일: {formatDateTime(order.orderDate)}</p>
                      <p>결제일: {formatDateTime(order.paymentDate)}</p>
                      <p>반납 예정: {formatDateTime(order.dueDate, { dateStyle: "short" })}</p>
                      <p>반납일: {formatDateTime(order.returnDate, { dateStyle: "short" })}</p>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-blue-200">
                      ₩{order.totalAmount.toLocaleString("ko-KR")}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      메모: {order.notes ?? "추가 메모 없음"}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:border-blue-400"
                        onClick={() => openChargeModal(order)}
                      >
                        추가 비용 청구
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:border-blue-400"
                        onClick={() => openRescheduleModal(order)}
                      >
                        일정 변경
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:border-blue-400"
                        onClick={() => openEditItemsModal(order)}
                      >
                        상품/유닛 변경
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-xs text-slate-400">
                선택한 날짜에 예약이 없습니다.
              </p>
            )}
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              전체 주문 내역
            </h2>
            <p className="text-xs text-slate-400">
              모든 주문을 상태별로 확인하고 연체 건을 빠르게 처리하세요.
            </p>
          </div>
          <span className="text-xs text-slate-500">
            업데이트 {lastUpdatedLabel}
          </span>
        </div>
        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs text-slate-400">
              상태
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as AdminOrderRecord["status"] | "ALL",
                  )
                }
                className="ml-2 rounded border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
              >
                {statusFilterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <input
            type="search"
            placeholder="주문번호, 고객, 상품 검색"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:outline-none md:w-64"
          />
        </div>
        <div className="mt-4 overflow-auto">
          <table className="min-w-full border-collapse text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left">주문번호</th>
                <th className="px-4 py-3 text-left">고객</th>
                <th className="px-4 py-3 text-left">상품</th>
                <th className="px-4 py-3 text-left">주문일</th>
                <th className="px-4 py-3 text-left">결제일</th>
                <th className="px-4 py-3 text-left">반납 예정</th>
                <th className="px-4 py-3 text-left">반납일</th>
                <th className="px-4 py-3 text-left">상태</th>
                <th className="px-4 py-3 text-right">합계</th>
                <th className="px-4 py-3 text-left">비고</th>
                <th className="px-4 py-3 text-left">조치</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className={[
                    "border-t border-slate-800 bg-slate-950/40 hover:bg-slate-900/60",
                    order.status === "OVERDUE" ? "bg-rose-500/5" : "",
                  ].join(" ")}
                >
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">
                    {order.id}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-white">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-slate-500">{order.email}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-300">
                    {formatOrderItems(order.items)}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {formatDateTime(order.orderDate)}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {formatDateTime(order.paymentDate)}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {formatDateTime(order.dueDate, { dateStyle: "short" })}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {formatDateTime(order.returnDate, { dateStyle: "short" })}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span
                      className={[
                        "rounded-full px-3 py-1 font-medium",
                        statusBadgeTone[order.status],
                      ].join(" ")}
                    >
                      {statusLabelMap[order.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-slate-100">
                    ₩{order.totalAmount.toLocaleString("ko-KR")}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {order.notes ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:border-blue-400"
                        onClick={() => openChargeModal(order)}
                      >
                        추가 비용
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:border-blue-400"
                        onClick={() => openRescheduleModal(order)}
                      >
                        일정 변경
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:border-blue-400"
                        onClick={() => openEditItemsModal(order)}
                      >
                        상품/유닛 변경
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 ? (
            <p className="px-4 py-6 text-center text-xs text-slate-500">
              표시할 주문이 없습니다.
            </p>
          ) : null}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">연체 현황</h2>
          <span className="text-xs text-rose-300">
            연체율 {overdueRate.toFixed(1)}%
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          연체 주문에 대해 고객과 연락하고 연체료를 부과하세요.
        </p>
        <ul className="mt-4 space-y-3">
          {overdueOrders.length > 0 ? (
            overdueOrders.map((order) => (
              <li
                key={order.id}
                className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white">
                    {order.customerName}
                  </p>
                  <span className="text-xs font-medium text-rose-200">
                    연체 진행 중
                  </span>
                </div>
                <p className="mt-2 text-xs text-rose-100">
                  주문번호 {order.id} · 반납 예정 {order.dueDate}
                </p>
                <p className="mt-1 text-xs text-slate-200">
                  연락 메모: {order.notes ?? "추가 메모 없음"}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  고객 이메일: {order.email}
                </p>
              </li>
            ))
          ) : (
            <li className="rounded-2xl bg-slate-900/60 p-4 text-xs text-slate-400">
              현재 연체 중인 주문이 없습니다.
            </li>
          )}
        </ul>
      </section>
      </div>

      {chargeModalOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overlay-backdrop backdrop-blur">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-6 text-sm text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                추가 비용 청구
              </h3>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-200"
                onClick={closeChargeModal}
                aria-label="Close charge modal"
              >
                ✕
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {chargeModalOrder.customerName} / 주문번호 {chargeModalOrder.id}
            </p>
            <form className="mt-4 space-y-4" onSubmit={handleChargeSubmit}>
              <label className="space-y-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                청구 금액
                <input
                  type="number"
                  min={1}
                  className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
                  placeholder="금액을 입력하세요"
                  value={chargeAmount}
                  onChange={(event) => setChargeAmount(event.target.value)}
                />
              </label>
              <label className="space-y-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                메모 (선택)
                <textarea
                  className="h-24 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
                  placeholder="추가 비용 사유를 입력하세요"
                  value={chargeNote}
                  onChange={(event) => setChargeNote(event.target.value)}
                />
              </label>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:border-slate-500"
                  onClick={closeChargeModal}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-400 disabled:opacity-60"
                  disabled={chargeAmount.trim().length === 0}
                >
                  청구 적용
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {rescheduleModalOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overlay-backdrop backdrop-blur">
          <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900/90 p-6 text-sm text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                예약 일정 변경
              </h3>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-200"
                onClick={closeRescheduleModal}
                aria-label="Close reschedule modal"
              >
                ✕
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {rescheduleModalOrder.customerName} / 주문번호{" "}
              {rescheduleModalOrder.id}
            </p>
            <form className="mt-4 space-y-4" onSubmit={handleRescheduleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  대여 시작일
                  <input
                    type="date"
                    className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
                    value={rescheduleData.orderDate}
                    onChange={(event) =>
                      setRescheduleData((prev) => ({
                        ...prev,
                        orderDate: event.target.value,
                      }))
                    }
                    required
                  />
                </label>
                <label className="space-y-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  반납 예정일
                  <input
                    type="date"
                    className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
                    value={rescheduleData.dueDate}
                    onChange={(event) =>
                      setRescheduleData((prev) => ({
                        ...prev,
                        dueDate: event.target.value,
                      }))
                    }
                    required
                  />
                </label>
              </div>
              <label className="space-y-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                반납일 (선택)
                <input
                  type="date"
                  className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
                  value={rescheduleData.returnDate}
                  onChange={(event) =>
                    setRescheduleData((prev) => ({
                      ...prev,
                      returnDate: event.target.value,
                    }))
                  }
                />
              </label>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:border-slate-500"
                  onClick={closeRescheduleModal}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-400"
                >
                  일정 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {editItemsModalOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overlay-backdrop backdrop-blur">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/90 p-6 text-sm text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                상품/유닛 변경
              </h3>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-200"
                onClick={closeEditItemsModal}
                aria-label="Close items modal"
              >
                ✕
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {editItemsModalOrder.customerName} / 주문번호{" "}
              {editItemsModalOrder.id}
            </p>
            <form className="mt-4 space-y-4" onSubmit={handleEditItemsSubmit}>
              <div className="space-y-4">
                {editedItems.map((item, index) => {
                  const productOptions = productCatalog;
                  const availableUnits = inventoryUnits.filter(
                    (unit) => unit.productSlug === item.productSlug,
                  );
                  return (
                    <div
                      key={`${item.productSlug}-${index}`}
                      className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                        아이템 {index + 1}
                      </p>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <label className="space-y-2 text-xs text-slate-400">
                          상품 선택
                          <select
                            className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
                            value={item.productSlug}
                            onChange={(event) => {
                              const nextSlug = event.target.value;
                              const nextProduct = productOptions.find(
                                (product) => product.slug === nextSlug,
                              );
                              handleEditedItemChange(index, {
                                productSlug: nextSlug,
                                name: nextProduct ? nextProduct.name : item.name,
                                unitId: undefined,
                              });
                            }}
                          >
                            {productOptions.map((product) => (
                              <option key={product.slug} value={product.slug}>
                                {product.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="space-y-2 text-xs text-slate-400">
                          수량
                          <input
                            type="number"
                            min={1}
                            max={6}
                            className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
                            value={item.quantity}
                            onChange={(event) =>
                              handleEditedItemChange(index, {
                                quantity: Math.max(
                                  1,
                                  Number(event.target.value) || 1,
                                ),
                              })
                            }
                          />
                        </label>
                      </div>
                      <label className="mt-3 block space-y-2 text-xs text-slate-400">
                        유닛 선택 (선택 사항)
                        <select
                          className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-400 focus:outline-none"
                          value={item.unitId ?? ""}
                          onChange={(event) =>
                            handleEditedItemChange(index, {
                              unitId:
                                event.target.value.length > 0
                                  ? event.target.value
                                  : undefined,
                            })
                          }
                        >
                          <option value="">지정 안 함</option>
                          {availableUnits.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                              {unit.id} · {unit.status}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:border-slate-500"
                  onClick={closeEditItemsModal}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-400"
                >
                  변경 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

// src/types/dashboard.ts

export interface StatCardData {
  title: string;
  value: string;
  change: number; // percentage, positive = up, negative = down
  changeLabel: string;
  icon: string; // lucide icon name
  prefix?: string;
  suffix?: string;
}

export interface RevenuePoint {
  date: string;      // e.g. "Jan 1"
  revenue: number;
  orders: number;
}

export interface Order {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  itemCount: number;
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  revenue: number;
  units: number;
  maxRevenue: number; // for progress bar scaling
}

export interface TrafficSource {
  label: string;
  value: number;
  color: string; // tailwind bg class
}

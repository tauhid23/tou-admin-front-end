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
  avatar: string;    // initials
  product: string;
  amount: number;
  status: "completed" | "pending" | "processing" | "cancelled";
  date: string;
  channel: "web" | "mobile" | "pos";
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  revenue: number;
  units: number;
  growth: number;
  maxRevenue: number; // for progress bar scaling
}

export interface TrafficSource {
  label: string;
  value: number;
  color: string; // tailwind bg class
}
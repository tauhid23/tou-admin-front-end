import type { LucideIcon } from "lucide-react";

export interface NavItemType {
  title: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
  children?: NavItemType[];
}
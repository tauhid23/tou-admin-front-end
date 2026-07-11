"use client";

import { useMemo, useState } from "react";
import { CalendarClock, Edit2, PackagePlus, Play, Plus, Trash2, Zap } from "lucide-react";
import { motion } from "framer-motion";
import FlashSaleModal from "./_components/FlashSalesModal";

interface FlashSale {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  startTime: string;
  endTime: string;
  status: "Active" | "Upcoming" | "Ended";
  productsCount: number;
  bannerColor: string;
}

type EditableFlashSale = Omit<FlashSale, "id" | "status" | "productsCount"> & {
  id?: string;
  status?: FlashSale["status"];
  productsCount?: number;
};

const initialSales: FlashSale[] = [
  {
    id: "FS001",
    title: "Eid Ultra Sale",
    subtitle: "Biggest sale of the season",
    discount: "Flat 50% OFF",
    startTime: "2026-07-18T10:00",
    endTime: "2026-07-20T22:00",
    status: "Active",
    productsCount: 142,
    bannerColor: "from-orange-500 to-red-600",
  },
  {
    id: "FS002",
    title: "Midnight Flash Sale",
    subtitle: "Limited inventory window",
    discount: "Up to 60% OFF",
    startTime: "2026-07-24T00:00",
    endTime: "2026-07-24T23:59",
    status: "Upcoming",
    productsCount: 67,
    bannerColor: "from-purple-600 to-pink-600",
  },
];

export default function FlashSalesPage() {
  const [flashSales, setFlashSales] = useState<FlashSale[]>(initialSales);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<FlashSale | null>(null);
  const [modalKey, setModalKey] = useState(0);

  const summary = useMemo(
    () => ({
      active: flashSales.filter((sale) => sale.status === "Active").length,
      upcoming: flashSales.filter((sale) => sale.status === "Upcoming").length,
      products: flashSales.reduce((sum, sale) => sum + sale.productsCount, 0),
    }),
    [flashSales]
  );

  const handleSaveSale = (sale: EditableFlashSale) => {
    if (editingSale) {
      setFlashSales((prev) =>
        prev.map((item) =>
          item.id === editingSale.id
            ? {
                ...editingSale,
                ...sale,
                status: sale.status ?? editingSale.status,
                productsCount: sale.productsCount ?? editingSale.productsCount,
              }
            : item
        )
      );
      return;
    }

    setFlashSales((prev) => [
      {
        ...sale,
        id: `FS${Date.now().toString().slice(-4)}`,
        status: "Upcoming",
        productsCount: 0,
      },
      ...prev,
    ]);
  };

  const handleCreate = () => {
    setEditingSale(null);
    setModalKey((key) => key + 1);
    setIsModalOpen(true);
  };

  const handleEdit = (sale: FlashSale) => {
    setEditingSale(sale);
    setModalKey((key) => key + 1);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setFlashSales((prev) => prev.filter((sale) => sale.id !== id));
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                Flash Sales
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Create time-sensitive promotions, assign products, and track campaign readiness.
              </p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleCreate}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Create Flash Sale
          </motion.button>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-3">
          {[
            ["Active sales", summary.active],
            ["Upcoming", summary.upcoming],
            ["Products assigned", summary.products],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {flashSales.map((sale) => (
          <motion.article
            key={sale.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className={`bg-gradient-to-r ${sale.bannerColor} p-6 text-white`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white/75">{sale.id}</p>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight">{sale.title}</h2>
                  <p className="mt-1 text-sm text-white/80">{sale.subtitle}</p>
                </div>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                  {sale.status}
                </span>
              </div>
              <p className="mt-8 text-4xl font-black tracking-tight">{sale.discount}</p>
            </div>

            <div className="space-y-5 p-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <CalendarClock className="h-4 w-4 text-slate-400" />
                  <p className="mt-2 text-xs text-slate-500">Starts</p>
                  <p className="text-sm font-semibold text-slate-900">{sale.startTime.replace("T", " ")}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <CalendarClock className="h-4 w-4 text-slate-400" />
                  <p className="mt-2 text-xs text-slate-500">Ends</p>
                  <p className="text-sm font-semibold text-slate-900">{sale.endTime.replace("T", " ")}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <PackagePlus className="h-4 w-4 text-slate-400" />
                  <p className="mt-2 text-xs text-slate-500">Products</p>
                  <p className="text-sm font-semibold text-slate-900">{sale.productsCount}</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-5">
                <button
                  onClick={() => handleEdit(sale)}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </button>
                <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                  <Play className="h-4 w-4" />
                  Manage Products
                </button>
                <button
                  onClick={() => handleDelete(sale.id)}
                  className="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <FlashSaleModal
        key={modalKey}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSale(null);
        }}
        onSave={handleSaveSale}
        initialData={editingSale}
        mode={editingSale ? "edit" : "create"}
      />
    </section>
  );
}

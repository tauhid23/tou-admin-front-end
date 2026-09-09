import { useState } from "react";
import {
  Check,
  ChevronDown,
  Eye,
  GripVertical,
  Link as LinkIcon,
  Menu,
  Monitor,
  Plus,
  Save,
  Search,
  Smartphone,
  Trash2,
} from "lucide-react";
import { storefrontCategories } from "@/lib/storefront-data";
import { cn } from "@/lib/utils";

type NavItem = {
  id: string;
  label: string;
  href: string;
  type: "Link" | "Mega menu";
  visible: boolean;
  desktop: boolean;
  mobile: boolean;
  order: number;
};

const initialNavItems: NavItem[] = [
  { id: "about", label: "About Us", href: "/about", type: "Link", visible: true, desktop: true, mobile: true, order: 1 },
  { id: "categories", label: "Product Category", href: "/collections", type: "Mega menu", visible: true, desktop: true, mobile: true, order: 2 },
  { id: "services", label: "Services", href: "/services", type: "Link", visible: true, desktop: true, mobile: true, order: 3 },
  { id: "contact", label: "Contact", href: "/contact", type: "Link", visible: true, desktop: true, mobile: true, order: 4 },
];

const inputClass =
  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400";

export default function HeaderMenu() {
  const [items, setItems] = useState(initialNavItems);
  const [selectedId, setSelectedId] = useState(initialNavItems[1].id);
  const [preview, setPreview] = useState<"desktop" | "mobile">("desktop");
  const [saved, setSaved] = useState(false);

  const selected = items.find((item) => item.id === selectedId) ?? items[0];
  const orderedItems = [...items].sort((a, b) => a.order - b.order);

  const save = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  const updateSelected = <K extends keyof NavItem>(field: K, value: NavItem[K]) => {
    setItems((current) =>
      current.map((item) => (item.id === selected.id ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    const item: NavItem = {
      id: `nav-${Date.now()}`,
      label: "New link",
      href: "/",
      type: "Link",
      visible: true,
      desktop: true,
      mobile: true,
      order: items.length + 1,
    };
    setItems((current) => [...current, item]);
    setSelectedId(item.id);
  };

  const removeItem = (id: string) => {
    const next = items.filter((item) => item.id !== id).map((item, index) => ({ ...item, order: index + 1 }));
    setItems(next);
    if (selectedId === id) setSelectedId(next[0]?.id ?? "");
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Menu className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Storefront / Navigation
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                Header Menu
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Control desktop links, mobile drawer visibility, mega menu behavior, category
                labels, and storefront search entry points without changing frontend code.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {saved && (
              <span className="inline-flex h-11 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-sm font-semibold text-emerald-700">
                <Check className="h-4 w-4" />
                Saved
              </span>
            )}
            <button onClick={addItem} className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Plus className="h-4 w-4" />
              Add link
            </button>
            <button onClick={save} className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800">
              <Save className="h-4 w-4" />
              Save header
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4">
            <h2 className="font-semibold text-slate-950">Navigation Links</h2>
            <p className="mt-1 text-sm text-slate-500">Keep all current nav links, edit their behavior.</p>
          </div>
          <div className="divide-y divide-slate-100">
            {orderedItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={cn(
                  "grid w-full grid-cols-[20px_minmax(0,1fr)_80px] gap-3 p-4 text-left hover:bg-slate-50",
                  selected.id === item.id && "bg-slate-50"
                )}
              >
                <GripVertical className="mt-2 h-4 w-4 text-slate-300" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-slate-950">{item.label}</span>
                  <span className="mt-1 block truncate font-mono text-xs text-slate-400">{item.href}</span>
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-center text-[11px] font-semibold text-slate-600">
                  {item.type}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="font-semibold text-slate-950">Link Settings</h2>
                <button onClick={() => removeItem(selected.id)} className="flex h-9 w-9 items-center justify-center rounded-xl text-rose-500 hover:bg-rose-50" aria-label="Delete nav item">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Label</span>
                  <input value={selected.label} onChange={(event) => updateSelected("label", event.target.value)} className={cn(inputClass, "mt-2")} />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Type</span>
                  <select value={selected.type} onChange={(event) => updateSelected("type", event.target.value as NavItem["type"])} className={cn(inputClass, "mt-2")}>
                    <option>Link</option>
                    <option>Mega menu</option>
                  </select>
                </label>
                <label className="block md:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">URL</span>
                  <div className="relative mt-2">
                    <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input value={selected.href} onChange={(event) => updateSelected("href", event.target.value)} className={cn(inputClass, "pl-9")} />
                  </div>
                </label>
                <div className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 md:col-span-2 md:grid-cols-3">
                  {[
                    ["visible", "Published"],
                    ["desktop", "Desktop"],
                    ["mobile", "Mobile"],
                  ].map(([field, label]) => (
                    <label key={field} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={Boolean(selected[field as keyof NavItem])}
                        onChange={(event) => updateSelected(field as keyof NavItem, event.target.checked as never)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-950">Mega Menu Category Source</h2>
              <p className="mt-1 text-sm text-slate-500">
                The Product Category mega menu is generated from active storefront categories and subcategories.
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {storefrontCategories.map((category) => (
                  <div key={category.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-950">{category.label}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{category.count}</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                        {category.subcategories.length} items
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {category.subcategories.slice(0, 4).map((subcategory) => (
                        <span key={subcategory.id} className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500">
                          {subcategory.label}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-950">Header Preview</h2>
              <div className="flex rounded-xl bg-slate-100 p-1">
                <button onClick={() => setPreview("desktop")} className={cn("flex h-8 w-8 items-center justify-center rounded-lg", preview === "desktop" && "bg-white shadow-sm")} aria-label="Desktop preview">
                  <Monitor className="h-4 w-4" />
                </button>
                <button onClick={() => setPreview("mobile")} className={cn("flex h-8 w-8 items-center justify-center rounded-lg", preview === "mobile" && "bg-white shadow-sm")} aria-label="Mobile preview">
                  <Smartphone className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className={cn("mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-[#c9a084] p-4 text-white", preview === "mobile" && "mx-auto max-w-[290px]")}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#b07154] font-bold">S</div>
                {preview === "desktop" ? (
                  <div className="flex items-center gap-5 text-sm font-semibold">
                    {orderedItems.filter((item) => item.visible && item.desktop).map((item) => (
                      <span key={item.id} className="flex items-center gap-1">
                        {item.label}
                        {item.type === "Mega menu" && <ChevronDown className="h-3.5 w-3.5" />}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Search className="h-4 w-4" />
                    <Menu className="h-5 w-5" />
                  </div>
                )}
              </div>
              {selected.type === "Mega menu" && (
                <div className="mt-4 rounded-xl bg-black/20 p-3">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-semibold">Product Category</span>
                    <Eye className="h-3.5 w-3.5 opacity-70" />
                  </div>
                  <div className="grid gap-2">
                    {storefrontCategories.slice(0, preview === "mobile" ? 4 : 6).map((category) => (
                      <div key={category.id} className="rounded-lg bg-white/10 px-3 py-2 text-xs">
                        {category.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

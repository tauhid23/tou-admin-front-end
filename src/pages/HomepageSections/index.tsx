import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BadgeCheck,
  Check,
  Eye,
  GripVertical,
  HeartHandshake,
  Home,
  ImagePlus,
  LayoutGrid,
  Plus,
  Save,
  Search,
  Star,
  Trash2,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useSaveHomepageSections,
  useStorefrontContent,
  useUploadImages,
  type AdminHomepageSection,
} from "@/lib/api/queries";
import { useToast } from "@/lib/providers/ToastProvider";

type SectionStatus = "Published" | "Draft" | "Hidden";
type SectionType =
  | "Hero"
  | "Category carousel"
  | "Big category grid"
  | "Info strip"
  | "Feature grid"
  | "Featured products"
  | "Reviews";

type HomepageSection = {
  id: string;
  type: SectionType;
  title: string;
  eyebrow: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  status: SectionStatus;
  visibleDesktop: boolean;
  visibleMobile: boolean;
  order: number;
  items: SectionItem[];
};

type SectionItem = {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  url?: string;
  meta?: string;
  enabled: boolean;
};

const initialSections: HomepageSection[] = [
  {
    id: "hero",
    type: "Hero",
    title: "Home hero slider",
    eyebrow: "Storefront top fold",
    description: "Hero banners, search placeholder, and popular tags are managed from Banners & Sliders.",
    ctaLabel: "Manage banners",
    ctaUrl: "/appearance/banners-sliders",
    status: "Published",
    visibleDesktop: true,
    visibleMobile: true,
    order: 1,
    items: [
      { id: "hero-search", title: "Search bar", subtitle: "Image search icon and keyword search", enabled: true },
      { id: "hero-tags", title: "Popular tags", subtitle: "knitting yarn, yarn, cotton yarn, crochet yarn", enabled: true },
    ],
  },
  {
    id: "category-carousel",
    type: "Category carousel",
    title: "Product Categories",
    eyebrow: "Browse by",
    description: "Horizontal category cards shown below the hero.",
    ctaLabel: "View all",
    ctaUrl: "/collections",
    status: "Published",
    visibleDesktop: true,
    visibleMobile: true,
    order: 2,
    items: [
      {
        id: "men",
        title: "Men",
        subtitle: "Everyday apparel, outerwear, and essentials.",
        image:
          "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=600&q=80",
        url: "/collections/men",
        meta: "120+ items",
        enabled: true,
      },
      {
        id: "women",
        title: "Women",
        subtitle: "Dresses, tops, sets, and seasonal collections.",
        image:
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80",
        url: "/collections/women",
        meta: "160+ items",
        enabled: true,
      },
      {
        id: "electronics",
        title: "Electronics",
        subtitle: "Consumer devices, components, and smart products.",
        image:
          "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
        url: "/collections/electronics",
        meta: "210+ items",
        enabled: true,
      },
    ],
  },
  {
    id: "big-category-grid",
    type: "Big category grid",
    title: "Featured Category Tiles",
    eyebrow: "Collections",
    description: "Large image tiles for the main category discovery block.",
    ctaLabel: "View All Collection",
    ctaUrl: "/collections",
    status: "Published",
    visibleDesktop: true,
    visibleMobile: true,
    order: 3,
    items: [
      { id: "tile-men", title: "Men", subtitle: "Large tile", url: "/collections/men", enabled: true },
      { id: "tile-women", title: "Women", subtitle: "Large tile", url: "/collections/women", enabled: true },
      { id: "tile-kids", title: "Kids", subtitle: "Large tile", url: "/collections/kids", enabled: true },
      { id: "tile-accessories", title: "Accessories", subtitle: "Large tile", url: "/collections/accessories", enabled: true },
    ],
  },
  {
    id: "info-strip",
    type: "Info strip",
    title: "Editorial Info Strip",
    eyebrow: "Brand story",
    description: "Three informational columns used between shopping sections.",
    ctaLabel: "Read more",
    ctaUrl: "/storefront/about-us",
    status: "Published",
    visibleDesktop: true,
    visibleMobile: true,
    order: 4,
    items: [
      {
        id: "timeless",
        title: "TIMELESS ELEGANCE, PERFECTLY MODEST",
        subtitle:
          "Discover our collection of elegant Abayas and Modest dresses, thoughtfully designed with intricate hand embroidery.",
        enabled: true,
      },
      {
        id: "in-house",
        title: "PROUDLY CRAFTED IN-HOUSE",
        subtitle: "Every piece is designed and manufactured under one roof to ensure unmatched quality.",
        enabled: true,
      },
      {
        id: "kids",
        title: "ADORABLE STYLES FOR YOUR LITTLE ONES",
        subtitle: "Explore kids' abayas and baby dresses designed to match effortlessly.",
        enabled: true,
      },
    ],
  },
  {
    id: "feature-grid",
    type: "Feature grid",
    title: "Trust Feature Grid",
    eyebrow: "Store promises",
    description: "Four icon-led service promises shown in the dark brand band.",
    ctaLabel: "",
    ctaUrl: "",
    status: "Published",
    visibleDesktop: true,
    visibleMobile: true,
    order: 5,
    items: [
      { id: "premium", title: "PREMIUM FABRICS", subtitle: "BadgeCheck icon", enabled: true },
      { id: "ethical", title: "ETHICALLY MADE", subtitle: "HeartHandshake icon", enabled: true },
      { id: "delivery", title: "EXPRESS DELIVERY", subtitle: "Truck icon", enabled: true },
      { id: "inhouse", title: "CRAFTED IN-HOUSE WITH LOVE AND EXPERTISE", subtitle: "Home icon", enabled: true },
    ],
  },
  {
    id: "featured-products",
    type: "Featured products",
    title: "Featured Products",
    eyebrow: "Trending Now",
    description: "Featured product grid using selected products and display limit.",
    ctaLabel: "View All Products",
    ctaUrl: "/collections",
    status: "Published",
    visibleDesktop: true,
    visibleMobile: true,
    order: 6,
    items: [
      { id: "limit", title: "Display limit", subtitle: "Show first 8 products", meta: "8 products", enabled: true },
      { id: "sorting", title: "Sort rule", subtitle: "Manual featured order", meta: "Manual", enabled: true },
    ],
  },
  {
    id: "reviews",
    type: "Reviews",
    title: "Our Latest 5-Star Reviews",
    eyebrow: "Social proof",
    description: "Review carousel copy, rating summary, and visibility rules.",
    ctaLabel: "",
    ctaUrl: "",
    status: "Published",
    visibleDesktop: true,
    visibleMobile: true,
    order: 7,
    items: [
      { id: "rating", title: "Average rating", subtitle: "5-star review widget", meta: "5.0", enabled: true },
      { id: "count", title: "Review count label", subtitle: "Over 1000 reviews", meta: "1000+", enabled: true },
    ],
  },
];

const statusClass: Record<SectionStatus, string> = {
  Published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Draft: "bg-slate-100 text-slate-600 border-slate-200",
  Hidden: "bg-amber-50 text-amber-700 border-amber-200",
};

const sectionIcons = {
  Hero: Search,
  "Category carousel": LayoutGrid,
  "Big category grid": LayoutGrid,
  "Info strip": BadgeCheck,
  "Feature grid": HeartHandshake,
  "Featured products": Truck,
  Reviews: Star,
} satisfies Record<SectionType, typeof Star>;

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400";

export default function HomepageSectionsPage() {
  const content = useStorefrontContent();
  const saveSections = useSaveHomepageSections();
  const uploadImages = useUploadImages();
  const toast = useToast();
  const [sections, setSections] = useState(initialSections);
  const [selectedId, setSelectedId] = useState(initialSections[0].id);
  const [saved, setSaved] = useState(false);

  const orderedSections = useMemo(
    () => [...sections].sort((a, b) => a.order - b.order),
    [sections]
  );
  const selected = sections.find((section) => section.id === selectedId) ?? sections[0];
  const publishedCount = sections.filter((section) => section.status === "Published").length;
  const mobileCount = sections.filter((section) => section.visibleMobile).length;

  useEffect(() => {
    if (!content.data?.homepageSections?.length) return;
    const typeLabels: Record<AdminHomepageSection["type"], SectionType> = {
      hero: "Hero",
      category_carousel: "Category carousel",
      big_category_grid: "Big category grid",
      info_strip: "Info strip",
      feature_grid: "Feature grid",
      featured_products: "Featured products",
      reviews: "Reviews",
    };
    const hydrated = content.data.homepageSections.map((section): HomepageSection => ({
      id: section._id ?? `new-${section.type}`,
      type: typeLabels[section.type],
      title: section.title,
      eyebrow: section.eyebrow,
      description: section.description,
      ctaLabel: section.ctaLabel,
      ctaUrl: section.ctaUrl,
      status: `${section.status.charAt(0).toUpperCase()}${section.status.slice(1)}` as SectionStatus,
      visibleDesktop: section.visibleDesktop,
      visibleMobile: section.visibleMobile,
      order: section.sortOrder,
      items: section.items.map((item, index) => ({
        id: `${section._id ?? section.type}-${index}`,
        title: item.title,
        subtitle: item.subtitle,
        image: item.image?.url,
        url: item.url,
        meta: item.meta,
        enabled: item.enabled,
      })),
    }));
    setSections(hydrated);
    setSelectedId(hydrated[0]?.id ?? "");
  }, [content.data]);

  const save = async () => {
    const typeKeys: Record<SectionType, AdminHomepageSection["type"]> = {
      Hero: "hero",
      "Category carousel": "category_carousel",
      "Big category grid": "big_category_grid",
      "Info strip": "info_strip",
      "Feature grid": "feature_grid",
      "Featured products": "featured_products",
      Reviews: "reviews",
    };
    const payload: AdminHomepageSection[] = orderedSections.map((section, index) => ({
      ...(section.id && /^[a-f\d]{24}$/i.test(section.id) ? { _id: section.id } : {}),
      type: typeKeys[section.type],
      title: section.title,
      eyebrow: section.eyebrow,
      description: section.description,
      ctaLabel: section.ctaLabel,
      ctaUrl: section.ctaUrl,
      status: section.status.toLowerCase() as AdminHomepageSection["status"],
      visibleDesktop: section.visibleDesktop,
      visibleMobile: section.visibleMobile,
      sortOrder: index + 1,
      items: section.items.map((item) => ({
        title: item.title,
        subtitle: item.subtitle,
        url: item.url ?? "",
        meta: item.meta ?? "",
        enabled: item.enabled,
        ...(item.image ? { image: { url: item.image, publicId: "", alt: item.title || "Homepage content" } } : {}),
      })),
    }));
    try {
      await saveSections.mutateAsync({ sections: payload });
      setSaved(true);
      toast.success("Homepage saved", "Published sections are now available to the storefront.");
      window.setTimeout(() => setSaved(false), 2200);
    } catch (error) {
      toast.error("Homepage could not be saved", error instanceof Error ? error.message : "Try again.");
    }
  };

  const updateSection = <K extends keyof HomepageSection>(field: K, value: HomepageSection[K]) => {
    setSections((current) =>
      current.map((section) => (section.id === selected.id ? { ...section, [field]: value } : section))
    );
  };

  const updateItem = <K extends keyof SectionItem>(itemId: string, field: K, value: SectionItem[K]) => {
    setSections((current) =>
      current.map((section) =>
        section.id === selected.id
          ? {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId ? { ...item, [field]: value } : item
              ),
            }
          : section
      )
    );
  };

  const uploadItemImage = async (itemId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const [asset] = await uploadImages.mutateAsync({ files: [file], folder: "sosbd/storefront/homepage" });
      if (asset) updateItem(itemId, "image", asset.url);
    } catch (error) {
      toast.error("Image upload failed", error instanceof Error ? error.message : "Try another image.");
    } finally {
      event.target.value = "";
    }
  };

  const moveSection = (direction: -1 | 1) => {
    const currentIndex = orderedSections.findIndex((section) => section.id === selected.id);
    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= orderedSections.length) return;

    const next = [...orderedSections];
    const [moved] = next.splice(currentIndex, 1);
    next.splice(targetIndex, 0, moved);
    setSections(next.map((section, index) => ({ ...section, order: index + 1 })));
  };

  const addContentItem = () => {
    const item: SectionItem = {
      id: `item-${Date.now()}`,
      title: "New content item",
      subtitle: "Add section copy or configuration",
      url: "",
      enabled: true,
    };
    updateSection("items", [...selected.items, item]);
  };

  const removeItem = (itemId: string) => {
    updateSection(
      "items",
      selected.items.filter((item) => item.id !== itemId)
    );
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Storefront / Pages & Content
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                Homepage Sections
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Manage every dynamic block used on the customer homepage: ordering, copy, links,
                visibility, section items, and responsive publishing.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="inline-flex h-10 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-sm font-semibold text-emerald-700">
                <Check className="h-4 w-4" />
                Saved
              </span>
            )}
            <button
              onClick={save}
              disabled={saveSections.isPending || uploadImages.isPending}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Save className="h-4 w-4" />
              Save homepage
            </button>
          </div>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-4">
          {[
            ["Sections", sections.length],
            ["Published", publishedCount],
            ["Mobile visible", mobileCount],
            ["Content items", sections.reduce((total, section) => total + section.items.length, 0)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4">
            <h2 className="font-semibold text-slate-950">Homepage Order</h2>
            <p className="mt-1 text-sm text-slate-500">Keep this aligned with the frontend layout.</p>
          </div>
          <div className="divide-y divide-slate-100">
            {orderedSections.map((section) => {
              const Icon = sectionIcons[section.type];
              return (
                <button
                  key={section.id}
                  onClick={() => setSelectedId(section.id)}
                  className={cn(
                    "grid w-full grid-cols-[22px_36px_minmax(0,1fr)] gap-3 p-4 text-left transition hover:bg-slate-50",
                    selected.id === section.id && "bg-slate-50"
                  )}
                >
                  <GripVertical className="mt-2 h-4 w-4 text-slate-300" />
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-slate-950">{section.title}</span>
                    <span className="mt-1 block text-xs text-slate-500">{section.type}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-semibold text-slate-950">{selected.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{selected.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => moveSection(-1)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                    aria-label="Move section up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveSection(1)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                    aria-label="Move section down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Section eyebrow</span>
                  <input
                    value={selected.eyebrow}
                    onChange={(event) => updateSection("eyebrow", event.target.value)}
                    className={cn(inputClass, "mt-2")}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Section title</span>
                  <input
                    value={selected.title}
                    onChange={(event) => updateSection("title", event.target.value)}
                    className={cn(inputClass, "mt-2")}
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">Description / admin note</span>
                  <textarea
                    value={selected.description}
                    onChange={(event) => updateSection("description", event.target.value)}
                    className="mt-2 min-h-24 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-slate-400"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">CTA label</span>
                  <input
                    value={selected.ctaLabel}
                    onChange={(event) => updateSection("ctaLabel", event.target.value)}
                    className={cn(inputClass, "mt-2")}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">CTA URL</span>
                  <input
                    value={selected.ctaUrl}
                    onChange={(event) => updateSection("ctaUrl", event.target.value)}
                    className={cn(inputClass, "mt-2")}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Status</span>
                  <select
                    value={selected.status}
                    onChange={(event) => updateSection("status", event.target.value as SectionStatus)}
                    className={cn(inputClass, "mt-2")}
                  >
                    <option>Published</option>
                    <option>Draft</option>
                    <option>Hidden</option>
                  </select>
                </label>
                <div className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:grid-cols-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={selected.visibleDesktop}
                      onChange={(event) => updateSection("visibleDesktop", event.target.checked)}
                    />
                    Desktop visible
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={selected.visibleMobile}
                      onChange={(event) => updateSection("visibleMobile", event.target.checked)}
                    />
                    Mobile visible
                  </label>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 p-4">
                <div>
                  <h2 className="font-semibold text-slate-950">Section Items</h2>
                  <p className="mt-1 text-sm text-slate-500">Cards, text blocks, category tiles, review settings, or display rules.</p>
                </div>
                <button
                  onClick={addContentItem}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Plus className="h-4 w-4" />
                  Add item
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {selected.items.map((item) => (
                  <div key={item.id} className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_120px_40px]">
                    <div className="grid gap-3 md:grid-cols-2">
                      <input
                        value={item.title}
                        onChange={(event) => updateItem(item.id, "title", event.target.value)}
                        className={inputClass}
                        placeholder="Title"
                      />
                      <input
                        value={item.meta ?? ""}
                        onChange={(event) => updateItem(item.id, "meta", event.target.value)}
                        className={inputClass}
                        placeholder="Count, rating, icon, or display rule"
                      />
                      <input
                        value={item.subtitle}
                        onChange={(event) => updateItem(item.id, "subtitle", event.target.value)}
                        className={cn(inputClass, "md:col-span-2")}
                        placeholder="Subtitle"
                      />
                      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white text-slate-300">
                            {item.image ? (
                              <img src={item.image} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <ImagePlus className="h-5 w-5" />
                            )}
                          </div>
                          <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                            <ImagePlus className="h-4 w-4" />
                            Choose image
                            <input type="file" accept="image/*" className="hidden" onChange={(event) => uploadItemImage(item.id, event)} />
                          </label>
                        </div>
                      </div>
                      <input
                        value={item.url ?? ""}
                        onChange={(event) => updateItem(item.id, "url", event.target.value)}
                        className={inputClass}
                        placeholder="Link URL"
                      />
                    </div>
                    <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={item.enabled}
                        onChange={(event) => updateItem(item.id, "enabled", event.target.checked)}
                      />
                      Enabled
                    </label>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex h-11 w-11 items-center justify-center rounded-xl text-rose-500 hover:bg-rose-50"
                      aria-label="Remove content item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-950">Storefront Preview</h2>
                <Eye className="h-4 w-4 text-slate-400" />
              </div>
              <div className="mt-5 rounded-2xl border border-slate-200 bg-[#fbfaf9] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b07154]">
                  {selected.eyebrow}
                </p>
                <h3 className="mt-1 text-2xl font-extrabold text-[#311f13]">{selected.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{selected.description}</p>
                <div className="mt-5 grid gap-3">
                  {selected.items
                    .filter((item) => item.enabled)
                    .slice(0, 4)
                    .map((item) => (
                      <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-slate-950">{item.title}</p>
                          {item.meta && <span className="text-xs font-semibold text-slate-400">{item.meta}</span>}
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-950">Publish Checklist</h2>
              <div className="mt-4 space-y-3">
                {[
                  [selected.status === "Published", "Section is published"],
                  [selected.visibleDesktop || selected.visibleMobile, "At least one device is enabled"],
                  [selected.items.some((item) => item.enabled), "Contains enabled content"],
                  [Boolean(selected.title.trim()), "Customer-facing title is filled"],
                ].map(([done, label]) => (
                  <div key={label as string} className="flex items-center gap-3 text-sm text-slate-600">
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full border",
                        done
                          ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                          : "border-slate-200 bg-slate-50 text-slate-300"
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </span>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

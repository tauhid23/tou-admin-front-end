import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  Check,
  Eye,
  GripVertical,
  ImagePlus,
  Link as LinkIcon,
  Monitor,
  Plus,
  Save,
  Search,
  Smartphone,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useSaveBanners,
  useSaveHeroSettings,
  useStorefrontContent,
  useUploadImages,
  type AdminHeroBanner,
  type HeroSettings,
} from "@/lib/api/queries";
import { useToast } from "@/lib/providers/ToastProvider";

type SlideStatus = "Published" | "Scheduled" | "Draft" | "Paused";
type TextPosition = "left" | "center" | "right";
type FocalPoint = "center" | "top" | "bottom";

type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  ctaLabel: string;
  ctaUrl: string;
  image: string;
  mobileImage: string;
  altText: string;
  searchPlaceholder: string;
  popularTags: string[];
  position: TextPosition;
  focalPoint: FocalPoint;
  overlayOpacity: number;
  status: SlideStatus;
  startDate: string;
  endDate: string;
  audience: string;
  order: number;
};

const defaultSlides: HeroSlide[] = [
  {
    id: "seed-1",
    title: "Go smart sourcing",
    subtitle: "B2B Platform Made Easy",
    eyebrow: "Global sourcing",
    ctaLabel: "Explore categories",
    ctaUrl: "/collections",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80",
    mobileImage:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
    altText: "Fashion sourcing storefront hero banner",
    searchPlaceholder: "tshirt",
    popularTags: ["knitting yarn", "yarn", "cotton yarn", "crochet yarn", "polyester knitting yarn"],
    position: "left",
    focalPoint: "center",
    overlayOpacity: 58,
    status: "Published",
    startDate: "2026-08-01",
    endDate: "2026-12-31",
    audience: "All visitors",
    order: 1,
  },
  {
    id: "seed-2",
    title: "New season arrivals",
    subtitle: "Fresh products for retail and wholesale buyers",
    eyebrow: "Campaign",
    ctaLabel: "Shop new",
    ctaUrl: "/collections",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=80",
    mobileImage:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    altText: "New arrival products arranged for ecommerce campaign",
    searchPlaceholder: "wireless accessories",
    popularTags: ["audio", "chargers", "smart watches", "cables"],
    position: "left",
    focalPoint: "center",
    overlayOpacity: 50,
    status: "Scheduled",
    startDate: "2026-09-01",
    endDate: "2026-10-15",
    audience: "Returning visitors",
    order: 2,
  },
  {
    id: "seed-3",
    title: "Home textile sourcing",
    subtitle: "Bedding, curtains, towels, and hotel-ready soft goods",
    eyebrow: "Category focus",
    ctaLabel: "View home textile",
    ctaUrl: "/collections/home-textile",
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1600&q=80",
    mobileImage:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80",
    altText: "Home textile products on a modern interior shelf",
    searchPlaceholder: "bedding",
    popularTags: ["bedding", "curtains", "towels", "cushions"],
    position: "left",
    focalPoint: "center",
    overlayOpacity: 62,
    status: "Draft",
    startDate: "",
    endDate: "",
    audience: "Wholesale buyers",
    order: 3,
  },
];

const statusClass: Record<SlideStatus, string> = {
  Published: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Scheduled: "border-blue-200 bg-blue-50 text-blue-700",
  Draft: "border-slate-200 bg-slate-100 text-slate-600",
  Paused: "border-amber-200 bg-amber-50 text-amber-700",
};

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400";

function splitTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export default function BannersSlidersTwo() {
  const content = useStorefrontContent();
  const saveBanners = useSaveBanners();
  const saveHeroSettings = useSaveHeroSettings();
  const uploadImages = useUploadImages();
  const toast = useToast();
  const [slides, setSlides] = useState<HeroSlide[]>(defaultSlides);
  const [selectedId, setSelectedId] = useState(defaultSlides[0]?.id ?? "");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [saved, setSaved] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [settings, setSettings] = useState({
    autoplay: true,
    duration: 5,
    transition: "slide" as HeroSettings["transition"],
    showDots: true,
    pauseOnHover: true,
  });

  useEffect(() => {
    if (!content.data) return;
    const banners = content.data.banners ?? [];
    if (content.data.heroSettings) setSettings({ ...content.data.heroSettings, duration: 5 });
    if (!banners.length) return;
    const hydrated = banners.map((banner, index): HeroSlide => ({
      id: banner._id ?? `new-${index}`,
      title: banner.title,
      subtitle: banner.subtitle,
      eyebrow: banner.eyebrow,
      ctaLabel: banner.ctaLabel,
      ctaUrl: banner.ctaUrl,
      image: banner.desktopImage.url,
      mobileImage: banner.mobileImage?.url ?? "",
      altText: banner.desktopImage.alt,
      searchPlaceholder: banner.searchPlaceholder,
      popularTags: banner.popularTags ?? [],
      position: banner.textPosition,
      focalPoint: banner.focalPoint,
      overlayOpacity: banner.overlayOpacity,
      status: `${banner.status.charAt(0).toUpperCase()}${banner.status.slice(1)}` as SlideStatus,
      startDate: banner.startDate?.slice(0, 10) ?? "",
      endDate: banner.endDate?.slice(0, 10) ?? "",
      audience: banner.audience,
      order: banner.sortOrder,
    }));
    setSlides(hydrated);
    setSelectedId(hydrated[0]?.id ?? "");
  }, [content.data]);

  const selectedSlide = slides.find((slide) => slide.id === selectedId) ?? slides[0];
  const scheduledCount = slides.filter((slide) => slide.status === "Scheduled").length;
  const today = new Date().toISOString().slice(0, 10);
  const liveCount = slides.filter((slide) =>
    slide.status === "Published" ||
    (slide.status === "Scheduled" && Boolean(slide.startDate && slide.endDate && slide.startDate <= today && slide.endDate >= today))
  ).length;

  const orderedSlides = useMemo(
    () => [...slides].sort((a, b) => a.order - b.order),
    [slides]
  );

  const saveChanges = async () => {
    const invalidSlide = orderedSlides.find((slide) => {
      if (!slide.title.trim() || !slide.image.trim() || !slide.altText.trim()) return true;
      if (slide.status === "Scheduled" && (!slide.startDate || !slide.endDate)) return true;
      return Boolean(slide.startDate && slide.endDate && slide.startDate > slide.endDate);
    });
    if (invalidSlide) {
      setSelectedId(invalidSlide.id);
      toast.error(
        "Complete the selected slide",
        invalidSlide.status === "Scheduled" && (!invalidSlide.startDate || !invalidSlide.endDate)
          ? "Scheduled slides require both a start and end date."
          : invalidSlide.startDate && invalidSlide.endDate && invalidSlide.startDate > invalidSlide.endDate
            ? "The end date must be after the start date."
            : "Headline, desktop image, and accessible alt text are required."
      );
      return;
    }
    const banners: AdminHeroBanner[] = orderedSlides.map((slide, index) => ({
      ...(slide.id && !slide.id.startsWith("new-") && !slide.id.startsWith("seed-") ? { _id: slide.id } : {}),
      title: slide.title,
      subtitle: slide.subtitle,
      eyebrow: slide.eyebrow,
      ctaLabel: slide.ctaLabel,
      ctaUrl: slide.ctaUrl,
      desktopImage: { url: slide.image, publicId: "", alt: slide.altText },
      mobileImage: { url: slide.mobileImage, publicId: "", alt: slide.altText },
      searchPlaceholder: slide.searchPlaceholder,
      popularTags: slide.popularTags,
      textPosition: slide.position,
      focalPoint: slide.focalPoint,
      overlayOpacity: slide.overlayOpacity,
      status: slide.status.toLowerCase() as AdminHeroBanner["status"],
      startDate: slide.startDate || undefined,
      endDate: slide.endDate || undefined,
      audience: slide.audience,
      sortOrder: index + 1,
    }));
    try {
      const [savedBanners] = await Promise.all([
        saveBanners.mutateAsync({ banners }),
        saveHeroSettings.mutateAsync({ ...settings, duration: 5 }),
      ]);
      setSlides(savedBanners.map((banner, index) => ({ ...orderedSlides[index], id: banner._id ?? orderedSlides[index].id })));
      setSaved(true);
      toast.success("Hero published", "The storefront slider has been updated.");
      window.setTimeout(() => setSaved(false), 2200);
    } catch (error) {
      toast.error("Hero could not be saved", error instanceof Error ? error.message : "Try again.");
    }
  };

  const updateSlide = <K extends keyof HeroSlide>(field: K, value: HeroSlide[K]) => {
    setSlides((current) =>
      current.map((slide) =>
        slide.id === selectedSlide.id ? { ...slide, [field]: value } : slide
      )
    );
  };

  const uploadSlideImage = async (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "image" | "mobileImage"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const [asset] = await uploadImages.mutateAsync({ files: [file], folder: "sosbd/storefront/hero" });
      if (asset) updateSlide(field, asset.url);
    } catch (error) {
      toast.error("Image upload failed", error instanceof Error ? error.message : "Try another image.");
    } finally {
      event.target.value = "";
    }
  };

  const addSlide = () => {
    const nextSlide: HeroSlide = {
      id: `new-${Date.now()}`,
      title: "New hero campaign",
      subtitle: "Add a clear customer-facing value proposition",
      eyebrow: "Campaign",
      ctaLabel: "Shop now",
      ctaUrl: "/collections",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80",
      mobileImage: "",
      altText: "Storefront campaign banner",
      searchPlaceholder: "Search products",
      popularTags: [],
      position: "left",
      focalPoint: "center",
      overlayOpacity: 55,
      status: "Draft",
      startDate: "",
      endDate: "",
      audience: "All visitors",
      order: slides.length + 1,
    };

    setSlides((current) => [...current, nextSlide]);
    setSelectedId(nextSlide.id);
  };

  const deleteSlide = (id: string) => {
    const nextSlides = slides.filter((slide) => slide.id !== id);
    setSlides(nextSlides.map((slide, index) => ({ ...slide, order: index + 1 })));
    if (selectedId === id) {
      setSelectedId(nextSlides[0]?.id ?? "");
    }
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const nextSlides = [...orderedSlides];
    const [moved] = nextSlides.splice(draggedIndex, 1);
    nextSlides.splice(targetIndex, 0, moved);

    setSlides(nextSlides.map((slide, index) => ({ ...slide, order: index + 1 })));
    setDraggedIndex(null);
  };

  if (!selectedSlide) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
        <p className="text-sm font-semibold text-slate-600">No hero slides yet.</p>
        <button
          onClick={addSlide}
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Add first slide
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Storefront / Appearance
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
              Product Banners & Hero Slider
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Control the home hero used by the customer frontend, including responsive images,
              search prompts, popular tags, campaign dates, and publishing state.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {saved && (
              <span className="inline-flex h-10 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-sm font-semibold text-emerald-700">
                <Check className="h-4 w-4" />
                Saved
              </span>
            )}
            <button
              onClick={addSlide}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Plus className="h-4 w-4" />
              Add slide
            </button>
            <button
              onClick={saveChanges}
              disabled={content.isLoading || saveBanners.isPending || saveHeroSettings.isPending || uploadImages.isPending}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saveBanners.isPending || saveHeroSettings.isPending ? "Saving..." : "Save all changes"}
            </button>
          </div>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-4">
          {[
            ["Total slides", slides.length],
            ["Live now", liveCount],
            ["Scheduled", scheduledCount],
            ["Autoplay", settings.autoplay ? "5s" : "Off"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
            </div>
          ))}
        </div>
        {liveCount < 2 && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Publish or schedule at least two active slides to make the customer-facing hero rotate.
          </div>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <h2 className="font-semibold text-slate-950">Slide Queue</h2>
            <span className="text-xs font-medium text-slate-400">Drag to reorder</span>
          </div>
          <div className="divide-y divide-slate-100">
            {orderedSlides.map((slide, index) => (
              <button
                key={slide.id}
                draggable
                onClick={() => setSelectedId(slide.id)}
                onDragStart={() => setDraggedIndex(index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop(index)}
                className={cn(
                  "grid w-full grid-cols-[20px_74px_minmax(0,1fr)] gap-3 p-4 text-left transition hover:bg-slate-50",
                  selectedSlide.id === slide.id && "bg-slate-50"
                )}
              >
                <GripVertical className="mt-5 h-4 w-4 text-slate-300" />
                <img
                  src={slide.image}
                  alt=""
                  className="h-14 w-[74px] rounded-xl object-cover"
                  style={{ objectPosition: slide.focalPoint }}
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-slate-950">
                    {slide.title}
                  </span>
                  <span className="mt-1 block truncate text-xs text-slate-500">
                    {slide.subtitle}
                  </span>
                  <span
                    className={cn(
                      "mt-2 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                      statusClass[slide.status]
                    )}
                  >
                    {slide.status}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-semibold text-slate-950">Hero Content</h2>
                  <p className="mt-1 text-sm text-slate-500">Matches the customer-facing home hero fields.</p>
                </div>
                <button
                  onClick={() => deleteSlide(selectedSlide.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-rose-500 transition hover:bg-rose-50"
                  aria-label="Delete slide"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Eyebrow</span>
                  <input
                    value={selectedSlide.eyebrow}
                    onChange={(event) => updateSlide("eyebrow", event.target.value)}
                    className={cn(inputClass, "mt-2")}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Status</span>
                  <select
                    value={selectedSlide.status}
                    onChange={(event) => updateSlide("status", event.target.value as SlideStatus)}
                    className={cn(inputClass, "mt-2")}
                  >
                    <option>Published</option>
                    <option>Scheduled</option>
                    <option>Draft</option>
                    <option>Paused</option>
                  </select>
                </label>
                <label className="block md:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">Headline</span>
                  <input
                    value={selectedSlide.title}
                    onChange={(event) => updateSlide("title", event.target.value)}
                    className={cn(inputClass, "mt-2")}
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">Subtitle</span>
                  <input
                    value={selectedSlide.subtitle}
                    onChange={(event) => updateSlide("subtitle", event.target.value)}
                    className={cn(inputClass, "mt-2")}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">CTA label</span>
                  <input
                    value={selectedSlide.ctaLabel}
                    onChange={(event) => updateSlide("ctaLabel", event.target.value)}
                    className={cn(inputClass, "mt-2")}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">CTA URL</span>
                  <div className="relative mt-2">
                    <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={selectedSlide.ctaUrl}
                      onChange={(event) => updateSlide("ctaUrl", event.target.value)}
                      className={cn(inputClass, "pl-9")}
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Search placeholder</span>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={selectedSlide.searchPlaceholder}
                      onChange={(event) => updateSlide("searchPlaceholder", event.target.value)}
                      className={cn(inputClass, "pl-9")}
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Popular tags</span>
                  <input
                    value={selectedSlide.popularTags.join(", ")}
                    onChange={(event) => updateSlide("popularTags", splitTags(event.target.value))}
                    className={cn(inputClass, "mt-2")}
                    placeholder="Comma-separated tags"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-950">Media & Display Rules</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">Desktop image file</span>
                  <div className="mt-2 grid gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 sm:grid-cols-[120px_minmax(0,1fr)] sm:items-center">
                    <img src={selectedSlide.image} alt="" className="h-24 w-full rounded-xl object-cover sm:w-28" />
                    <div>
                      <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800">
                        <ImagePlus className="h-4 w-4" />
                        Choose desktop image
                        <input type="file" accept="image/*" className="hidden" onChange={(event) => uploadSlideImage(event, "image")} />
                      </label>
                      <p className="mt-2 text-xs text-slate-500">Upload the hero banner image used on desktop.</p>
                    </div>
                  </div>
                </label>
                <label className="block md:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">Mobile image file</span>
                  <div className="mt-2 grid gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 sm:grid-cols-[90px_minmax(0,1fr)] sm:items-center">
                    <img src={selectedSlide.mobileImage || selectedSlide.image} alt="" className="h-24 w-full rounded-xl object-cover sm:w-20" />
                    <div>
                      <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                        <ImagePlus className="h-4 w-4" />
                        Choose mobile image
                        <input type="file" accept="image/*" className="hidden" onChange={(event) => uploadSlideImage(event, "mobileImage")} />
                      </label>
                      <p className="mt-2 text-xs text-slate-500">Optional portrait-safe crop for phones.</p>
                    </div>
                  </div>
                </label>
                <label className="block md:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">Alt text</span>
                  <input
                    value={selectedSlide.altText}
                    onChange={(event) => updateSlide("altText", event.target.value)}
                    className={cn(inputClass, "mt-2")}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Text position</span>
                  <select
                    value={selectedSlide.position}
                    onChange={(event) => updateSlide("position", event.target.value as TextPosition)}
                    className={cn(inputClass, "mt-2")}
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Image focal point</span>
                  <select
                    value={selectedSlide.focalPoint}
                    onChange={(event) => updateSlide("focalPoint", event.target.value as FocalPoint)}
                    className={cn(inputClass, "mt-2")}
                  >
                    <option value="center">Center</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Overlay opacity</span>
                  <input
                    type="range"
                    min={20}
                    max={85}
                    value={selectedSlide.overlayOpacity}
                    onChange={(event) => updateSlide("overlayOpacity", Number(event.target.value))}
                    className="mt-4 w-full accent-slate-950"
                  />
                </label>
                <div className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                  {selectedSlide.overlayOpacity}% overlay for text contrast
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-950">Publishing & Slider Settings</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Start date</span>
                  <div className="relative mt-2">
                    <CalendarClock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      value={selectedSlide.startDate}
                      onChange={(event) => updateSlide("startDate", event.target.value)}
                      className={cn(inputClass, "pl-9")}
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">End date</span>
                  <div className="relative mt-2">
                    <CalendarClock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      value={selectedSlide.endDate}
                      onChange={(event) => updateSlide("endDate", event.target.value)}
                      className={cn(inputClass, "pl-9")}
                    />
                  </div>
                </label>
                <label className="block md:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">Audience / customer segment</span>
                  <input
                    value={selectedSlide.audience}
                    onChange={(event) => updateSlide("audience", event.target.value)}
                    className={cn(inputClass, "mt-2")}
                  />
                </label>
                <div className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 md:col-span-2 md:grid-cols-5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={settings.autoplay}
                      onChange={(event) =>
                        setSettings((current) => ({ ...current, autoplay: event.target.checked }))
                      }
                    />
                    Autoplay
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={settings.showDots}
                      onChange={(event) =>
                        setSettings((current) => ({ ...current, showDots: event.target.checked }))
                      }
                    />
                    Dots
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={settings.pauseOnHover}
                      onChange={(event) =>
                        setSettings((current) => ({ ...current, pauseOnHover: event.target.checked }))
                      }
                    />
                    Hover pause
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-slate-500">Interval (seconds)</span>
                    <input
                      type="number"
                      value={5}
                      disabled
                      className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-slate-100 px-2 text-sm text-slate-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-slate-500">Transition</span>
                    <select
                      value={settings.transition}
                      onChange={(event) =>
                        setSettings((current) => ({ ...current, transition: event.target.value as HeroSettings["transition"] }))
                      }
                      className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-2 text-sm"
                    >
                      <option value="slide">Cinematic reveal</option>
                      <option value="fade">Soft dissolve</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-950">Live Preview</h2>
              <div className="flex rounded-xl bg-slate-100 p-1">
                <button
                  onClick={() => setPreviewDevice("desktop")}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    previewDevice === "desktop" && "bg-white shadow-sm"
                  )}
                  aria-label="Desktop preview"
                >
                  <Monitor className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice("mobile")}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    previewDevice === "mobile" && "bg-white shadow-sm"
                  )}
                  aria-label="Mobile preview"
                >
                  <Smartphone className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              className={cn(
                "mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950",
                previewDevice === "mobile" ? "mx-auto max-w-[260px]" : ""
              )}
            >
              <div className={cn("relative", previewDevice === "mobile" ? "h-[480px]" : "h-[420px]")}>
                <img
                  src={previewDevice === "mobile" && selectedSlide.mobileImage ? selectedSlide.mobileImage : selectedSlide.image}
                  alt={selectedSlide.altText}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: selectedSlide.focalPoint }}
                />
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: `rgba(0, 0, 0, ${selectedSlide.overlayOpacity / 100})` }}
                />
                <div
                  className={cn(
                    "absolute inset-0 flex flex-col justify-end p-6 text-white",
                    selectedSlide.position === "center" && "items-center text-center",
                    selectedSlide.position === "right" && "items-end text-right",
                    selectedSlide.position === "left" && "items-start"
                  )}
                >
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/70">
                    {selectedSlide.eyebrow}
                  </p>
                  <h3 className="max-w-sm text-3xl font-extrabold uppercase leading-tight">
                    {selectedSlide.title}
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-white/85">{selectedSlide.subtitle}</p>
                  <div className="mt-5 w-full max-w-sm rounded-full bg-white p-1">
                    <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400">
                      <Search className="h-4 w-4" />
                      {selectedSlide.searchPlaceholder}
                    </div>
                  </div>
                  <div className="mt-4 flex max-w-sm flex-wrap gap-2">
                    {selectedSlide.popularTags.slice(0, 4).map((tag) => (
                      <span key={tag} className="rounded-full border border-white/50 px-2.5 py-1 text-xs text-white">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

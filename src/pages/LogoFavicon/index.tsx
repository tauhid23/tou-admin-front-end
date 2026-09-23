import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  AlertCircle,
  Check,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import {
  useSaveBranding,
  useStorefrontContent,
  useUploadImages,
  type SiteBranding,
  type StorefrontAsset,
} from "@/lib/api/queries";
import { useToast } from "@/lib/providers/ToastProvider";

type FaviconKey = keyof SiteBranding["favicons"];

const emptyAsset = (alt = ""): StorefrontAsset => ({ url: "", publicId: "", alt });

const defaultBranding: SiteBranding = {
  siteTitle: "SOSBD",
  logo: emptyAsset("SOSBD"),
  favicons: {
    browser16: emptyAsset(),
    browser32: emptyAsset(),
    apple180: emptyAsset(),
    android192: emptyAsset(),
  },
};

const faviconOptions: Array<{ key: FaviconKey; label: string; size: string }> = [
  { key: "browser16", label: "Browser tab", size: "16 x 16px" },
  { key: "browser32", label: "Retina browser tab", size: "32 x 32px" },
  { key: "apple180", label: "Apple touch icon", size: "180 x 180px" },
  { key: "android192", label: "Android icon", size: "192 x 192px" },
];

const acceptedImages = "image/jpeg,image/png,image/webp,image/svg+xml,image/x-icon,.ico";
const maxFileSize = 8 * 1024 * 1024;

function assetName(asset: StorefrontAsset) {
  if (asset.publicId) return asset.publicId.split("/").pop() ?? "Uploaded image";
  if (asset.url) return asset.url.split("/").pop()?.split("?")[0] ?? "Uploaded image";
  return "";
}

export default function LogoFavicon() {
  const content = useStorefrontContent();
  const saveBranding = useSaveBranding();
  const uploadImages = useUploadImages();
  const toast = useToast();
  const [branding, setBranding] = useState<SiteBranding>(defaultBranding);
  const [activeTab, setActiveTab] = useState<"logo" | "favicon">("logo");
  const [uploadingTarget, setUploadingTarget] = useState<"logo" | FaviconKey | null>(null);
  const [saved, setSaved] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconRefs = useRef<Record<FaviconKey, HTMLInputElement | null>>({
    browser16: null,
    browser32: null,
    apple180: null,
    android192: null,
  });

  useEffect(() => {
    if (content.data?.branding) setBranding(content.data.branding);
  }, [content.data?.branding]);

  const updateLogo = (next: Partial<StorefrontAsset>) => {
    setBranding((current) => ({ ...current, logo: { ...current.logo, ...next } }));
  };

  const updateFavicon = (key: FaviconKey, asset: StorefrontAsset) => {
    setBranding((current) => ({
      ...current,
      favicons: { ...current.favicons, [key]: asset },
    }));
  };

  const uploadAsset = async (
    event: ChangeEvent<HTMLInputElement>,
    target: "logo" | FaviconKey,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") && !file.name.toLowerCase().endsWith(".ico")) {
      toast.error("Unsupported file", "Choose a supported image file.");
      event.target.value = "";
      return;
    }
    if (file.size > maxFileSize) {
      toast.error("Image is too large", "Choose an image smaller than 8 MB.");
      event.target.value = "";
      return;
    }

    setUploadingTarget(target);
    try {
      const [uploaded] = await uploadImages.mutateAsync({
        files: [file],
        folder: target === "logo" ? "sosbd/storefront/branding" : "sosbd/storefront/favicons",
      });
      if (!uploaded) throw new Error("The upload service did not return an image.");

      const asset: StorefrontAsset = {
        url: uploaded.url,
        publicId: uploaded.publicId,
        alt: target === "logo" ? branding.logo.alt || branding.siteTitle : `${branding.siteTitle} icon`,
      };
      if (target === "logo") updateLogo(asset);
      else updateFavicon(target, asset);
      toast.success("Image uploaded", "Save changes to publish it on the storefront.");
    } catch (error) {
      toast.error("Image upload failed", error instanceof Error ? error.message : "Try another image.");
    } finally {
      setUploadingTarget(null);
      event.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!branding.siteTitle.trim()) {
      toast.error("Site title is required");
      return;
    }
    if (branding.logo.url && !branding.logo.alt.trim()) {
      setActiveTab("logo");
      toast.error("Logo alt text is required", "Add a short accessible description for the logo.");
      return;
    }

    try {
      const nextBranding = await saveBranding.mutateAsync({
        ...branding,
        siteTitle: branding.siteTitle.trim(),
        logo: { ...branding.logo, alt: branding.logo.alt.trim() },
      });
      setBranding(nextBranding);
      setSaved(true);
      toast.success("Branding published", "The storefront will use the saved media on its next page load.");
      window.setTimeout(() => setSaved(false), 2200);
    } catch (error) {
      toast.error("Branding could not be saved", error instanceof Error ? error.message : "Try again.");
    }
  };

  if (content.isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-slate-400" />
      </div>
    );
  }

  if (content.isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-semibold">Branding could not be loaded from the server.</p>
        </div>
        <button type="button" onClick={() => content.refetch()} className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-rose-700 px-4 text-sm font-semibold text-white">
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
      </div>
    );
  }

  const busy = uploadImages.isPending || saveBranding.isPending;

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Storefront / Appearance</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-950 md:text-3xl">Logo & Favicon</h1>
            <p className="mt-2 text-sm text-slate-500">Manage the brand media used by the storefront header and browser.</p>
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="inline-flex h-10 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-sm font-semibold text-emerald-700"><Check className="h-4 w-4" /> Saved</span>}
            <button type="button" onClick={() => void handleSave()} disabled={busy} className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
              {saveBranding.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saveBranding.isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>

        <div className="mt-6 flex border-b border-slate-200">
          {(["logo", "favicon"] as const).map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`border-b-2 px-5 pb-3 text-sm font-semibold capitalize transition ${activeTab === tab ? "border-slate-950 text-slate-950" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
              {tab}
            </button>
          ))}
        </div>
      </header>

      {activeTab === "logo" ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold text-slate-950">Primary logo</h2>
                <p className="mt-1 text-sm text-slate-500">Displayed in the desktop and mobile storefront navigation.</p>
              </div>
              {branding.logo.url && <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700"><Check className="h-4 w-4" /> Uploaded</span>}
            </div>

            <button type="button" onClick={() => logoInputRef.current?.click()} disabled={busy} className="mt-6 flex min-h-64 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 transition hover:border-slate-400 disabled:cursor-wait">
              {uploadingTarget === "logo" ? (
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              ) : branding.logo.url ? (
                <img src={branding.logo.url} alt={branding.logo.alt} className="max-h-40 max-w-full object-contain" />
              ) : (
                <span className="text-center"><Upload className="mx-auto h-8 w-8 text-slate-400" /><span className="mt-3 block text-sm font-semibold text-slate-700">Upload primary logo</span><span className="mt-1 block text-xs text-slate-500">PNG, JPEG, WebP, or SVG up to 8 MB</span></span>
              )}
            </button>
            <input ref={logoInputRef} type="file" accept={acceptedImages} className="hidden" disabled={busy} onChange={(event) => void uploadAsset(event, "logo")} />

            {branding.logo.url && (
              <div className="mt-4 flex items-center gap-3">
                <span className="min-w-0 flex-1 truncate text-xs text-slate-500">{assetName(branding.logo)}</span>
                <button type="button" onClick={() => logoInputRef.current?.click()} disabled={busy} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"><RefreshCw className="h-4 w-4" /> Replace</button>
                <button type="button" onClick={() => updateLogo(emptyAsset(branding.siteTitle))} disabled={busy} aria-label="Remove logo" className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            )}
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-950">Logo settings</h2>
            <label className="mt-5 block">
              <span className="text-sm font-semibold text-slate-700">Site title</span>
              <input value={branding.siteTitle} maxLength={100} onChange={(event) => setBranding((current) => ({ ...current, siteTitle: event.target.value }))} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400" />
            </label>
            <label className="mt-4 block">
              <span className="text-sm font-semibold text-slate-700">Logo alt text</span>
              <input value={branding.logo.alt} maxLength={180} onChange={(event) => updateLogo({ alt: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400" />
              <span className="mt-2 block text-xs leading-5 text-slate-500">A short accessible description, usually the business name.</span>
            </label>
            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-600">Use a transparent logo with clear contrast. A wide image works best in the navigation; the current local SOSBD logo remains the fallback when no upload is saved.</div>
          </aside>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div>
            <h2 className="font-semibold text-slate-950">Browser and device icons</h2>
            <p className="mt-1 text-sm text-slate-500">Upload square PNG or ICO files for the cleanest result.</p>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {faviconOptions.map((option) => {
              const asset = branding.favicons[option.key];
              const uploading = uploadingTarget === option.key;
              return (
                <article key={option.key} className="rounded-xl border border-slate-200 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div><h3 className="text-sm font-semibold text-slate-900">{option.label}</h3><p className="mt-1 text-xs text-slate-400">{option.size}</p></div>
                    {asset.url && <Check className="h-4 w-4 text-emerald-600" />}
                  </div>
                  <button type="button" onClick={() => faviconRefs.current[option.key]?.click()} disabled={busy} className="mt-4 flex h-36 w-full items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-slate-400 disabled:cursor-wait">
                    {uploading ? <Loader2 className="h-7 w-7 animate-spin text-slate-400" /> : asset.url ? <img src={asset.url} alt="" className="h-16 w-16 object-contain" /> : <ImageIcon className="h-7 w-7 text-slate-300" />}
                  </button>
                  <input ref={(element) => { faviconRefs.current[option.key] = element; }} type="file" accept={acceptedImages} className="hidden" disabled={busy} onChange={(event) => void uploadAsset(event, option.key)} />
                  <div className="mt-3 flex items-center gap-2">
                    <span className="min-w-0 flex-1 truncate text-xs text-slate-400">{assetName(asset) || "No image"}</span>
                    {asset.url && <button type="button" onClick={() => updateFavicon(option.key, emptyAsset())} disabled={busy} aria-label={`Remove ${option.label}`} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>}
                  </div>
                </article>
              );
            })}
          </div>
          {faviconOptions.some(({ key }) => !branding.favicons[key].url) && (
            <div className="mt-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><AlertCircle className="h-5 w-5 shrink-0" /><p>Missing sizes use the primary logo fallback. Uploading each listed size gives the best browser and device result.</p></div>
          )}
        </div>
      )}
    </section>
  );
}

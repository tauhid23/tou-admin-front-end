import { useState, type ChangeEvent } from "react";
import {
  ArrowUpRight,
  Eye,
  ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import {
  useAdminAboutPage,
  useSaveAboutPage,
  useUploadImages,
  type AboutImage,
  type AboutPageContent,
} from "@/lib/api/queries";
import { useToast } from "@/lib/providers/ToastProvider";

const defaultContent: AboutPageContent = {
  eyebrow: "Who we are",
  heroTitle: "Commerce built on trust, quality, and lasting partnerships.",
  heroDescription: "SOSBD connects ambitious businesses with dependable products and practical sourcing support from Bangladesh.",
  heroImage: {
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1800&q=85",
    publicId: "",
    alt: "SOSBD team collaborating around a table",
  },
  stats: [
    { value: "2018", label: "Founded in Bangladesh" },
    { value: "250+", label: "Products sourced" },
    { value: "12+", label: "Markets supported" },
    { value: "98%", label: "On-time fulfilment" },
  ],
  storyEyebrow: "Our story",
  storyTitle: "Local expertise. Global ambition.",
  story: "SOSBD started with a simple belief: growing businesses deserve a sourcing partner that communicates clearly and delivers consistently.\n\nFrom our base in Dhaka, we bring together product knowledge, responsible supplier relationships, and hands-on quality oversight. Today, we help retailers and entrepreneurs move from idea to delivery with fewer unknowns and more confidence.",
  storyImage: {
    url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=85",
    publicId: "",
    alt: "A diverse team working together",
  },
  missionTitle: "Our mission",
  mission: "To make dependable sourcing more accessible through transparent communication, careful quality control, and solutions shaped around each customer.",
  visionTitle: "Our vision",
  vision: "To become the most trusted bridge between Bangladesh's makers and businesses around the world.",
  valuesEyebrow: "What guides us",
  valuesTitle: "Principles behind every partnership",
  values: [
    { title: "Quality without compromise", description: "We set clear standards and pay attention to the details that protect your reputation." },
    { title: "Radical transparency", description: "Honest timelines, practical advice, and proactive updates keep every project grounded." },
    { title: "Partnership mindset", description: "We work as an extension of your team and make decisions with the long term in mind." },
    { title: "Responsible progress", description: "We pursue better materials, smarter processes, and more thoughtful ways to grow." },
  ],
  ctaTitle: "Ready to build something better?",
  ctaDescription: "Tell us what you are looking for and our team will help you find the right next step.",
  ctaLabel: "Start a conversation",
  ctaUrl: "/contact",
};

const STOREFRONT_URL = import.meta.env.VITE_STOREFRONT_URL ?? "http://localhost:3000";

export default function AboutUsEditor() {
  const query = useAdminAboutPage();

  if (query.isLoading) return <StateCard loading message="Loading About page content…" />;
  if (query.isError) {
    return (
      <StateCard
        message={query.error instanceof Error ? query.error.message : "The About page could not be loaded."}
        onRetry={() => void query.refetch()}
      />
    );
  }

  return <Editor key={query.data?.updatedAt ?? "default"} initialContent={query.data ?? defaultContent} onRefresh={() => void query.refetch()} fetching={query.isFetching} />;
}

function Editor({ initialContent, onRefresh, fetching }: { initialContent: AboutPageContent; onRefresh: () => void; fetching: boolean }) {
  const [content, setContent] = useState<AboutPageContent>(initialContent);
  const [dirty, setDirty] = useState(false);
  const save = useSaveAboutPage();
  const upload = useUploadImages();
  const toast = useToast();

  const update = <K extends keyof AboutPageContent>(key: K, value: AboutPageContent[K]) => {
    setContent((current) => ({ ...current, [key]: value }));
    setDirty(true);
  };

  const saveContent = async () => {
    try {
      await save.mutateAsync(content);
      setDirty(false);
      toast.success("About page published", "Your changes are now available to the storefront.");
    } catch (error) {
      toast.error("Could not save About page", getErrorMessage(error));
    }
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>, key: "heroImage" | "storyImage") => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const [uploaded] = await upload.mutateAsync({ files: [file], folder: "sosbd/about" });
      if (!uploaded) throw new Error("No image was returned by the upload service.");
      update(key, { ...content[key], url: uploaded.url, publicId: uploaded.publicId });
      toast.success("Image uploaded", "Save the page to publish the new image.");
    } catch (error) {
      toast.error("Image upload failed", getErrorMessage(error));
    }
  };

  const updateStat = (index: number, key: "value" | "label", value: string) => {
    update("stats", content.stats.map((stat, itemIndex) => itemIndex === index ? { ...stat, [key]: value } : stat));
  };

  const updateValue = (index: number, key: "title" | "description", value: string) => {
    update("values", content.values.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  };

  return (
    <section className="space-y-6">
      <header className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 p-5 sm:p-6 xl:flex-row xl:items-center xl:justify-between xl:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15"><Sparkles className="h-5 w-5" /></span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Storefront / Pages &amp; Content</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">About Us</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Shape your company narrative, credibility signals, mission, and brand values from one publishing workspace.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={onRefresh} disabled={fetching || dirty} title={dirty ? "Save your changes before refreshing" : undefined} className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
              <RefreshCw className={`h-4 w-4 ${fetching ? "animate-spin" : ""}`} /> Refresh
            </button>
            <a href={`${STOREFRONT_URL}/about`} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"><Eye className="h-4 w-4" /> Preview</a>
            <button type="button" onClick={() => void saveContent()} disabled={!dirty || save.isPending || upload.isPending} className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45">
              {save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {save.isPending ? "Publishing…" : "Publish changes"}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-slate-100 px-5 py-3 sm:px-8">
          <span className={`h-2.5 w-2.5 rounded-full ${dirty ? "bg-amber-400" : "bg-emerald-500"}`} />
          <p className="text-xs font-medium text-slate-500">{dirty ? "You have unpublished changes" : "Published content is up to date"}</p>
        </div>
      </header>

      <div className="grid min-w-0 gap-6 2xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="min-w-0 space-y-6">
          <Panel title="Hero" description="Make your positioning immediately clear. A 16:10 landscape image works best.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Eyebrow" value={content.eyebrow} onChange={(value) => update("eyebrow", value)} maxLength={80} />
              <div className="sm:col-span-2"><Input label="Headline" value={content.heroTitle} onChange={(value) => update("heroTitle", value)} maxLength={180} /></div>
              <div className="sm:col-span-2"><TextArea label="Introduction" value={content.heroDescription} onChange={(value) => update("heroDescription", value)} maxLength={600} rows={3} /></div>
              <div className="sm:col-span-2"><ImageField label="Hero image" image={content.heroImage} busy={upload.isPending} onUpload={(event) => void uploadImage(event, "heroImage")} onAltChange={(alt) => update("heroImage", { ...content.heroImage, alt })} /></div>
            </div>
          </Panel>

          <Panel title="Company highlights" description="Use short, verifiable numbers that strengthen confidence. Up to four highlights are supported.">
            <div className="grid gap-4 sm:grid-cols-2">
              {content.stats.map((stat, index) => (
                <div key={index} className="relative grid grid-cols-[110px_minmax(0,1fr)] gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <Input label="Value" value={stat.value} onChange={(value) => updateStat(index, "value", value)} maxLength={30} />
                  <Input label="Label" value={stat.label} onChange={(value) => updateStat(index, "label", value)} maxLength={80} />
                  {content.stats.length > 1 && <button type="button" onClick={() => update("stats", content.stats.filter((_, itemIndex) => itemIndex !== index))} className="absolute right-2 top-2 rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-rose-600" aria-label={`Remove highlight ${index + 1}`}><Trash2 className="h-3.5 w-3.5" /></button>}
                </div>
              ))}
            </div>
            {content.stats.length < 4 && <AddButton label="Add highlight" onClick={() => update("stats", [...content.stats, { value: "New", label: "Company highlight" }])} />}
          </Panel>

          <Panel title="Company story" description="Explain why SOSBD exists, how it works, and why customers can trust the team.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Eyebrow" value={content.storyEyebrow} onChange={(value) => update("storyEyebrow", value)} maxLength={80} />
              <Input label="Story headline" value={content.storyTitle} onChange={(value) => update("storyTitle", value)} maxLength={160} />
              <div className="sm:col-span-2"><TextArea label="Story copy" hint="Separate paragraphs with a blank line." value={content.story} onChange={(value) => update("story", value)} maxLength={4000} rows={8} /></div>
              <div className="sm:col-span-2"><ImageField label="Story image" image={content.storyImage} busy={upload.isPending} onUpload={(event) => void uploadImage(event, "storyImage")} onAltChange={(alt) => update("storyImage", { ...content.storyImage, alt })} /></div>
            </div>
          </Panel>

          <Panel title="Mission & vision" description="Keep each statement focused, specific, and easy to remember.">
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-4 rounded-xl border border-slate-200 p-4"><Input label="Mission heading" value={content.missionTitle} onChange={(value) => update("missionTitle", value)} maxLength={100} /><TextArea label="Mission statement" value={content.mission} onChange={(value) => update("mission", value)} maxLength={1200} rows={5} /></div>
              <div className="space-y-4 rounded-xl border border-slate-200 p-4"><Input label="Vision heading" value={content.visionTitle} onChange={(value) => update("visionTitle", value)} maxLength={100} /><TextArea label="Vision statement" value={content.vision} onChange={(value) => update("vision", value)} maxLength={1200} rows={5} /></div>
            </div>
          </Panel>

          <Panel title="Brand values" description="Describe the behaviours customers and partners can expect from your company.">
            <div className="grid gap-5 sm:grid-cols-2"><Input label="Section eyebrow" value={content.valuesEyebrow} onChange={(value) => update("valuesEyebrow", value)} maxLength={80} /><Input label="Section headline" value={content.valuesTitle} onChange={(value) => update("valuesTitle", value)} maxLength={160} /></div>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {content.values.map((value, index) => (
                <div key={index} className="relative space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <span className="text-xs font-bold tracking-wider text-slate-400">VALUE {String(index + 1).padStart(2, "0")}</span>
                  <Input label="Title" value={value.title} onChange={(text) => updateValue(index, "title", text)} maxLength={100} />
                  <TextArea label="Description" value={value.description} onChange={(text) => updateValue(index, "description", text)} maxLength={400} rows={3} />
                  {content.values.length > 1 && <button type="button" onClick={() => update("values", content.values.filter((_, itemIndex) => itemIndex !== index))} className="absolute right-2 top-2 rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-rose-600" aria-label={`Remove value ${index + 1}`}><Trash2 className="h-4 w-4" /></button>}
                </div>
              ))}
            </div>
            {content.values.length < 6 && <AddButton label="Add value" onClick={() => update("values", [...content.values, { title: "New value", description: "Describe what this value means in practice." }])} />}
          </Panel>

          <Panel title="Closing call to action" description="Give visitors one clear next step after they learn about the company.">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2"><Input label="Headline" value={content.ctaTitle} onChange={(value) => update("ctaTitle", value)} maxLength={160} /></div>
              <div className="sm:col-span-2"><TextArea label="Supporting copy" value={content.ctaDescription} onChange={(value) => update("ctaDescription", value)} maxLength={500} rows={3} /></div>
              <Input label="Button label" value={content.ctaLabel} onChange={(value) => update("ctaLabel", value)} maxLength={60} />
              <Input label="Button destination" value={content.ctaUrl} onChange={(value) => update("ctaUrl", value)} maxLength={300} />
            </div>
          </Panel>
        </div>

        <aside className="min-w-0 2xl:sticky 2xl:top-6 2xl:self-start">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Content preview</p>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative h-64 bg-slate-950">
              {content.heroImage.url ? <img src={content.heroImage.url} alt="" className="h-full w-full object-cover opacity-70" /> : <ImageIcon className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-white/20" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 text-white"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-300">{content.eyebrow}</p><h2 className="mt-2 text-2xl font-bold leading-tight">{content.heroTitle}</h2></div>
            </div>
            <div className="grid grid-cols-2 border-b border-slate-100">{content.stats.slice(0, 4).map((stat) => <div key={`${stat.value}-${stat.label}`} className="border-r border-t border-slate-100 p-3"><p className="font-bold text-slate-950">{stat.value}</p><p className="mt-0.5 text-[10px] text-slate-500">{stat.label}</p></div>)}</div>
            <div className="p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-600">{content.storyEyebrow}</p><h3 className="mt-2 text-xl font-bold leading-tight text-slate-950">{content.storyTitle}</h3><p className="mt-3 line-clamp-4 whitespace-pre-line text-xs leading-5 text-slate-500">{content.story}</p>
              <div className="mt-5 grid grid-cols-2 gap-2">{content.values.slice(0, 4).map((value, index) => <div key={index} className="rounded-lg bg-slate-50 p-3"><p className="text-xs font-bold text-slate-800">{value.title}</p></div>)}</div>
              <a href={`${STOREFRONT_URL}/about`} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-950">Open full preview <ArrowUpRight className="h-3.5 w-3.5" /></a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Panel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-bold text-slate-950">{title}</h2><p className="mb-5 mt-1 text-sm leading-6 text-slate-500">{description}</p>{children}</section>;
}

function Input({ label, value, onChange, maxLength }: { label: string; value: string; onChange: (value: string) => void; maxLength?: number }) {
  return <label className="block text-sm font-semibold text-slate-700">{label}<input required value={value} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 font-normal text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100" /></label>;
}

function TextArea({ label, value, onChange, maxLength, rows = 4, hint }: { label: string; value: string; onChange: (value: string) => void; maxLength?: number; rows?: number; hint?: string }) {
  return <label className="block text-sm font-semibold text-slate-700">{label}{hint && <span className="ml-2 text-xs font-normal text-slate-400">{hint}</span>}<textarea required rows={rows} value={value} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 font-normal leading-6 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100" /></label>;
}

function ImageField({ label, image, busy, onUpload, onAltChange }: { label: string; image: AboutImage; busy: boolean; onUpload: (event: ChangeEvent<HTMLInputElement>) => void; onAltChange: (value: string) => void }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <div className="mt-2 grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
        <div className="flex h-32 items-center justify-center overflow-hidden rounded-lg bg-slate-200">{image.url ? <img src={image.url} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="h-7 w-7 text-slate-400" />}</div>
        <div className="min-w-0 space-y-3">
          <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}{busy ? "Uploading…" : "Upload image"}<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={busy} onChange={onUpload} /></label>
          <Input label="Alternative text" value={image.alt} onChange={onAltChange} maxLength={180} />
          <p className="truncate text-[11px] text-slate-400">{image.url || "No image uploaded"}</p>
        </div>
      </div>
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"><Plus className="h-4 w-4" />{label}</button>;
}

function StateCard({ message, loading, onRetry }: { message: string; loading?: boolean; onRetry?: () => void }) {
  return <div className={`flex min-h-72 flex-col items-center justify-center rounded-2xl border p-8 text-center ${onRetry ? "border-rose-200 bg-rose-50 text-rose-700" : "border-slate-200 bg-white text-slate-500"}`}>{loading && <Loader2 className="mb-3 h-6 w-6 animate-spin" />}<p className="text-sm font-medium">{message}</p>{onRetry && <button type="button" onClick={onRetry} className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold shadow-sm">Try again</button>}</div>;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Please try again.";
}

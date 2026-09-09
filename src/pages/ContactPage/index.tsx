import { useState } from "react";
import {
  CheckCircle2,
  Clock3,
  ExternalLink,
  Inbox,
  Loader2,
  Mail,
  MapPinned,
  MessageSquareText,
  Phone,
  RefreshCw,
  Save,
} from "lucide-react";
import {
  useAdminContactPage,
  useContactMessages,
  useSaveContactPage,
  useUpdateContactMessage,
  type ContactMessage,
  type ContactMessageStatus,
  type ContactPageContent,
} from "@/lib/api/queries";
import { useToast } from "@/lib/providers/ToastProvider";

const defaultContent: ContactPageContent = {
  eyebrow: "Contact us",
  title: "Let’s start a conversation",
  description: "Questions about an order, a product, or working with us? Our team is ready to help.",
  address: "Dhaka, Bangladesh",
  email: "hello@sosbd.com",
  phone: "+880 1XXX-XXXXXX",
  businessHours: "Saturday–Thursday, 9:00 AM–6:00 PM",
  responseTime: "Usually replies within one business day",
  mapEmbedUrl: "https://www.google.com/maps?q=Dhaka%2C%20Bangladesh&output=embed",
  mapLink: "https://www.google.com/maps/search/?api=1&query=Dhaka%2C%20Bangladesh",
  mapEnabled: true,
};

type Tab = "content" | "messages";
const STOREFRONT_URL = import.meta.env.VITE_STOREFRONT_URL ?? "http://localhost:3000";

export default function ContactPageManager() {
  const [tab, setTab] = useState<Tab>("content");
  const contentQuery = useAdminContactPage();
  const inboxSummary = useContactMessages("all");
  const contact = contentQuery.data ?? defaultContent;

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 p-5 sm:p-6 xl:flex-row xl:items-center xl:justify-between xl:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
              <MessageSquareText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Storefront / Pages &amp; Content</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">Contact Page</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Manage the public contact experience and respond to customer enquiries without leaving the dashboard.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                void contentQuery.refetch();
                void inboxSummary.refetch();
              }}
              disabled={contentQuery.isFetching || inboxSummary.isFetching}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${contentQuery.isFetching || inboxSummary.isFetching ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <a
              href={`${STOREFRONT_URL}/contact`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              View storefront <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid gap-px border-y border-slate-100 bg-slate-100 sm:grid-cols-3">
          <Summary label="Page status" value="Published" detail="Visible on the storefront" tone="emerald" />
          <Summary label="Map" value={contact.mapEnabled ? "Enabled" : "Hidden"} detail={contact.address || "No address configured"} />
          <Summary label="New messages" value={String(inboxSummary.data?.counts.new ?? 0)} detail={`${inboxSummary.data?.counts.all ?? 0} total enquiries`} tone={(inboxSummary.data?.counts.new ?? 0) > 0 ? "rose" : undefined} />
        </div>

        <div className="flex gap-1 p-2 sm:w-fit">
          <TabButton active={tab === "content"} onClick={() => setTab("content")} icon={MapPinned} label="Content & Map" />
          <TabButton active={tab === "messages"} onClick={() => setTab("messages")} icon={Inbox} label={`Messages (${inboxSummary.data?.counts.new ?? 0})`} />
        </div>
      </div>

      <div>
        {tab === "content" ? (
          contentQuery.isLoading ? (
            <LoadingCard label="Loading contact page…" />
          ) : contentQuery.isError ? (
            <ErrorCard message={contentQuery.error instanceof Error ? contentQuery.error.message : "Could not load contact content."} />
          ) : (
            <ContentEditor initialContent={contentQuery.data ?? defaultContent} />
          )
        ) : (
          <MessagesInbox />
        )}
      </div>
    </section>
  );
}

function ContentEditor({ initialContent }: { initialContent: ContactPageContent }) {
  const [content, setContent] = useState<ContactPageContent>(initialContent);
  const [dirty, setDirty] = useState(false);
  const save = useSaveContactPage();
  const toast = useToast();

  const update = <K extends keyof ContactPageContent>(key: K, value: ContactPageContent[K]) => {
    setContent((current) => ({ ...current, [key]: value }));
    setDirty(true);
  };

  const saveContent = async () => {
    try {
      await save.mutateAsync(content);
      setDirty(false);
      toast.success("Contact page saved", "The homepage and contact page now use these details.");
    } catch (error) {
      toast.error("Could not save contact page", error instanceof Error ? error.message : undefined);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className={`h-2.5 w-2.5 rounded-full ${dirty ? "bg-amber-400" : "bg-emerald-500"}`} />
          <div>
            <p className="text-sm font-semibold text-slate-800">{dirty ? "Unsaved changes" : "Content is up to date"}</p>
            <p className="text-xs text-slate-500">One configuration powers both the homepage section and contact page.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={saveContent}
          disabled={save.isPending || !dirty}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {save.isPending ? "Saving…" : "Save changes"}
        </button>
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_400px] 2xl:grid-cols-[minmax(0,1fr)_440px]">
        <div className="min-w-0 space-y-6">
        <Section title="Page content" description="Keep the message concise; these fields appear on both public contact experiences.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Eyebrow" value={content.eyebrow} onChange={(value) => update("eyebrow", value)} maxLength={80} />
            <Input label="Page title" value={content.title} onChange={(value) => update("title", value)} maxLength={140} />
            <div className="sm:col-span-2">
              <TextArea label="Introduction" value={content.description} onChange={(value) => update("description", value)} maxLength={600} />
            </div>
          </div>
        </Section>

        <Section title="Contact details" description="These details become clickable email and phone actions on the storefront.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Public email" type="email" value={content.email} onChange={(value) => update("email", value)} maxLength={180} />
            <Input label="Public phone" value={content.phone} onChange={(value) => update("phone", value)} maxLength={40} />
            <Input label="Business hours" value={content.businessHours} onChange={(value) => update("businessHours", value)} maxLength={160} />
            <Input label="Response promise" value={content.responseTime} onChange={(value) => update("responseTime", value)} maxLength={160} />
          </div>
        </Section>

        <Section title="Location & Google Map" description="In Google Maps choose Share → Embed a map, then copy the URL inside the iframe src attribute.">
          <div className="space-y-5">
            <Input label="Display address" value={content.address} onChange={(value) => update("address", value)} maxLength={300} />
            <Input label="Google Maps embed URL" type="url" value={content.mapEmbedUrl} onChange={(value) => update("mapEmbedUrl", extractMapUrl(value))} />
            <Input label="Open-in-Google-Maps link" type="url" value={content.mapLink} onChange={(value) => update("mapLink", value)} />
            <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
              <span>
                <span className="block text-sm font-semibold text-slate-800">Show map</span>
                <span className="mt-0.5 block text-xs text-slate-500">Turn this off to show a branded location panel instead.</span>
              </span>
              <input type="checkbox" checked={content.mapEnabled} onChange={(event) => update("mapEnabled", event.target.checked)} className="h-5 w-5 accent-slate-950" />
            </label>
          </div>
        </Section>

        </div>

        <aside className="min-w-0 xl:sticky xl:top-22 xl:self-start">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Live preview</p>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative h-72 bg-slate-900">
            {content.mapEnabled && content.mapEmbedUrl ? (
              <iframe title="Map preview" src={content.mapEmbedUrl} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#475569,transparent_40%),linear-gradient(145deg,#1e293b,#020617)]" />
            )}
            <div className="absolute inset-x-4 bottom-4 rounded-xl bg-slate-950/90 p-4 text-white backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-300">Our location</p>
              <p className="mt-1 text-sm font-semibold">{content.address || "Your business address"}</p>
            </div>
          </div>
          <div className="p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-600">{content.eyebrow || "Contact us"}</p>
            <h2 className="mt-2 text-2xl font-bold leading-tight text-slate-950">{content.title || "Your page title"}</h2>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{content.description || "Your introduction appears here."}</p>
            <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm text-slate-600">
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-rose-500" />{content.email}</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-rose-500" />{content.phone}</p>
              <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-rose-500" />{content.businessHours}</p>
            </div>
          </div>
        </div>
        </aside>
      </div>
    </div>
  );
}

function MessagesInbox() {
  const [filter, setFilter] = useState<"all" | ContactMessageStatus>("all");
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const query = useContactMessages(filter);
  const updateStatus = useUpdateContactMessage();
  const toast = useToast();

  const changeStatus = async (message: ContactMessage, status: ContactMessageStatus) => {
    setSelected((current) => current?._id === message._id ? { ...current, status } : current);
    try {
      await updateStatus.mutateAsync({ id: message._id, status });
      if (status === "resolved") toast.success("Message resolved");
    } catch (error) {
      setSelected(message);
      toast.error("Could not update message", error instanceof Error ? error.message : undefined);
    }
  };

  const openMessage = (message: ContactMessage) => {
    setSelected(message.status === "new" ? { ...message, status: "read" } : message);
    if (message.status === "new") void changeStatus(message, "read");
  };

  if (query.isLoading) return <LoadingCard label="Loading messages…" />;
  if (query.isError) return <ErrorCard message={query.error instanceof Error ? query.error.message : "Could not load messages."} />;

  const data = query.data;
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap gap-2 border-b border-slate-100 p-4">
          {(["all", "new", "read", "resolved"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${filter === status ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {status} <span className="ml-1 opacity-70">{data?.counts[status] ?? 0}</span>
            </button>
          ))}
        </div>
        {data?.messages.length ? (
          <div className="divide-y divide-slate-100">
            {data.messages.map((message) => (
              <button
                type="button"
                key={message._id}
                onClick={() => openMessage(message)}
                className={`grid w-full grid-cols-[auto_minmax(0,1fr)_auto] gap-3 p-4 text-left transition hover:bg-slate-50 ${selected?._id === message._id ? "bg-slate-50" : ""}`}
              >
                <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${message.status === "new" ? "bg-rose-500" : message.status === "resolved" ? "bg-emerald-500" : "bg-slate-300"}`} />
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span className={`truncate text-sm ${message.status === "new" ? "font-bold text-slate-950" : "font-semibold text-slate-700"}`}>{message.name}</span>
                    <span className="truncate text-xs text-slate-400">{message.email}</span>
                  </span>
                  <span className="mt-1 block truncate text-sm font-medium text-slate-700">{message.subject}</span>
                  <span className="mt-1 block truncate text-xs text-slate-400">{message.message}</span>
                </span>
                <span className="whitespace-nowrap text-xs text-slate-400">{formatDate(message.createdAt)}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="px-5 py-20 text-center">
            <MessageSquareText className="mx-auto h-9 w-9 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-600">No messages here</p>
            <p className="mt-1 text-xs text-slate-400">New contact submissions will appear automatically.</p>
          </div>
        )}
      </section>

      <aside className="xl:sticky xl:top-6 xl:self-start">
        {selected ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <StatusBadge status={selected.status} />
                <h2 className="mt-3 text-xl font-bold text-slate-950">{selected.subject}</h2>
                <p className="mt-1 text-xs text-slate-400">Received {formatDate(selected.createdAt, true)}</p>
              </div>
            </div>
            <div className="mt-5 space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
              <p className="font-semibold text-slate-800">{selected.name}</p>
              <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-slate-600 hover:text-slate-950"><Mail className="h-4 w-4" />{selected.email}</a>
              {selected.phone && <a href={`tel:${selected.phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-2 text-slate-600 hover:text-slate-950"><Phone className="h-4 w-4" />{selected.phone}</a>}
            </div>
            <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-700">{selected.message}</p>
            <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
              <a href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`} className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"><Mail className="h-4 w-4" />Reply by email</a>
              {selected.status !== "resolved" ? (
                <button type="button" onClick={() => void changeStatus(selected, "resolved")} disabled={updateStatus.isPending} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"><CheckCircle2 className="h-4 w-4" />Resolve</button>
              ) : (
                <button type="button" onClick={() => void changeStatus(selected, "read")} disabled={updateStatus.isPending} className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Reopen</button>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <Inbox className="mx-auto h-9 w-9 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-600">Select a message</p>
            <p className="mt-1 text-xs text-slate-400">Open a conversation to read and manage it.</p>
          </div>
        )}
      </aside>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: typeof Inbox; label: string }) {
  return <button type="button" onClick={onClick} className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition sm:flex-none ${active ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}><Icon className="h-4 w-4" />{label}</button>;
}

function Summary({ label, value, detail, tone }: { label: string; value: string; detail: string; tone?: "emerald" | "rose" }) {
  const valueClass = tone === "emerald" ? "text-emerald-700" : tone === "rose" ? "text-rose-700" : "text-slate-950";
  return (
    <div className="min-w-0 bg-white px-5 py-4 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-lg font-bold ${valueClass}`}>{value}</p>
      <p className="mt-0.5 truncate text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-bold text-slate-950">{title}</h2><p className="mb-5 mt-1 text-sm text-slate-500">{description}</p>{children}</section>;
}

function Input({ label, value, onChange, type = "text", maxLength }: { label: string; value: string; onChange: (value: string) => void; type?: string; maxLength?: number }) {
  return <label className="block text-sm font-semibold text-slate-700">{label}<input required type={type} value={value} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 font-normal text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100" /></label>;
}

function TextArea({ label, value, onChange, maxLength }: { label: string; value: string; onChange: (value: string) => void; maxLength?: number }) {
  return <label className="block text-sm font-semibold text-slate-700">{label}<textarea required rows={4} value={value} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 font-normal text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100" /></label>;
}

function StatusBadge({ status }: { status: ContactMessageStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ${status === "new" ? "bg-rose-50 text-rose-700" : status === "resolved" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{status}</span>;
}

function LoadingCard({ label }: { label: string }) {
  return <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white"><Loader2 className="mr-2 h-5 w-5 animate-spin text-slate-400" /><span className="text-sm text-slate-500">{label}</span></div>;
}

function ErrorCard({ message }: { message: string }) {
  return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">{message}</div>;
}

function extractMapUrl(value: string) {
  const match = value.match(/src=["']([^"']+)["']/i);
  return (match?.[1] ?? value).replaceAll("&amp;", "&").trim();
}

function formatDate(value: string, includeTime = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, includeTime ? { dateStyle: "medium", timeStyle: "short" } : { month: "short", day: "numeric" }).format(date);
}

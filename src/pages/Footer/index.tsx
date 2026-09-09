import { useState } from "react";
import {
  Check,
  CreditCard,
  Eye,
  GripVertical,
  Link as LinkIcon,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type FooterLink = {
  id: string;
  label: string;
  href: string;
  visible: boolean;
};

type FooterColumn = {
  id: string;
  title: string;
  visible: boolean;
  links: FooterLink[];
};

type SocialLink = {
  id: string;
  label: string;
  href: string;
  visible: boolean;
};

const initialColumns: FooterColumn[] = [
  {
    id: "company",
    title: "Company",
    visible: true,
    links: [
      { id: "rewards", label: "Join PODUR Rewards", href: "#", visible: true },
      { id: "reviews", label: "Verified Reviews", href: "#", visible: true },
      { id: "story", label: "Our Story", href: "#", visible: true },
      { id: "blog", label: "Blog", href: "#", visible: true },
      { id: "contact", label: "Contact us", href: "/contact", visible: true },
    ],
  },
  {
    id: "good-to-know",
    title: "Good to Know",
    visible: true,
    links: [
      { id: "returns", label: "Returns & Exchanges", href: "#", visible: true },
      { id: "shipping", label: "Shipping information", href: "#", visible: true },
      { id: "benefits", label: "Your benefits", href: "#", visible: true },
      { id: "faq", label: "FAQ", href: "#", visible: true },
      { id: "sitemap", label: "Sitemap", href: "#", visible: true },
    ],
  },
  {
    id: "collections",
    title: "Our Collections",
    visible: true,
    links: [
      { id: "eid", label: "Eid Collections", href: "#", visible: true },
      { id: "women", label: "Woman's Collections", href: "/collections/women", visible: true },
      { id: "hijab", label: "Hijab Collections", href: "#", visible: true },
      { id: "kids", label: "Kids Collections", href: "/collections/kids", visible: true },
      { id: "baby", label: "Baby Collections", href: "#", visible: true },
    ],
  },
];

const initialSocials: SocialLink[] = [
  { id: "tiktok", label: "TikTok", href: "#", visible: true },
  { id: "pinterest", label: "Pinterest", href: "#", visible: true },
  { id: "instagram", label: "Instagram", href: "#", visible: false },
  { id: "facebook", label: "Facebook", href: "#", visible: false },
];

const paymentMethods = [
  "AMEX",
  "Apple Pay",
  "Bancontact",
  "Diners Club",
  "Discover",
  "Google Pay",
  "iDEAL",
  "Klarna",
  "Maestro",
  "Mastercard",
  "Shop Pay",
  "Union Pay",
  "Visa",
];

const inputClass =
  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400";

export default function FooterManager() {
  const [columns, setColumns] = useState(initialColumns);
  const [socials, setSocials] = useState(initialSocials);
  const [copyright, setCopyright] = useState("© 2026 - SOSBD DEVELOPED BY TAUHID");
  const [socialDescription, setSocialDescription] = useState(
    "Connect with us and stay updated on our latest collections and offers."
  );
  const [payments, setPayments] = useState(paymentMethods);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  const updateColumn = (columnId: string, value: Partial<FooterColumn>) => {
    setColumns((current) =>
      current.map((column) => (column.id === columnId ? { ...column, ...value } : column))
    );
  };

  const updateLink = (columnId: string, linkId: string, value: Partial<FooterLink>) => {
    setColumns((current) =>
      current.map((column) =>
        column.id === columnId
          ? {
              ...column,
              links: column.links.map((link) =>
                link.id === linkId ? { ...link, ...value } : link
              ),
            }
          : column
      )
    );
  };

  const addLink = (columnId: string) => {
    setColumns((current) =>
      current.map((column) =>
        column.id === columnId
          ? {
              ...column,
              links: [
                ...column.links,
                { id: `link-${Date.now()}`, label: "New footer link", href: "#", visible: true },
              ],
            }
          : column
      )
    );
  };

  const removeLink = (columnId: string, linkId: string) => {
    setColumns((current) =>
      current.map((column) =>
        column.id === columnId
          ? { ...column, links: column.links.filter((link) => link.id !== linkId) }
          : column
      )
    );
  };

  const updateSocial = (id: string, value: Partial<SocialLink>) => {
    setSocials((current) =>
      current.map((social) => (social.id === id ? { ...social, ...value } : social))
    );
  };

  const removePayment = (method: string) => {
    setPayments((current) => current.filter((item) => item !== method));
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Storefront / Footer
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
              Footer Manager
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Manage footer columns, public links, social profiles, payment badges, and legal text
              from one professional storefront control surface.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {saved && (
              <span className="inline-flex h-11 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-sm font-semibold text-emerald-700">
                <Check className="h-4 w-4" />
                Saved
              </span>
            )}
            <button onClick={save} className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800">
              <Save className="h-4 w-4" />
              Save footer
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <div className="grid gap-5 lg:grid-cols-3">
            {columns.map((column) => (
              <div key={column.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-slate-300" />
                  <input
                    value={column.title}
                    onChange={(event) => updateColumn(column.id, { title: event.target.value })}
                    className="min-w-0 flex-1 border-0 bg-transparent text-base font-bold text-slate-950 outline-none"
                  />
                  <input
                    type="checkbox"
                    checked={column.visible}
                    onChange={(event) => updateColumn(column.id, { visible: event.target.checked })}
                    aria-label={`Toggle ${column.title}`}
                  />
                </div>
                <div className="space-y-3">
                  {column.links.map((link) => (
                    <div key={link.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <div className="flex items-center gap-2">
                        <input
                          value={link.label}
                          onChange={(event) => updateLink(column.id, link.id, { label: event.target.value })}
                          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none"
                        />
                        <input
                          type="checkbox"
                          checked={link.visible}
                          onChange={(event) => updateLink(column.id, link.id, { visible: event.target.checked })}
                          aria-label={`Toggle ${link.label}`}
                        />
                        <button onClick={() => removeLink(column.id, link.id)} className="text-rose-500" aria-label="Delete footer link">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="relative mt-2">
                        <LinkIcon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        <input
                          value={link.href}
                          onChange={(event) => updateLink(column.id, link.id, { href: event.target.value })}
                          className={cn(inputClass, "h-9 pl-8 font-mono text-xs")}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => addLink(column.id)} className="mt-4 inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <Plus className="h-4 w-4" />
                  Add link
                </button>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-950">Social Media</h2>
              <textarea
                value={socialDescription}
                onChange={(event) => setSocialDescription(event.target.value)}
                className="mt-3 min-h-20 w-full resize-y rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-slate-400"
              />
              <div className="mt-4 space-y-3">
                {socials.map((social) => (
                  <div key={social.id} className="grid grid-cols-[34px_1fr_1fr_24px] items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                      {social.label.slice(0, 2).toUpperCase()}
                    </div>
                    <input value={social.label} onChange={(event) => updateSocial(social.id, { label: event.target.value })} className={inputClass} />
                    <input value={social.href} onChange={(event) => updateSocial(social.id, { href: event.target.value })} className={cn(inputClass, "font-mono text-xs")} />
                    <input type="checkbox" checked={social.visible} onChange={(event) => updateSocial(social.id, { visible: event.target.checked })} />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-950">Payment & Legal</h2>
              <label className="mt-4 block">
                <span className="text-sm font-semibold text-slate-700">Copyright text</span>
                <input value={copyright} onChange={(event) => setCopyright(event.target.value)} className={cn(inputClass, "mt-2")} />
              </label>
              <div className="mt-5">
                <p className="text-sm font-semibold text-slate-700">Payment badges</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {payments.map((method) => (
                    <span key={method} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                      <CreditCard className="h-3.5 w-3.5" />
                      {method}
                      <button onClick={() => removePayment(method)} className="text-slate-400 hover:text-rose-500" aria-label={`Remove ${method}`}>
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-950">Footer Preview</h2>
            <Eye className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-5 rounded-2xl border border-slate-200 p-5">
            <div className="grid grid-cols-2 gap-5">
              {columns.filter((column) => column.visible).map((column) => (
                <div key={column.id}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-950">{column.title}</p>
                  <div className="mt-3 space-y-2">
                    {column.links.filter((link) => link.visible).slice(0, 5).map((link) => (
                      <p key={link.id} className="text-xs text-slate-500">{link.label}</p>
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-950">Social Media</p>
                <p className="mt-3 text-xs leading-5 text-slate-500">{socialDescription}</p>
                <div className="mt-3 flex gap-2">
                  {socials.filter((social) => social.visible).map((social) => (
                    <span key={social.id} className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-xs font-bold text-slate-600">
                      {social.label.slice(0, 1)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 border-t border-slate-100 pt-4">
              <div className="flex flex-wrap gap-1.5">
                {payments.slice(0, 8).map((method) => (
                  <span key={method} className="rounded border border-slate-200 px-2 py-1 text-[9px] font-bold text-slate-500">
                    {method}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-[10px] uppercase tracking-wide text-slate-400">{copyright}</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

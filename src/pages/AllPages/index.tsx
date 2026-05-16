import { useState, useMemo } from "react";
import {
  Search, Plus, MoreHorizontal, Eye, Edit3, Copy, Trash2,
  Globe, Lock, FileText, Filter, ChevronDown, CheckSquare,
  Square, ArrowUpDown, ExternalLink, Clock, Check, LayoutTemplate
} from "lucide-react";

type Status = "published" | "draft" | "private" | "scheduled";
interface Page {
  id: number;
  title: string;
  slug: string;
  status: Status;
  template: string;
  lastModified: string;
  author: string;
  views: number;
  isHomepage?: boolean;
}

const PAGES: Page[] = [
  { id: 1, title: "Home", slug: "/", status: "published", template: "Homepage", lastModified: "2025-05-14", author: "Admin", views: 12840, isHomepage: true },
  { id: 2, title: "About Us", slug: "/about", status: "published", template: "Default", lastModified: "2025-05-10", author: "Admin", views: 3210 },
  { id: 3, title: "Shop", slug: "/shop", status: "published", template: "Shop Archive", lastModified: "2025-05-13", author: "Admin", views: 8920 },
  { id: 4, title: "Contact", slug: "/contact", status: "published", template: "Default", lastModified: "2025-04-28", author: "Admin", views: 1540 },
  { id: 5, title: "Sale Landing Page", slug: "/sale", status: "draft", template: "Landing Page", lastModified: "2025-05-15", author: "Editor", views: 0 },
  { id: 6, title: "Privacy Policy", slug: "/privacy", status: "published", template: "Legal", lastModified: "2025-03-01", author: "Admin", views: 320 },
  { id: 7, title: "Terms & Conditions", slug: "/terms", status: "published", template: "Legal", lastModified: "2025-03-01", author: "Admin", views: 215 },
  { id: 8, title: "Summer Collection Launch", slug: "/summer-2025", status: "scheduled", template: "Landing Page", lastModified: "2025-05-16", author: "Editor", views: 0 },
  { id: 9, title: "Wholesale", slug: "/wholesale", status: "private", template: "Default", lastModified: "2025-04-10", author: "Admin", views: 88 },
  { id: 10, title: "FAQ", slug: "/faq", status: "published", template: "Default", lastModified: "2025-04-22", author: "Admin", views: 1870 },
  { id: 11, title: "Careers", slug: "/careers", status: "draft", template: "Default", lastModified: "2025-05-01", author: "Editor", views: 0 },
  { id: 12, title: "Size Guide", slug: "/size-guide", status: "published", template: "Default", lastModified: "2025-04-15", author: "Admin", views: 4310 },
];

const STATUS_CONFIG: Record<Status, { label: string; bg: string; text: string; icon: JSX.Element }> = {
  published: { label: "Published", bg: "bg-emerald-50", text: "text-emerald-700", icon: <Globe size={11} /> },
  draft:     { label: "Draft",     bg: "bg-gray-100",   text: "text-gray-500",   icon: <FileText size={11} /> },
  private:   { label: "Private",   bg: "bg-amber-50",   text: "text-amber-700",  icon: <Lock size={11} /> },
  scheduled: { label: "Scheduled", bg: "bg-blue-50",    text: "text-blue-700",   icon: <Clock size={11} /> },
};

type SortKey = "title" | "lastModified" | "views" | "status";

export default function AllPages() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>("lastModified");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [pages, setPages] = useState<Page[]>(PAGES);

  const filtered = useMemo(() => {
    let list = [...pages];
    if (search) list = list.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase()));
    if (filterStatus !== "all") list = list.filter(p => p.status === filterStatus);
    list.sort((a, b) => {
      let va: any = a[sortKey], vb: any = b[sortKey];
      if (sortKey === "views") { va = a.views; vb = b.views; }
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      return sortDir === "asc" ? (va < vb ? -1 : 1) : (va > vb ? -1 : 1);
    });
    return list;
  }, [pages, search, filterStatus, sortKey, sortDir]);

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(p => p.id)));
  };

  const toggleOne = (id: number) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const deletePage = (id: number) => { setPages(p => p.filter(x => x.id !== id)); setOpenMenu(null); };
  const duplicatePage = (id: number) => {
    const orig = pages.find(p => p.id === id)!;
    const dup: Page = { ...orig, id: Date.now(), title: orig.title + " (Copy)", slug: orig.slug + "-copy", status: "draft", views: 0 };
    setPages(p => [...p, dup]); setOpenMenu(null);
  };
  const deleteSelected = () => { setPages(p => p.filter(x => !selected.has(x.id))); setSelected(new Set()); };

  const statusCounts = useMemo(() => {
    const c: Record<string, number> = { all: pages.length };
    pages.forEach(p => { c[p.status] = (c[p.status] || 0) + 1; });
    return c;
  }, [pages]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 font-medium">Pages &amp; Content</p>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">All Pages</h1>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-medium">
                <Check size={13} /> Saved
              </span>
            )}
            <button className="flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              <Plus size={15} /> New Page
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Stat Pills */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          {([["all", "All"], ["published", "Published"], ["draft", "Drafts"], ["scheduled", "Scheduled"], ["private", "Private"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilterStatus(key as any)}
              className={`text-sm font-medium px-3 py-1.5 rounded-full border transition-colors ${
                filterStatus === key
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {label}
              <span className={`ml-1.5 text-xs font-bold ${filterStatus === key ? "text-white/70" : "text-gray-400"}`}>
                {statusCounts[key] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search pages..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
          {selected.size > 0 && (
            <div className="flex items-center gap-2 ml-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
              <span className="text-xs font-semibold text-blue-700">{selected.size} selected</span>
              <button onClick={deleteSelected} className="text-xs font-semibold text-red-600 hover:text-red-800 ml-1">Delete</button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="w-10 px-4 py-3">
                  <button onClick={toggleAll} className="text-gray-400 hover:text-gray-700">
                    {selected.size === filtered.length && filtered.length > 0 ? <CheckSquare size={15} className="text-gray-700" /> : <Square size={15} />}
                  </button>
                </th>
                <th className="text-left px-4 py-3">
                  <button onClick={() => handleSort("title")} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-800">
                    Page Title <ArrowUpDown size={11} />
                  </button>
                </th>
                <th className="text-left px-4 py-3">
                  <button onClick={() => handleSort("status")} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-800">
                    Status <ArrowUpDown size={11} />
                  </button>
                </th>
                <th className="text-left px-4 py-3 hidden md:table-cell">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Template</span>
                </th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">
                  <button onClick={() => handleSort("lastModified")} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-800">
                    Modified <ArrowUpDown size={11} />
                  </button>
                </th>
                <th className="text-right px-4 py-3 hidden lg:table-cell">
                  <button onClick={() => handleSort("views")} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-800 ml-auto">
                    Views <ArrowUpDown size={11} />
                  </button>
                </th>
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(page => {
                const sc = STATUS_CONFIG[page.status];
                return (
                  <tr key={page.id} className={`hover:bg-gray-50 transition-colors group ${selected.has(page.id) ? "bg-blue-50/40" : ""}`}>
                    <td className="px-4 py-3.5">
                      <button onClick={() => toggleOne(page.id)} className="text-gray-300 hover:text-gray-600">
                        {selected.has(page.id) ? <CheckSquare size={15} className="text-blue-600" /> : <Square size={15} />}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{page.title}</span>
                            {page.isHomepage && (
                              <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded font-medium">Home</span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 font-mono">{page.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border ${sc.bg} ${sc.text} border-current/20`}>
                        {sc.icon} {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <LayoutTemplate size={12} className="text-gray-300" /> {page.template}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-xs text-gray-500">{page.lastModified}</td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-right text-xs font-medium text-gray-600">
                      {page.views > 0 ? page.views.toLocaleString() : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3.5 relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === page.id ? null : page.id)}
                        className="p-1.5 text-gray-300 hover:text-gray-700 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <MoreHorizontal size={15} />
                      </button>
                      {openMenu === page.id && (
                        <div className="absolute right-4 top-10 z-20 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 w-44">
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                            <Edit3 size={13} className="text-gray-400" /> Edit page
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                            <Eye size={13} className="text-gray-400" /> Preview
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                            <ExternalLink size={13} className="text-gray-400" /> View live
                          </button>
                          <button onClick={() => duplicatePage(page.id)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                            <Copy size={13} className="text-gray-400" /> Duplicate
                          </button>
                          <div className="border-t border-gray-100 my-1" />
                          <button onClick={() => deletePage(page.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5">
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <FileText size={28} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm font-semibold text-gray-500">No pages found</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
          <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between">
            <p className="text-xs text-gray-400">{filtered.length} of {pages.length} pages</p>
          </div>
        </div>
      </div>
      {openMenu !== null && <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />}
    </div>
  );
}
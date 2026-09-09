import { useState, useRef } from "react";
import {
  Upload,
  Trash2,
  Check,
  AlertCircle,
  Image as ImageIcon,
  RefreshCw,
  Info,
  Globe,
} from "lucide-react";

interface Logo {
  id: string;
  label: string;
  description: string;
  recommended: string;
  file: string | null;
  preview: string | null;
}

interface FaviconVariant {
  id: string;
  label: string;
  size: string;
  file: string | null;
  preview: string | null;
}

const LOGO_SAMPLE = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png";
const FAVICON_SAMPLE = "https://www.amazon.com/favicon.ico";

const initialLogo: Logo = {
  id: "primary",
  label: "Primary Logo",
  description: "Main logo used across your store header",
  recommended: "PNG or SVG • Transparent background • Minimum 300×80px",
  file: "logo-primary.png",
  preview: LOGO_SAMPLE,
};

const initialFavicons: FaviconVariant[] = [
  { id: "16", label: "Favicon (Browser Tab)", size: "16×16px", file: "favicon-16.png", preview: FAVICON_SAMPLE },
  { id: "32", label: "Favicon (Retina)", size: "32×32px", file: null, preview: null },
  { id: "180", label: "Apple Touch Icon", size: "180×180px", file: null, preview: null },
  { id: "192", label: "Android Chrome", size: "192×192px", file: null, preview: null },
];

export default function LogoFavicon() {
  const [logo, setLogo] = useState<Logo>(initialLogo);
  const [favicons, setFavicons] = useState<FaviconVariant[]>(initialFavicons);
  const [altText, setAltText] = useState("My Store Logo");
  const [siteTitle, setSiteTitle] = useState("My E-Commerce Store");
  const [activeTab, setActiveTab] = useState<"logo" | "favicon">("logo");
  const [saved, setSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const faviconRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setLogo((prev) => ({
      ...prev,
      file: file.name,
      preview: url,
    }));
  };

  const handleFaviconUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setFavicons((prev) =>
      prev.map((f) => (f.id === id ? { ...f, file: file.name, preview: url } : f))
    );
  };

  const removeLogo = () => {
    setLogo((prev) => ({ ...prev, file: null, preview: null }));
  };

  const removeFavicon = (id: string) => {
    setFavicons((prev) =>
      prev.map((f) => (f.id === id ? { ...f, file: null, preview: null } : f))
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 font-medium">
              Storefront / Appearance
            </p>
            <h1 className="text-2xl font-bold text-gray-900">Logo & Favicon</h1>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200">
                <Check size={16} /> Changes Saved
              </span>
            )}
            <button
              onClick={handleSave}
              className="bg-black text-white text-sm font-semibold px-6 py-3 rounded-2xl hover:bg-gray-800 transition"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mt-6 border-b">
          {(["logo", "favicon"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "logo" ? "Logo" : "Favicon"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        {activeTab === "logo" && (
          <div className="space-y-8">
            {/* Primary Logo Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Primary Logo</h3>
                  <p className="text-sm text-gray-500 mt-1">{logo.description}</p>
                </div>
                {logo.file && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full flex items-center gap-1">
                    <Check size={14} /> Uploaded
                  </span>
                )}
              </div>

              <div className="flex gap-8">
                {/* Preview Area */}
                <div
                  className="flex-1 border-2 border-dashed border-gray-300 rounded-2xl h-52 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-all group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {logo.preview ? (
                    <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
                      <img
                        src={logo.preview}
                        alt="Logo Preview"
                        className="max-h-28 max-w-64 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-gray-200 transition">
                        <Upload size={28} className="text-gray-400" />
                      </div>
                      <p className="mt-4 font-medium text-gray-700">Upload Primary Logo</p>
                      <p className="text-sm text-gray-400 mt-1">PNG or SVG recommended</p>
                    </div>
                  )}
                </div>

                {/* Upload Controls */}
                <div className="w-80 space-y-5">
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                    <p className="text-xs uppercase font-semibold text-gray-500 mb-2">Recommended Specs</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{logo.recommended}</p>
                  </div>

                  {logo.file ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
                        <ImageIcon size={18} className="text-gray-400" />
                        <span className="truncate">{logo.file}</span>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1 flex items-center justify-center gap-2 border border-gray-200 bg-white py-3 rounded-2xl hover:bg-gray-50 font-medium transition"
                        >
                          <RefreshCw size={18} /> Replace
                        </button>
                        <button
                          onClick={removeLogo}
                          className="px-5 text-red-500 border border-red-100 bg-red-50 rounded-2xl hover:bg-red-100 transition"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-4 border border-dashed border-gray-300 rounded-2xl text-sm font-semibold hover:border-gray-400 transition"
                    >
                      Choose Logo File
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.svg"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </div>
              </div>
            </div>

            {/* Logo Settings */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8">
              <h3 className="text-lg font-semibold mb-6">Logo Settings</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
                  <input
                    type="text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="My Store Logo"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">For accessibility and SEO</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Title (Fallback)</label>
                  <input
                    type="text"
                    value={siteTitle}
                    onChange={(e) => setSiteTitle(e.target.value)}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "favicon" && (
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-3xl p-5 flex gap-4">
              <Info size={22} className="text-blue-600 mt-0.5" />
              <p className="text-sm text-blue-700">
                Upload different sizes for the best experience across browsers and devices. PNG with transparent background works best.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {favicons.map((fav) => (
                <div key={fav.id} className="bg-white border border-gray-200 rounded-3xl p-6">
                  <div className="flex justify-between mb-5">
                    <div>
                      <h4 className="font-semibold">{fav.label}</h4>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">{fav.size}</p>
                    </div>
                    {fav.file && <Check size={20} className="text-emerald-600" />}
                  </div>

                  <div
                    className="border-2 border-dashed border-gray-200 rounded-2xl h-40 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition"
                    onClick={() => faviconRefs.current[fav.id]?.click()}
                  >
                    {fav.preview ? (
                      <img src={fav.preview} alt="" className="h-16 w-16 object-contain" />
                    ) : (
                      <>
                        <ImageIcon size={32} className="text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500">Upload Image</p>
                      </>
                    )}
                  </div>

                  <input
                    ref={(el) => { faviconRefs.current[fav.id] = el; }}
                    type="file"
                    accept="image/*,.ico"
                    className="hidden"
                    onChange={(e) => handleFaviconUpload(fav.id, e)}
                  />

                  {fav.file && (
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex-1 text-xs bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 truncate">
                        {fav.file}
                      </div>
                      <button
                        onClick={() => removeFavicon(fav.id)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {favicons.some((f) => !f.file) && (
              <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex gap-4 text-sm">
                <AlertCircle size={22} className="text-amber-500 mt-0.5" />
                <p className="text-amber-700">
                  Some sizes are missing. We recommend uploading all sizes for the best appearance.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
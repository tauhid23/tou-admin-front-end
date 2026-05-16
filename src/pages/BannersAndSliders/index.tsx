import { useState } from "react";
import {
  Plus, Trash2, Edit3, Eye, GripVertical,
  Upload, Link, Clock, ToggleLeft,
  ToggleRight, ChevronDown, ChevronUp, Layers, X, Check,
  Monitor, Smartphone
} from "lucide-react";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  position: "left" | "center" | "right";
  active: boolean;
  startDate: string;
  endDate: string;
  order: number;
}

const defaultSlides: Slide[] = [
  {
    id: 1,
    title: "Summer Collection 2025",
    subtitle: "Discover the latest trends",
    buttonText: "Shop Now",
    buttonLink: "/summer",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    position: "left",
    active: true,
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    order: 1,
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Fresh styles every week",
    buttonText: "Explore",
    buttonLink: "/new",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    position: "center",
    active: true,
    startDate: "2025-05-01",
    endDate: "2025-12-31",
    order: 2,
  },
  {
    id: 3,
    title: "Flash Sale – 50% Off",
    subtitle: "Limited time offer",
    buttonText: "Grab Deal",
    buttonLink: "/sale",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
    position: "right",
    active: false,
    startDate: "2025-07-01",
    endDate: "2025-07-07",
    order: 3,
  },
];

type Tab = "slides" | "settings";

export default function BannersSliders() {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [activeTab, setActiveTab] = useState<Tab>("slides");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [showPreview, setShowPreview] = useState(false);
  const [previewSlide, setPreviewSlide] = useState<Slide | null>(null);
  const [saved, setSaved] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [speed, setSpeed] = useState(5);
  const [transition, setTransition] = useState("fade");
  const [showDots, setShowDots] = useState(true);
  const [showArrows, setShowArrows] = useState(true);

  const toggleActive = (id: number) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const deleteSlide = (id: number) => {
    setSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now(),
      title: "New Banner",
      subtitle: "Add your subtitle here",
      buttonText: "Learn More",
      buttonLink: "/",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      position: "left",
      active: false,
      startDate: "",
      endDate: "",
      order: slides.length + 1,
    };
    setSlides((prev) => [...prev, newSlide]);
    setExpandedId(newSlide.id);
    setEditingId(newSlide.id);
  };

  const updateSlide = (id: number, field: keyof Slide, value: any) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = () => {
    setEditingId(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const openPreview = (slide: Slide) => {
    setPreviewSlide(slide);
    setShowPreview(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 font-medium">
              Storefront / Appearance
            </p>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Banners &amp; Sliders
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                <Check size={14} /> Changes saved
              </span>
            )}
            <button
              onClick={handleSave}
              className="bg-gray-900 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mt-5 border-b border-gray-100 -mb-5">
          {(["slides", "settings"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-semibold capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab === "slides" ? "Slides" : "Slider Settings"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 py-7 max-w-5xl">
        {activeTab === "slides" && (
          <>
            {/* Slide Count Info */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">{slides.length}</span> slides total —{" "}
                <span className="text-emerald-600 font-semibold">
                  {slides.filter((s) => s.active).length} active
                </span>
              </p>
              <button
                onClick={addSlide}
                className="flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Plus size={15} /> Add Slide
              </button>
            </div>

            {/* Slides List */}
            <div className="space-y-3">
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                >
                  {/* Slide Row */}
                  <div className="flex items-center gap-4 px-5 py-4">
                    <GripVertical size={16} className="text-gray-300 cursor-grab flex-shrink-0" />

                    {/* Thumbnail */}
                    <div className="w-20 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {slide.title}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{slide.subtitle}</p>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        slide.active
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}
                    >
                      {slide.active ? "Active" : "Hidden"}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => openPreview(slide)}
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Preview"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => toggleActive(slide.id)}
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title={slide.active ? "Hide" : "Show"}
                      >
                        {slide.active ? <ToggleRight size={15} className="text-emerald-500" /> : <ToggleLeft size={15} />}
                      </button>
                      <button
                        onClick={() => {
                          setExpandedId(expandedId === slide.id ? null : slide.id);
                          setEditingId(slide.id);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => deleteSlide(slide.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                      <button
                        onClick={() => setExpandedId(expandedId === slide.id ? null : slide.id)}
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {expandedId === slide.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Edit Form */}
                  {expandedId === slide.id && (
                    <div className="border-t border-gray-100 bg-gray-50 px-6 py-6">
                      <div className="grid grid-cols-2 gap-5">
                        {/* Image URL */}
                        <div className="col-span-2">
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                            Banner Image
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={slide.image}
                              onChange={(e) => updateSlide(slide.id, "image", e.target.value)}
                              className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                              placeholder="Image URL or upload..."
                            />
                            <button className="flex items-center gap-1.5 text-sm font-medium text-gray-600 border border-gray-200 bg-white px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                              <Upload size={14} /> Upload
                            </button>
                          </div>
                        </div>

                        {/* Title */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                            Title
                          </label>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => updateSlide(slide.id, "title", e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                          />
                        </div>

                        {/* Subtitle */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                            Subtitle
                          </label>
                          <input
                            type="text"
                            value={slide.subtitle}
                            onChange={(e) => updateSlide(slide.id, "subtitle", e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                          />
                        </div>

                        {/* Button Text */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                            Button Label
                          </label>
                          <input
                            type="text"
                            value={slide.buttonText}
                            onChange={(e) => updateSlide(slide.id, "buttonText", e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                          />
                        </div>

                        {/* Button Link */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                            Button Link
                          </label>
                          <div className="relative">
                            <Link size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              value={slide.buttonLink}
                              onChange={(e) => updateSlide(slide.id, "buttonLink", e.target.value)}
                              className="w-full text-sm border border-gray-200 rounded-lg pl-8 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                            />
                          </div>
                        </div>

                        {/* Text Position */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                            Text Position
                          </label>
                          <div className="flex gap-2">
                            {(["left", "center", "right"] as const).map((pos) => (
                              <button
                                key={pos}
                                onClick={() => updateSlide(slide.id, "position", pos)}
                                className={`flex-1 text-xs font-semibold py-2 rounded-lg border transition-colors capitalize ${
                                  slide.position === pos
                                    ? "bg-gray-900 text-white border-gray-900"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                                }`}
                              >
                                {pos}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Schedule */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                            Start Date
                          </label>
                          <div className="relative">
                            <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="date"
                              value={slide.startDate}
                              onChange={(e) => updateSlide(slide.id, "startDate", e.target.value)}
                              className="w-full text-sm border border-gray-200 rounded-lg pl-8 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                            End Date
                          </label>
                          <div className="relative">
                            <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="date"
                              value={slide.endDate}
                              onChange={(e) => updateSlide(slide.id, "endDate", e.target.value)}
                              className="w-full text-sm border border-gray-200 rounded-lg pl-8 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-200">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <div
                            onClick={() => toggleActive(slide.id)}
                            className={`w-10 h-5.5 rounded-full transition-colors flex items-center px-0.5 ${
                              slide.active ? "bg-emerald-500" : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
                                slide.active ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {slide.active ? "Slide is active" : "Slide is hidden"}
                          </span>
                        </label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setExpandedId(null)}
                            className="text-sm font-medium text-gray-500 border border-gray-200 px-4 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSave}
                            className="text-sm font-semibold text-white bg-gray-900 px-4 py-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            Save Slide
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {slides.length === 0 && (
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl py-14 text-center">
                <Layers size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm font-semibold text-gray-500">No slides yet</p>
                <p className="text-xs text-gray-400 mt-1">Click "Add Slide" to get started</p>
              </div>
            )}
          </>
        )}

        {activeTab === "settings" && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-7 max-w-lg">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Slider Configuration</h2>

            {/* Autoplay */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">Autoplay</p>
                <p className="text-xs text-gray-400 mt-0.5">Auto-advance slides</p>
              </div>
              <button
                onClick={() => setAutoplay(!autoplay)}
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${
                  autoplay ? "bg-gray-900" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    autoplay ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Speed */}
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm font-semibold text-gray-800">Slide Duration</p>
                <span className="text-sm font-bold text-gray-900">{speed}s</span>
              </div>
              <input
                type="range"
                min={2}
                max={15}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full accent-gray-900"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>2s</span><span>15s</span>
              </div>
            </div>

            {/* Transition */}
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2">Transition Effect</p>
              <div className="grid grid-cols-3 gap-2">
                {["fade", "slide", "zoom"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTransition(t)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-colors capitalize ${
                      transition === t
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-800">Navigation</p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Show dot indicators</p>
                <button
                  onClick={() => setShowDots(!showDots)}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${
                    showDots ? "bg-gray-900" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${showDots ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Show prev/next arrows</p>
                <button
                  onClick={() => setShowArrows(!showArrows)}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${
                    showArrows ? "bg-gray-900" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${showArrows ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-gray-900 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Save Settings
            </button>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && previewSlide && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-3xl shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold text-gray-800">Preview: {previewSlide.title}</p>
                <div className="flex gap-1">
                  {(["desktop", "mobile"] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setPreviewDevice(d)}
                      className={`p-1.5 rounded-md transition-colors ${
                        previewDevice === d ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-700"
                      }`}
                    >
                      {d === "desktop" ? <Monitor size={15} /> : <Smartphone size={15} />}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setShowPreview(false)} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className={`mx-auto transition-all ${previewDevice === "mobile" ? "max-w-xs" : "max-w-full"}`}>
              <div className="relative h-56 overflow-hidden">
                <img src={previewSlide.image} alt={previewSlide.title} className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-black/30 flex flex-col justify-center px-10 ${
                  previewSlide.position === "center" ? "items-center text-center" :
                  previewSlide.position === "right" ? "items-end text-right" : "items-start"
                }`}>
                  <h2 className="text-white text-2xl font-bold">{previewSlide.title}</h2>
                  <p className="text-white/80 text-sm mt-1">{previewSlide.subtitle}</p>
                  <button className="mt-4 bg-white text-gray-900 text-xs font-bold px-5 py-2 rounded-full">{previewSlide.buttonText}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
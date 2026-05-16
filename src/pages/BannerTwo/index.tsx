import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Eye,
  GripVertical,
  Upload,
  Link as LinkIcon,
  ToggleLeft,
  ToggleRight,
  X,
  Check,
  Monitor,
  Smartphone,
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
    order: 3,
  },
];

type Tab = "slides" | "settings";

export default function BannersSlidersTwo() {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [activeTab, setActiveTab] = useState<Tab>("slides");
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [previewSlide, setPreviewSlide] = useState<Slide | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [saved, setSaved] = useState(false);

  // Settings
  const [autoplay, setAutoplay] = useState(true);
  const [speed, setSpeed] = useState(5);
  const [showDots, setShowDots] = useState(true);
  const [showArrows, setShowArrows] = useState(true);

  // Drag & Drop
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const toggleActive = (id: number) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const deleteSlide = (id: number) => {
    if (confirm("Are you sure you want to delete this slide?")) {
      setSlides((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now(),
      title: "New Banner",
      subtitle: "Add your description here",
      buttonText: "Shop Now",
      buttonLink: "/",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      position: "center",
      active: true,
      order: slides.length + 1,
    };
    setSlides((prev) => [...prev, newSlide]);
    setEditingSlide(newSlide);
  };

  const updateSlide = (updatedSlide: Slide) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === updatedSlide.id ? updatedSlide : s))
    );
    setEditingSlide(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newSlides = [...slides];
    const [moved] = newSlides.splice(draggedIndex, 1);
    newSlides.splice(targetIndex, 0, moved);

    const reordered = newSlides.map((slide, idx) => ({
      ...slide,
      order: idx + 1,
    }));

    setSlides(reordered);
    setDraggedIndex(null);
  };

  // Close modals with ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEditingSlide(null);
        setPreviewSlide(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 py-5 flex justify-between items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500">Storefront / Appearance</p>
            <h1 className="text-3xl font-bold text-gray-900">Banners & Sliders</h1>
          </div>

          <div className="flex items-center gap-4">
            {saved && (
              <span className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-2xl text-sm font-medium">
                <Check size={18} /> Saved Successfully
              </span>
            )}
            <button
              onClick={() => {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
              }}
              className="bg-black text-white px-6 py-3 rounded-2xl font-semibold hover:bg-gray-800 transition flex items-center gap-2"
            >
              Save All Changes
            </button>
          </div>
        </div>

        
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {slides.length} slides •{" "}
                <span className="text-emerald-600 font-semibold">
                  {slides.filter((s) => s.active).length} active
                </span>
              </p>
              <button
                onClick={addSlide}
                className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-2xl hover:bg-gray-800 transition"
              >
                <Plus size={20} /> Add New Slide
              </button>
            </div>

            <div className="space-y-4">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`bg-white border border-gray-200 rounded-3xl p-6 flex items-center gap-6 group hover:shadow-lg transition-all ${
                    draggedIndex === index ? "opacity-60 scale-[0.98]" : ""
                  }`}
                >
                  <GripVertical size={24} className="text-gray-400 cursor-grab active:cursor-grabbing" />

                  <div className="w-32 h-20 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xl text-gray-900 truncate">{slide.title}</p>
                    <p className="text-gray-500 truncate mt-1">{slide.subtitle}</p>
                  </div>

                  <span
                    className={`px-5 py-2 text-sm font-semibold rounded-full border ${
                      slide.active
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {slide.active ? "ACTIVE" : "HIDDEN"}
                  </span>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => setPreviewSlide(slide)}
                      className="p-4 hover:bg-gray-100 rounded-2xl transition"
                      title="Preview"
                    >
                      <Eye size={22} />
                    </button>
                    <button
                      onClick={() => toggleActive(slide.id)}
                      className="p-4 hover:bg-gray-100 rounded-2xl transition"
                      title="Toggle Visibility"
                    >
                      {slide.active ? (
                        <ToggleRight size={24} className="text-emerald-600" />
                      ) : (
                        <ToggleLeft size={24} />
                      )}
                    </button>
                    <button
                      onClick={() => setEditingSlide(slide)}
                      className="p-4 hover:bg-gray-100 rounded-2xl transition"
                      title="Edit"
                    >
                      <Edit3 size={22} />
                    </button>
                    <button
                      onClick={() => deleteSlide(slide.id)}
                      className="p-4 hover:bg-red-50 text-red-500 rounded-2xl transition"
                      title="Delete"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
        

        {/* Settings Tab */}
        {/* {activeTab === "settings" && (
          <div className="bg-white border border-gray-200 rounded-3xl p-10 max-w-lg">
            <h2 className="text-2xl font-semibold mb-8">Slider Configuration</h2>

            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Autoplay</p>
                  <p className="text-sm text-gray-500">Automatically advance slides</p>
                </div>
                <button
                  onClick={() => setAutoplay(!autoplay)}
                  className={`w-14 h-7 rounded-full transition-all ${autoplay ? "bg-black" : "bg-gray-300"}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow transition-all ${autoplay ? "translate-x-8" : "translate-x-1"}`} />
                </button>
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <p className="font-semibold">Slide Duration</p>
                  <p className="font-bold">{speed} seconds</p>
                </div>
                <input
                  type="range"
                  min={2}
                  max={15}
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full accent-black"
                />
              </div>

              <div className="flex justify-between items-center">
                <p className="font-semibold">Show Dots</p>
                <button
                  onClick={() => setShowDots(!showDots)}
                  className={`w-14 h-7 rounded-full transition-all ${showDots ? "bg-black" : "bg-gray-300"}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow transition-all ${showDots ? "translate-x-8" : "translate-x-1"}`} />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <p className="font-semibold">Show Arrows</p>
                <button
                  onClick={() => setShowArrows(!showArrows)}
                  className={`w-14 h-7 rounded-full transition-all ${showArrows ? "bg-black" : "bg-gray-300"}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow transition-all ${showArrows ? "translate-x-8" : "translate-x-1"}`} />
                </button>
              </div>
            </div>
          </div>
        )} */}
      </div>

      {/* ===================== EDIT MODAL ===================== */}
      {editingSlide && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
            <div className="px-8 py-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Edit Slide</h2>
              <button onClick={() => setEditingSlide(null)} className="p-2 hover:bg-gray-100 rounded-2xl">
                <X size={28} />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Form Section */}
              <div className="flex-1 p-8 overflow-auto space-y-8">
                {/* Image */}
                <div>
                  <p className="font-medium mb-3">Banner Image</p>
                  <div className="border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center">
                    <img
                      src={editingSlide.image}
                      alt="preview"
                      className="mx-auto max-h-56 rounded-2xl shadow-md"
                    />
                    <label className="mt-6 cursor-pointer bg-black text-white inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl hover:bg-gray-800 transition">
                      <Upload size={20} />
                      Upload New Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setEditingSlide({
                              ...editingSlide,
                              image: URL.createObjectURL(file),
                            });
                          }
                        }}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={editingSlide.image}
                    onChange={(e) => setEditingSlide({ ...editingSlide, image: e.target.value })}
                    className="mt-4 w-full px-5 py-3 border border-gray-200 rounded-2xl text-sm"
                    placeholder="Or paste image URL here"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      value={editingSlide.title}
                      onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                      className="w-full px-5 py-3 border border-gray-200 rounded-2xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subtitle</label>
                    <input
                      value={editingSlide.subtitle}
                      onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                      className="w-full px-5 py-3 border border-gray-200 rounded-2xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Button Text</label>
                    <input
                      value={editingSlide.buttonText}
                      onChange={(e) => setEditingSlide({ ...editingSlide, buttonText: e.target.value })}
                      className="w-full px-5 py-3 border border-gray-200 rounded-2xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Button Link</label>
                    <div className="relative">
                      <LinkIcon size={18} className="absolute left-4 top-4 text-gray-400" />
                      <input
                        value={editingSlide.buttonLink}
                        onChange={(e) => setEditingSlide({ ...editingSlide, buttonLink: e.target.value })}
                        className="w-full pl-11 px-5 py-3 border border-gray-200 rounded-2xl"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Text Position</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["left", "center", "right"] as const).map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setEditingSlide({ ...editingSlide, position: pos })}
                        className={`py-4 text-sm font-medium rounded-2xl transition capitalize ${
                          editingSlide.position === pos
                            ? "bg-black text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div className="w-[380px] bg-gray-900 p-6 text-white flex flex-col">
                <p className="uppercase text-xs tracking-widest opacity-60 mb-4">Live Preview</p>
                <div className="flex-1 relative rounded-3xl overflow-hidden border border-gray-700 shadow-inner">
                  <img
                    src={editingSlide.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div
                    className={`absolute inset-0 bg-black/40 flex flex-col justify-center px-8 ${
                      editingSlide.position === "center"
                        ? "items-center text-center"
                        : editingSlide.position === "right"
                        ? "items-end text-right"
                        : "items-start"
                    }`}
                  >
                    <h2 className="text-3xl font-bold leading-tight">{editingSlide.title}</h2>
                    <p className="mt-3 text-lg opacity-90">{editingSlide.subtitle}</p>
                    <button className="mt-8 bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
                      {editingSlide.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t p-6 flex items-center justify-between bg-white">
              <button
                onClick={() => toggleActive(editingSlide.id)}
                className="flex items-center gap-3 text-lg font-medium"
              >
                {editingSlide.active ? (
                  <ToggleRight size={32} className="text-emerald-600" />
                ) : (
                  <ToggleLeft size={32} />
                )}
                {editingSlide.active ? "Slide is Active" : "Slide is Hidden"}
              </button>

              <div className="flex gap-4">
                <button
                  onClick={() => setEditingSlide(null)}
                  className="px-8 py-3 font-medium rounded-2xl hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateSlide(editingSlide)}
                  className="bg-black text-white px-10 py-3 rounded-2xl font-semibold hover:bg-gray-800 transition"
                >
                  Save Slide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewSlide && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl overflow-hidden w-full max-w-4xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-4">
                <p className="font-semibold">Preview: {previewSlide.title}</p>
                <div className="flex gap-1 bg-gray-100 rounded-2xl p-1">
                  {(["desktop", "mobile"] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setPreviewDevice(d)}
                      className={`px-4 py-1.5 rounded-xl transition ${previewDevice === d ? "bg-white shadow" : "text-gray-500"}`}
                    >
                      {d === "desktop" ? <Monitor size={18} /> : <Smartphone size={18} />}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setPreviewSlide(null)} className="p-2 hover:bg-gray-100 rounded-2xl">
                <X size={24} />
              </button>
            </div>

            <div className={`mx-auto transition-all ${previewDevice === "mobile" ? "max-w-sm" : ""}`}>
              <div className="relative h-[420px] overflow-hidden">
                <img
                  src={previewSlide.image}
                  alt={previewSlide.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute inset-0 bg-black/40 flex flex-col justify-center px-12 ${
                    previewSlide.position === "center"
                      ? "items-center text-center"
                      : previewSlide.position === "right"
                      ? "items-end text-right"
                      : "items-start"
                  }`}
                >
                  <h2 className="text-white text-4xl font-bold leading-tight">{previewSlide.title}</h2>
                  <p className="text-white/90 mt-4 text-lg">{previewSlide.subtitle}</p>
                  <button className="mt-8 bg-white text-black px-8 py-3.5 rounded-full font-semibold">
                    {previewSlide.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { Plus, Trash2, Edit3, GripVertical, Play, Pause, Check } from "lucide-react";

interface Tagline {
  id: number;
  text: string;
  color: string;
  active: boolean;
}

const initialTaglines: Tagline[] = [
  {
    id: 1,
    text: "Summer Sale - Up to 50% Off!",
    color: "#ef4444",
    active: true,
  },
  {
    id: 2,
    text: "Free Shipping on Orders Over $50",
    color: "#10b981",
    active: true,
  },
  {
    id: 3,
    text: "New Arrivals Every Week",
    color: "#3b82f6",
    active: true,
  },
  {
    id: 4,
    text: "Premium Quality • Affordable Price",
    color: "#8b5cf6",
    active: false,
  },
];

export default function TaglinesManager() {
  const [taglines, setTaglines] = useState<Tagline[]>(initialTaglines);
  const [newTagline, setNewTagline] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [saved, setSaved] = useState(false);

  const colors = ["#ef4444", "#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899"];

  const addTagline = () => {
    if (!newTagline.trim()) return;

    const newEntry: Tagline = {
      id: Date.now(),
      text: newTagline.trim(),
      color: colors[Math.floor(Math.random() * colors.length)],
      active: true,
    };

    setTaglines([...taglines, newEntry]);
    setNewTagline("");
    handleSave();
  };

  const updateTagline = (id: number) => {
    if (!editText.trim()) return;
    setTaglines(taglines.map(t => t.id === id ? { ...t, text: editText } : t));
    setEditingId(null);
    setEditText("");
    handleSave();
  };

  const deleteTagline = (id: number) => {
    setTaglines(taglines.filter(t => t.id !== id));
    handleSave();
  };

  const toggleActive = (id: number) => {
    setTaglines(taglines.map(t => t.id === id ? { ...t, active: !t.active } : t));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  // Live Preview (Auto rotating)
  const activeTaglines = taglines.filter(t => t.active);
  const [previewIndex, setPreviewIndex] = useState(0);

  // Auto rotate preview
  useState(() => {
    if (!isPlaying || activeTaglines.length === 0) return;
    const interval = setInterval(() => {
      setPreviewIndex((prev) => (prev + 1) % activeTaglines.length);
    }, 2500);
    return () => clearInterval(interval);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-sky-50">
      <div className="max-w-5xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Taglines</h1>
            <p className="text-gray-600 mt-2 text-lg">
              Rotating marketing messages for your top banner
            </p>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-5 py-2.5 rounded-2xl text-sm font-medium">
                <Check size={18} /> Saved
              </div>
            )}
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              Live Banner Preview
              <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">Auto Rotating</span>
            </h3>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-2xl hover:bg-gray-100 transition"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              {isPlaying ? "Pause" : "Play"}
            </button>
          </div>

          <div className="h-24 flex items-center justify-center bg-gradient-to-r from-gray-900 to-black rounded-2xl relative overflow-hidden">
            {activeTaglines.length > 0 ? (
              <div
                key={previewIndex}
                className="text-white text-2xl font-semibold text-center transition-all duration-700 px-10"
                style={{ color: activeTaglines[previewIndex]?.color }}
              >
                {activeTaglines[previewIndex]?.text}
              </div>
            ) : (
              <p className="text-gray-400">No active taglines</p>
            )}
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">Changes every 2.5 seconds</p>
        </div>

        {/* Add New Tagline */}
        <div className="bg-white rounded-3xl p-8 mb-10 shadow">
          <h3 className="font-semibold text-lg mb-4">Add New Tagline</h3>
          <div className="flex gap-4">
            <input
              type="text"
              value={newTagline}
              onChange={(e) => setNewTagline(e.target.value)}
              placeholder="e.g. Free Delivery Across Bangladesh"
              className="flex-1 border border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
              onKeyPress={(e) => e.key === "Enter" && addTagline()}
            />
            <button
              onClick={addTagline}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-10 rounded-2xl font-semibold hover:scale-105 transition flex items-center gap-2"
            >
              <Plus size={24} /> Add
            </button>
          </div>
        </div>

        {/* Taglines List */}
        <div className="space-y-4">
          {taglines.map((tagline, index) => (
            <div
              key={tagline.id}
              className="bg-white border border-gray-100 rounded-3xl p-6 flex items-center gap-6 group hover:shadow-md transition-all"
            >
              <GripVertical className="text-gray-300" size={24} />

              <div className="flex-1">
                {editingId === tagline.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full border-2 border-violet-400 rounded-2xl px-5 py-3 text-lg"
                    autoFocus
                  />
                ) : (
                  <p
                    className="text-xl font-semibold"
                    style={{ color: tagline.color }}
                  >
                    {tagline.text}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {editingId === tagline.id ? (
                  <>
                    <button
                      onClick={() => updateTagline(tagline.id)}
                      className="bg-emerald-600 text-white px-6 py-2.5 rounded-2xl text-sm font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-100 px-5 py-2.5 rounded-2xl text-sm"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(tagline.id);
                        setEditText(tagline.text);
                      }}
                      className="p-3 hover:bg-gray-100 rounded-2xl transition"
                    >
                      <Edit3 size={20} />
                    </button>

                    <button
                      onClick={() => toggleActive(tagline.id)}
                      className={`px-5 py-2 text-sm font-medium rounded-2xl transition ${
                        tagline.active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {tagline.active ? "Active" : "Hidden"}
                    </button>

                    <button
                      onClick={() => deleteTagline(tagline.id)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {taglines.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            No taglines yet. Add your first one above!
          </div>
        )}
      </div>
    </div>
  );
}
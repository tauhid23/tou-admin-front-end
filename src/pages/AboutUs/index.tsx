import { useState } from "react";
import { Save, Upload, Eye } from "lucide-react";

interface AboutContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  story: string;
  mission: string;
  values: string[];
  teamImage: string;
}

const initialContent: AboutContent = {
  heroTitle: "Our Story",
  heroSubtitle: "Crafting quality products with passion since 2018",
  heroImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200",
  story: "Founded with a vision to bring timeless style and quality to everyday life...",
  mission: "To deliver exceptional products while maintaining ethical standards and sustainability.",
  values: ["Quality", "Integrity", "Innovation", "Sustainability"],
  teamImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200",
};

export default function AboutUsEditor() {
  const [content, setContent] = useState<AboutContent>(initialContent);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">About Us Page</h1>
            <p className="text-gray-500">Customize your About Us page</p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-800"
          >
            <Save size={20} /> Save Changes
          </button>
        </div>

        <div className="space-y-10">
          {/* Hero Section */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200">
            <h2 className="text-xl font-semibold mb-6">Hero Section</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Hero Title</label>
                <input
                  value={content.heroTitle}
                  onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
                <input
                  value={content.heroSubtitle}
                  onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-3"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Hero Background Image</label>
              <input
                value={content.heroImage}
                onChange={(e) => setContent({ ...content, heroImage: e.target.value })}
                className="w-full border border-gray-200 rounded-2xl px-5 py-3"
                placeholder="Image URL"
              />
            </div>
          </div>

          {/* Story & Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Our Story</h2>
              <textarea
                value={content.story}
                onChange={(e) => setContent({ ...content, story: e.target.value })}
                className="w-full h-48 border border-gray-200 rounded-2xl px-5 py-4"
              />
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
              <textarea
                value={content.mission}
                onChange={(e) => setContent({ ...content, mission: e.target.value })}
                className="w-full h-48 border border-gray-200 rounded-2xl px-5 py-4"
              />
            </div>
          </div>

          {/* Values */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200">
            <h2 className="text-xl font-semibold mb-6">Core Values</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {content.values.map((value, index) => (
                <input
                  key={index}
                  value={value}
                  onChange={(e) => {
                    const newValues = [...content.values];
                    newValues[index] = e.target.value;
                    setContent({ ...content, values: newValues });
                  }}
                  className="border border-gray-200 rounded-2xl px-5 py-3 text-center"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
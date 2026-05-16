import { useState } from "react";
import { Plus, Trash2, Edit3, Save, Check } from "lucide-react";

interface FooterLink {
  id: number;
  title: string;
  url: string;
}

interface FooterColumn {
  id: number;
  title: string;
  links: FooterLink[];
}

const initialFooter = {
  columns: [
    {
      id: 1,
      title: "Shop",
      links: [
        { id: 101, title: "All Products", url: "/shop" },
        { id: 102, title: "New Arrivals", url: "/new" },
        { id: 103, title: "Best Sellers", url: "/bestsellers" },
      ],
    },
    {
      id: 2,
      title: "Support",
      links: [
        { id: 201, title: "Contact Us", url: "/contact" },
        { id: 202, title: "Shipping Policy", url: "/shipping" },
        { id: 203, title: "Returns", url: "/returns" },
      ],
    },
    {
      id: 3,
      title: "Company",
      links: [
        { id: 301, title: "About Us", url: "/about" },
        { id: 302, title: "Our Story", url: "/story" },
        { id: 303, title: "Careers", url: "/careers" },
      ],
    },
  ],
  newsletter: true,
  copyright: "© 2025 Your Store. All Rights Reserved.",
  socialLinks: ["Facebook", "Instagram", "TikTok", "YouTube"],
};

export default function FooterManager() {
  const [footer, setFooter] = useState(initialFooter);
  const [saved, setSaved] = useState(false);

  const saveFooter = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold">Footer Settings</h1>
            <p className="text-gray-500">Customize your website footer</p>
          </div>
          <button
            onClick={saveFooter}
            className="bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-2"
          >
            <Save size={20} /> Save Footer
          </button>
        </div>

        {saved && (
          <div className="mb-6 bg-emerald-100 text-emerald-700 px-6 py-4 rounded-2xl inline-flex items-center gap-2">
            <Check size={22} /> Footer settings saved successfully
          </div>
        )}

        {/* Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {footer.columns.map((column, colIndex) => (
            <div key={column.id} className="bg-white rounded-3xl p-8 border border-gray-200">
              <h3 className="font-semibold text-lg mb-5">{column.title}</h3>
              <div className="space-y-4">
                {column.links.map((link) => (
                  <div key={link.id} className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3">
                    <input
                      value={link.title}
                      onChange={(e) => {
                        // Simple update logic (you can expand)
                        console.log("Update link", link.id, e.target.value);
                      }}
                      className="flex-1 bg-transparent focus:outline-none"
                    />
                    <Trash2 size={18} className="text-red-400 cursor-pointer" />
                  </div>
                ))}
              </div>
              <button className="mt-6 text-sm text-violet-600 flex items-center gap-2 hover:text-violet-700">
                <Plus size={18} /> Add Link
              </button>
            </div>
          ))}
        </div>

        {/* Newsletter & Copyright */}
        <div className="mt-10 bg-white rounded-3xl p-8">
          <h3 className="font-semibold text-lg mb-6">Footer Options</h3>
          
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Newsletter Signup</p>
                <p className="text-sm text-gray-500">Show email subscription box in footer</p>
              </div>
              <input
                type="checkbox"
                checked={footer.newsletter}
                onChange={() => setFooter({ ...footer, newsletter: !footer.newsletter })}
                className="w-6 h-6 accent-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Copyright Text</label>
              <input
                value={footer.copyright}
                onChange={(e) => setFooter({ ...footer, copyright: e.target.value })}
                className="w-full border border-gray-200 rounded-2xl px-5 py-4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
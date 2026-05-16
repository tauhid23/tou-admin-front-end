import { useState } from "react";
import { Plus, Trash2, Edit3, GripVertical, ChevronDown, Save, Check } from "lucide-react";

interface MenuItem {
  id: number;
  label: string;
  url: string;
  order: number;
  isDropdown: boolean;
  children?: MenuItem[];
}

const initialMenu: MenuItem[] = [
  { id: 1, label: "Home", url: "/", order: 1, isDropdown: false },
  { id: 2, label: "Shop", url: "/shop", order: 2, isDropdown: true, children: [
    { id: 21, label: "All Products", url: "/shop", order: 1, isDropdown: false },
    { id: 22, label: "New Arrivals", url: "/new", order: 2, isDropdown: false },
  ]},
  { id: 3, label: "Categories", url: "/categories", order: 3, isDropdown: false },
  { id: 4, label: "About Us", url: "/about", order: 4, isDropdown: false },
  { id: 5, label: "Contact", url: "/contact", order: 5, isDropdown: false },
];

export default function HeaderMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenu);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [saved, setSaved] = useState(false);

  const saveChanges = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addMenuItem = () => {
    const newItem: MenuItem = {
      id: Date.now(),
      label: "New Menu Item",
      url: "/",
      order: menuItems.length + 1,
      isDropdown: false,
    };
    setMenuItems([...menuItems, newItem]);
    setEditingItem(newItem);
  };

  const updateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems(menuItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    setEditingItem(null);
    saveChanges();
  };

  const deleteMenuItem = (id: number) => {
    if (confirm("Delete this menu item?")) {
      setMenuItems(menuItems.filter(item => item.id !== id));
      saveChanges();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Header Menu</h1>
            <p className="text-gray-500 mt-1">Manage navigation links in your website header</p>
          </div>
          <div className="flex items-center gap-4">
            {saved && <span className="text-emerald-600 flex items-center gap-2"><Check size={20} /> Saved</span>}
            <button
              onClick={saveChanges}
              className="bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-gray-800"
            >
              <Save size={20} /> Save Menu
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow p-8">
          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-semibold">Menu Items</h2>
            <button
              onClick={addMenuItem}
              className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-2xl hover:bg-violet-700"
            >
              <Plus size={20} /> Add Menu Item
            </button>
          </div>

          <div className="space-y-3">
            {menuItems.sort((a, b) => a.order - b.order).map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-2xl p-5 flex items-center gap-5 hover:border-gray-300 transition">
                <GripVertical size={22} className="text-gray-400" />

                {editingItem?.id === item.id ? (
                  <div className="flex-1 grid grid-cols-12 gap-4">
                    <input
                      value={editingItem.label}
                      onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                      className="col-span-5 border border-gray-300 rounded-xl px-4 py-3"
                      placeholder="Menu Label"
                    />
                    <input
                      value={editingItem.url}
                      onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                      className="col-span-5 border border-gray-300 rounded-xl px-4 py-3"
                      placeholder="URL"
                    />
                    <button
                      onClick={() => updateMenuItem(editingItem)}
                      className="col-span-2 bg-black text-white rounded-xl"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.url}</p>
                    </div>
                    {item.isDropdown && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full">Dropdown</span>
                    )}
                  </>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-3 hover:bg-gray-100 rounded-xl"
                  >
                    <Edit3 size={20} />
                  </button>
                  <button
                    onClick={() => deleteMenuItem(item.id)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
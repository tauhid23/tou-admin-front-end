"use client";

import { useMemo, useState } from "react";
import {
  Edit3,
  Layers3,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

type SubcategoryStatus = "Active" | "Hidden";

type Subcategory = {
  id: string;
  name: string;
  slug: string;
  parentCategory: string;
  description: string;
  productCount: number;
  status: SubcategoryStatus;
};

type SubcategoryForm = {
  name: string;
  slug: string;
  parentCategory: string;
  description: string;
  status: SubcategoryStatus;
};

const parentCategories = ["Fashion", "Electronics", "Home & Living", "Beauty"];

const initialSubcategories: Subcategory[] = [
  {
    id: "SUB-2001",
    name: "Men's Clothing",
    slug: "mens-clothing",
    parentCategory: "Fashion",
    description: "Shirts, trousers, jackets, and men's seasonal apparel.",
    productCount: 46,
    status: "Active",
  },
  {
    id: "SUB-2002",
    name: "Audio",
    slug: "audio",
    parentCategory: "Electronics",
    description: "Headphones, speakers, earbuds, and audio accessories.",
    productCount: 31,
    status: "Active",
  },
  {
    id: "SUB-2003",
    name: "Kitchen",
    slug: "kitchen",
    parentCategory: "Home & Living",
    description: "Cookware, storage, utensils, and kitchen essentials.",
    productCount: 19,
    status: "Hidden",
  },
];

const emptyForm: SubcategoryForm = {
  name: "",
  slug: "",
  parentCategory: parentCategories[0],
  description: "",
  status: "Active",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>(initialSubcategories);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [form, setForm] = useState<SubcategoryForm>(emptyForm);

  const filteredSubcategories = useMemo(() => {
    const term = query.toLowerCase().trim();
    return subcategories.filter((subcategory) => {
      const matchesSearch =
        !term ||
        subcategory.name.toLowerCase().includes(term) ||
        subcategory.slug.toLowerCase().includes(term) ||
        subcategory.parentCategory.toLowerCase().includes(term);
      const matchesCategory =
        categoryFilter === "All" || subcategory.parentCategory === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [categoryFilter, query, subcategories]);

  const activeCount = subcategories.filter((subcategory) => subcategory.status === "Active").length;
  const totalProducts = subcategories.reduce((sum, subcategory) => sum + subcategory.productCount, 0);

  const openCreateModal = () => {
    setEditingSubcategory(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setForm({
      name: subcategory.name,
      slug: subcategory.slug,
      parentCategory: subcategory.parentCategory,
      description: subcategory.description,
      status: subcategory.status,
    });
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    setForm((current) => ({
      ...current,
      name,
      slug: current.slug ? current.slug : slugify(name),
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedSlug = slugify(form.slug || form.name);

    if (editingSubcategory) {
      setSubcategories((current) =>
        current.map((subcategory) =>
          subcategory.id === editingSubcategory.id
            ? {
                ...subcategory,
                ...form,
                slug: normalizedSlug,
              }
            : subcategory
        )
      );
    } else {
      const newSubcategory: Subcategory = {
        ...form,
        id: `SUB-${Date.now().toString().slice(-4)}`,
        slug: normalizedSlug,
        productCount: 0,
      };
      setSubcategories((current) => [newSubcategory, ...current]);
    }

    setIsModalOpen(false);
    setEditingSubcategory(null);
    setForm(emptyForm);
  };

  const toggleStatus = (id: string) => {
    setSubcategories((current) =>
      current.map((subcategory) =>
        subcategory.id === id
          ? {
              ...subcategory,
              status: subcategory.status === "Active" ? "Hidden" : "Active",
            }
          : subcategory
      )
    );
  };

  const deleteSubcategory = (id: string) => {
    setSubcategories((current) => current.filter((subcategory) => subcategory.id !== id));
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Layers3 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                Product Subcategories
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Create subcategories, assign each one to a parent category, and control storefront visibility.
              </p>
            </div>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            New subcategory
          </button>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Subcategories</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{subcategories.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Active</p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">{activeCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Assigned products</p>
            <p className="mt-2 text-2xl font-bold text-[#b07154]">{totalProducts}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
              placeholder="Search subcategories..."
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none focus:border-slate-400"
          >
            <option value="All">All parent categories</option>
            {parentCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-4">Subcategory</th>
                <th className="px-5 py-4">Parent category</th>
                <th className="px-5 py-4">Slug</th>
                <th className="px-5 py-4 text-right">Products</th>
                <th className="px-5 py-4 text-center">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubcategories.map((subcategory) => (
                <tr key={subcategory.id} className="group hover:bg-slate-50/80">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-950">{subcategory.name}</p>
                    <p className="mt-1 max-w-md text-sm text-slate-500">{subcategory.description}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-[#fff8f4] px-3 py-1 text-xs font-semibold text-[#8a5239]">
                      {subcategory.parentCategory}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-slate-500">/{subcategory.slug}</td>
                  <td className="px-5 py-4 text-right font-semibold text-slate-700">
                    {subcategory.productCount}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => toggleStatus(subcategory.id)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        subcategory.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {subcategory.status}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
                      <button
                        onClick={() => openEditModal(subcategory)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white hover:text-slate-900"
                        aria-label={`Edit ${subcategory.name}`}
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteSubcategory(subcategory.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-rose-500 transition hover:bg-rose-50"
                        aria-label={`Delete ${subcategory.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white hover:text-slate-700">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSubcategories.length === 0 && (
          <div className="py-14 text-center">
            <Layers3 className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-600">No subcategories found</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  {editingSubcategory ? "Edit subcategory" : "Create subcategory"}
                </h2>
                <p className="text-sm text-slate-500">Choose the parent category and storefront URL slug.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Subcategory name</span>
                  <input
                    required
                    value={form.name}
                    onChange={(event) => handleNameChange(event.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                    placeholder="Women's Shoes"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Parent category</span>
                  <select
                    value={form.parentCategory}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, parentCategory: event.target.value }))
                    }
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                  >
                    {parentCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Slug</span>
                <input
                  required
                  value={form.slug}
                  onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 font-mono text-sm outline-none focus:border-slate-400"
                  placeholder="womens-shoes"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Description</span>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, description: event.target.value }))
                  }
                  className="mt-2 min-h-24 w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-slate-400"
                  placeholder="Short description for admin reference and storefront planning."
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Status</span>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value as SubcategoryStatus,
                    }))
                  }
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                >
                  <option value="Active">Active</option>
                  <option value="Hidden">Hidden</option>
                </select>
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 p-5">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
              >
                {editingSubcategory ? "Save changes" : "Create subcategory"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Edit3,
  FolderTree,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

type CategoryStatus = "Active" | "Hidden";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  status: CategoryStatus;
  featured: boolean;
};

type CategoryForm = {
  name: string;
  slug: string;
  description: string;
  status: CategoryStatus;
  featured: boolean;
};

const initialCategories: Category[] = [
  {
    id: "CAT-1001",
    name: "Fashion",
    slug: "fashion",
    description: "Clothing, accessories, and seasonal style collections.",
    productCount: 128,
    status: "Active",
    featured: true,
  },
  {
    id: "CAT-1002",
    name: "Electronics",
    slug: "electronics",
    description: "Smart devices, audio, chargers, and tech essentials.",
    productCount: 84,
    status: "Active",
    featured: true,
  },
  {
    id: "CAT-1003",
    name: "Home & Living",
    slug: "home-living",
    description: "Homeware, decor, kitchen, and everyday living products.",
    productCount: 57,
    status: "Hidden",
    featured: false,
  },
];

const emptyForm: CategoryForm = {
  name: "",
  slug: "",
  description: "",
  status: "Active",
  featured: false,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);

  const filteredCategories = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return categories;
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(term) ||
        category.slug.toLowerCase().includes(term) ||
        category.description.toLowerCase().includes(term)
    );
  }, [categories, query]);

  const activeCount = categories.filter((category) => category.status === "Active").length;
  const featuredCount = categories.filter((category) => category.featured).length;

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
      status: category.status,
      featured: category.featured,
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

    if (editingCategory) {
      setCategories((current) =>
        current.map((category) =>
          category.id === editingCategory.id
            ? {
                ...category,
                ...form,
                slug: normalizedSlug,
              }
            : category
        )
      );
    } else {
      const newCategory: Category = {
        ...form,
        id: `CAT-${Date.now().toString().slice(-4)}`,
        slug: normalizedSlug,
        productCount: 0,
      };
      setCategories((current) => [newCategory, ...current]);
    }

    setIsModalOpen(false);
    setEditingCategory(null);
    setForm(emptyForm);
  };

  const toggleStatus = (id: string) => {
    setCategories((current) =>
      current.map((category) =>
        category.id === id
          ? { ...category, status: category.status === "Active" ? "Hidden" : "Active" }
          : category
      )
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((current) => current.filter((category) => category.id !== id));
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <FolderTree className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                Product Categories
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Create, organize, and publish the main catalogue categories shown across the storefront.
              </p>
            </div>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            New category
          </button>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total categories</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{categories.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Active</p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">{activeCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Featured</p>
            <p className="mt-2 text-2xl font-bold text-[#b07154]">{featuredCount}</p>
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
              placeholder="Search categories..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Slug</th>
                <th className="px-5 py-4 text-right">Products</th>
                <th className="px-5 py-4 text-center">Featured</th>
                <th className="px-5 py-4 text-center">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="group hover:bg-slate-50/80">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-950">{category.name}</p>
                    <p className="mt-1 max-w-md text-sm text-slate-500">{category.description}</p>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-slate-500">/{category.slug}</td>
                  <td className="px-5 py-4 text-right font-semibold text-slate-700">
                    {category.productCount}
                  </td>
                  <td className="px-5 py-4 text-center">
                    {category.featured ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#fff8f4] px-2.5 py-1 text-xs font-semibold text-[#8a5239]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Yes
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-400">No</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => toggleStatus(category.id)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        category.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {category.status}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
                      <button
                        onClick={() => openEditModal(category)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white hover:text-slate-900"
                        aria-label={`Edit ${category.name}`}
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-rose-500 transition hover:bg-rose-50"
                        aria-label={`Delete ${category.name}`}
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

        {filteredCategories.length === 0 && (
          <div className="py-14 text-center">
            <FolderTree className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-600">No categories found</p>
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
                  {editingCategory ? "Edit category" : "Create category"}
                </h2>
                <p className="text-sm text-slate-500">Set the category name, URL slug, and visibility.</p>
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
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Category name</span>
                <input
                  required
                  value={form.name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                  placeholder="Beauty"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Slug</span>
                <input
                  required
                  value={form.slug}
                  onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 font-mono text-sm outline-none focus:border-slate-400"
                  placeholder="beauty"
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
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Status</span>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        status: event.target.value as CategoryStatus,
                      }))
                    }
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                  >
                    <option value="Active">Active</option>
                    <option value="Hidden">Hidden</option>
                  </select>
                </label>
                <label className="mt-7 flex h-11 items-center gap-3 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, featured: event.target.checked }))
                    }
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Feature on storefront
                </label>
              </div>
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
                {editingCategory ? "Save changes" : "Create category"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

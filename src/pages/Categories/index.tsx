"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Edit3,
  FolderTree,
  ImagePlus,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  useAdminCategories,
  useDeleteCategory,
  useSaveCategory,
  useUploadImages,
} from "@/lib/api/queries";
import { useToast } from "@/lib/providers/ToastProvider";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type CategoryStatus = "active" | "hidden";

type ApiCategory = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  countLabel?: string;
  image?: {
    url?: string;
    publicId?: string;
    alt?: string;
  };
  featured?: boolean;
  status?: CategoryStatus;
  sortOrder?: number;
  productCount?: number;
  subcategories?: { name: string; slug: string }[];
};

type CategoryForm = {
  name: string;
  slug: string;
  description: string;
  countLabel: string;
  imageUrl: string;
  imagePublicId: string;
  status: CategoryStatus;
  featured: boolean;
  sortOrder: number;
};

const emptyForm: CategoryForm = {
  name: "",
  slug: "",
  description: "",
  countLabel: "",
  imageUrl: "",
  imagePublicId: "",
  status: "active",
  featured: false,
  sortOrder: 0,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

function categoryToForm(category: ApiCategory): CategoryForm {
  return {
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    countLabel: category.countLabel ?? "",
    imageUrl: category.image?.url ?? "",
    imagePublicId: category.image?.publicId ?? "",
    status: category.status ?? "active",
    featured: Boolean(category.featured),
    sortOrder: category.sortOrder ?? 0,
  };
}

export default function CategoriesPage() {
  const toast = useToast();
  const { data = [], isLoading, isError, error, refetch, isFetching } = useAdminCategories();
  const saveCategory = useSaveCategory();
  const deleteCategoryMutation = useDeleteCategory();
  const uploadImages = useUploadImages();
  const categories = data as ApiCategory[];

  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ApiCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<ApiCategory | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);

  const filteredCategories = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return categories;
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(term) ||
        category.slug.toLowerCase().includes(term) ||
        (category.description ?? "").toLowerCase().includes(term)
    );
  }, [categories, query]);

  const activeCount = categories.filter((category) => category.status !== "hidden").length;
  const featuredCount = categories.filter((category) => category.featured).length;
  const isSaving = saveCategory.isPending || uploadImages.isPending;

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (category: ApiCategory) => {
    setEditingCategory(category);
    setForm(categoryToForm(category));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingCategory(null);
    setForm(emptyForm);
  };

  const handleNameChange = (name: string) => {
    setForm((current) => ({
      ...current,
      name,
      slug: current.slug ? current.slug : slugify(name),
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const [uploaded] = await uploadImages.mutateAsync({ files: [file], folder: "sosbd/categories" });
      setForm((current) => ({
        ...current,
        imageUrl: uploaded.url,
        imagePublicId: uploaded.publicId,
      }));
      toast.success("Image uploaded", "Category image is ready to save.");
    } catch (uploadError) {
      toast.error("Image upload failed", getErrorMessage(uploadError));
    } finally {
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedSlug = slugify(form.slug || form.name);
    const payload = {
      name: form.name.trim(),
      slug: normalizedSlug,
      description: form.description.trim(),
      countLabel: form.countLabel.trim(),
      image: {
        url: form.imageUrl.trim(),
        publicId: form.imagePublicId,
        alt: form.name.trim(),
      },
      status: form.status,
      featured: form.featured,
      sortOrder: Number(form.sortOrder) || 0,
    };

    try {
      await saveCategory.mutateAsync({ id: editingCategory?._id, payload });
      toast.success(
        editingCategory ? "Category updated" : "Category created",
        `${payload.name} is now available from the catalogue API.`
      );
      closeModal();
    } catch (saveError) {
      toast.error("Category could not be saved", getErrorMessage(saveError));
    }
  };

  const toggleStatus = async (category: ApiCategory) => {
    try {
      await saveCategory.mutateAsync({
        id: category._id,
        payload: {
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
          countLabel: category.countLabel ?? "",
          image: category.image ?? { url: "", publicId: "", alt: category.name },
          featured: Boolean(category.featured),
          sortOrder: category.sortOrder ?? 0,
          subcategories: category.subcategories ?? [],
          status: category.status === "hidden" ? "active" : "hidden",
        },
      });
      toast.success("Category visibility updated");
    } catch (statusError) {
      toast.error("Status update failed", getErrorMessage(statusError));
    }
  };

  const requestDeleteCategory = (category: ApiCategory) => {
    setCategoryToDelete(category);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategoryMutation.mutateAsync(categoryToDelete._id);
      toast.success("Category deleted", `${categoryToDelete.name} was removed from the catalogue.`);
      setCategoryToDelete(null);
    } catch (deleteError) {
      toast.error("Delete failed", getErrorMessage(deleteError));
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <FolderTree className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                Product Categories
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Create, organize, and publish the catalogue categories shown across the storefront.
              </p>
            </div>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            New category
          </button>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <Stat label="Total categories" value={categories.length} />
          <Stat label="Active" value={activeCount} tone="emerald" />
          <Stat label="Featured" value={featuredCount} tone="warm" />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
              placeholder="Search categories..."
            />
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isFetching}
          >
            {isFetching && <Loader2 className="h-4 w-4 animate-spin" />}
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="grid gap-3 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-20 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : isError ? (
          <div className="py-14 text-center">
            <FolderTree className="mx-auto h-8 w-8 text-rose-300" />
            <p className="mt-3 text-sm font-semibold text-slate-700">Categories could not load</p>
            <p className="mt-1 text-sm text-slate-500">{getErrorMessage(error)}</p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[860px] text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Slug</th>
                    <th className="px-5 py-4">Storefront Count</th>
                    <th className="px-5 py-4 text-right">Products</th>
                    <th className="px-5 py-4 text-right">Subcategories</th>
                    <th className="px-5 py-4 text-center">Featured</th>
                    <th className="px-5 py-4 text-center">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCategories.map((category) => (
                    <CategoryRow
                      key={category._id}
                      category={category}
                      onEdit={openEditModal}
                      onDelete={requestDeleteCategory}
                      onToggleStatus={toggleStatus}
                      disabled={saveCategory.isPending || deleteCategoryMutation.isPending}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 p-4 lg:hidden">
              {filteredCategories.map((category) => (
                <CategoryCard
                  key={category._id}
                  category={category}
                  onEdit={openEditModal}
                  onDelete={requestDeleteCategory}
                  onToggleStatus={toggleStatus}
                  disabled={saveCategory.isPending || deleteCategoryMutation.isPending}
                />
              ))}
            </div>
          </>
        )}

        {!isLoading && !isError && filteredCategories.length === 0 && (
          <div className="py-14 text-center">
            <FolderTree className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-600">No categories found</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <form
            onSubmit={handleSubmit}
            className="flex max-h-[92dvh] w-full max-w-2xl flex-col rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-4 sm:p-5">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-slate-950">
                  {editingCategory ? "Edit category" : "Create category"}
                </h2>
                <p className="text-sm text-slate-500">Set the category name, URL slug, and visibility.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close"
                disabled={isSaving}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
              <div className="grid gap-4 sm:grid-cols-2">
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
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Description</span>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  className="mt-2 min-h-24 w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-slate-400"
                  placeholder="Short description for the storefront category menu."
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Category image</span>
                <div className="mt-2 grid gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 sm:grid-cols-[96px_minmax(0,1fr)] sm:items-center">
                  <div className="h-24 w-full overflow-hidden rounded-xl bg-white sm:w-24">
                    {form.imageUrl ? (
                      <img src={form.imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <ImagePlus className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800">
                      {uploadImages.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ImagePlus className="h-4 w-4" />
                      )}
                      Choose image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploadImages.isPending}
                      />
                    </label>
                    <input
                      value={form.imageUrl}
                      onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
                      className="mt-3 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
                      placeholder="Or paste an image URL"
                    />
                  </div>
                </div>
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Count label</span>
                  <input
                    value={form.countLabel}
                    onChange={(event) => setForm((current) => ({ ...current, countLabel: event.target.value }))}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                    placeholder="120+ items"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Sort order</span>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))
                    }
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Status</span>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, status: event.target.value as CategoryStatus }))
                    }
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                  >
                    <option value="active">Active</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </label>
              </div>

              <label className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Feature on storefront
              </label>
            </div>

            <div className="grid gap-2 border-t border-slate-100 p-4 sm:flex sm:justify-end sm:p-5">
              <button
                type="button"
                onClick={closeModal}
                className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSaving}
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingCategory ? "Save changes" : "Create category"}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(categoryToDelete)}
        title="Delete category?"
        description={
          categoryToDelete
            ? `This will permanently remove "${categoryToDelete.name}" from the admin catalogue and storefront navigation.`
            : ""
        }
        confirmLabel="Delete category"
        tone="danger"
        loading={deleteCategoryMutation.isPending}
        onCancel={() => {
          if (!deleteCategoryMutation.isPending) setCategoryToDelete(null);
        }}
        onConfirm={confirmDeleteCategory}
      />
    </section>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "emerald" | "warm" }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p
        className={`mt-2 text-2xl font-bold ${
          tone === "emerald" ? "text-emerald-600" : tone === "warm" ? "text-[#b07154]" : "text-slate-950"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function CategoryImage({ category }: { category: ApiCategory }) {
  return category.image?.url ? (
    <img src={category.image.url} alt="" className="h-12 w-12 rounded-xl bg-slate-100 object-cover" />
  ) : (
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-300">
      <ImagePlus className="h-5 w-5" />
    </div>
  );
}

function StatusButton({
  category,
  onToggleStatus,
  disabled,
}: {
  category: ApiCategory;
  onToggleStatus: (category: ApiCategory) => void;
  disabled?: boolean;
}) {
  const active = category.status !== "hidden";
  return (
    <button
      onClick={() => onToggleStatus(category)}
      disabled={disabled}
      className={`rounded-full px-3 py-1 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${
        active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
      }`}
    >
      {active ? "Active" : "Hidden"}
    </button>
  );
}

function FeaturedBadge({ featured }: { featured?: boolean }) {
  return featured ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#fff8f4] px-2.5 py-1 text-xs font-semibold text-[#8a5239]">
      <CheckCircle2 className="h-3.5 w-3.5" />
      Yes
    </span>
  ) : (
    <span className="text-xs font-medium text-slate-400">No</span>
  );
}

function RowActions({
  category,
  onEdit,
  onDelete,
  disabled,
}: {
  category: ApiCategory;
  onEdit: (category: ApiCategory) => void;
  onDelete: (category: ApiCategory) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex justify-end gap-1">
      <button
        onClick={() => onEdit(category)}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`Edit ${category.name}`}
        disabled={disabled}
      >
        <Edit3 className="h-4 w-4" />
      </button>
      <button
        onClick={() => onDelete(category)}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-rose-500 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`Delete ${category.name}`}
        disabled={disabled}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function CategoryRow({
  category,
  onEdit,
  onDelete,
  onToggleStatus,
  disabled,
}: {
  category: ApiCategory;
  onEdit: (category: ApiCategory) => void;
  onDelete: (category: ApiCategory) => void;
  onToggleStatus: (category: ApiCategory) => void;
  disabled?: boolean;
}) {
  return (
    <tr className="group hover:bg-slate-50/80">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <CategoryImage category={category} />
          <div className="min-w-0">
            <p className="font-semibold text-slate-950">{category.name}</p>
            <p className="mt-1 max-w-md truncate text-sm text-slate-500">{category.description}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 font-mono text-xs text-slate-500">/{category.slug}</td>
      <td className="px-5 py-4 text-sm font-semibold text-slate-600">
        {category.countLabel || `${category.productCount ?? 0} items`}
      </td>
      <td className="px-5 py-4 text-right font-semibold text-slate-700">
        {category.productCount ?? 0}
      </td>
      <td className="px-5 py-4 text-right font-semibold text-slate-700">
        {category.subcategories?.length ?? 0}
      </td>
      <td className="px-5 py-4 text-center">
        <FeaturedBadge featured={category.featured} />
      </td>
      <td className="px-5 py-4 text-center">
        <StatusButton category={category} onToggleStatus={onToggleStatus} disabled={disabled} />
      </td>
      <td className="px-5 py-4">
        <RowActions category={category} onEdit={onEdit} onDelete={onDelete} disabled={disabled} />
      </td>
    </tr>
  );
}

function CategoryCard({
  category,
  onEdit,
  onDelete,
  onToggleStatus,
  disabled,
}: {
  category: ApiCategory;
  onEdit: (category: ApiCategory) => void;
  onDelete: (category: ApiCategory) => void;
  onToggleStatus: (category: ApiCategory) => void;
  disabled?: boolean;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        <CategoryImage category={category} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-950">{category.name}</h3>
              <p className="mt-1 truncate font-mono text-xs text-slate-500">/{category.slug}</p>
            </div>
            <RowActions category={category} onEdit={onEdit} onDelete={onDelete} disabled={disabled} />
          </div>
          {category.description && (
            <p className="mt-3 line-clamp-2 text-sm leading-5 text-slate-500">{category.description}</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <StatusButton category={category} onToggleStatus={onToggleStatus} disabled={disabled} />
            <FeaturedBadge featured={category.featured} />
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              {category.countLabel || `${category.productCount ?? 0} items`}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              {category.subcategories?.length ?? 0} subcategories
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

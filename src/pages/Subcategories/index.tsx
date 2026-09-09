"use client";

import { useMemo, useState } from "react";
import { Edit3, Layers3, Loader2, Plus, Search, Trash2, X } from "lucide-react";
import {
  useAdminCategories,
  useDeleteSubcategory,
  useSaveSubcategory,
} from "@/lib/api/queries";
import { useToast } from "@/lib/providers/ToastProvider";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type SubcategoryStatus = "active" | "hidden";

type ApiSubcategory = {
  name: string;
  slug: string;
  description?: string;
  status?: SubcategoryStatus;
  sortOrder?: number;
  productCount?: number;
};

type ApiCategory = {
  _id: string;
  name: string;
  slug: string;
  subcategories?: ApiSubcategory[];
};

type SubcategoryRowData = ApiSubcategory & {
  parentId: string;
  parentName: string;
  parentSlug: string;
};

type SubcategoryForm = {
  name: string;
  slug: string;
  parentId: string;
  description: string;
  status: SubcategoryStatus;
  sortOrder: number;
};

const emptyForm: SubcategoryForm = {
  name: "",
  slug: "",
  parentId: "",
  description: "",
  status: "active",
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

function toForm(subcategory: SubcategoryRowData): SubcategoryForm {
  return {
    name: subcategory.name,
    slug: subcategory.slug,
    parentId: subcategory.parentId,
    description: subcategory.description ?? "",
    status: subcategory.status ?? "active",
    sortOrder: subcategory.sortOrder ?? 0,
  };
}

export default function SubcategoriesPage() {
  const toast = useToast();
  const { data = [], isLoading, isError, error, refetch, isFetching } = useAdminCategories();
  const saveSubcategory = useSaveSubcategory();
  const deleteSubcategoryMutation = useDeleteSubcategory();
  const categories = data as ApiCategory[];

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<SubcategoryRowData | null>(null);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<SubcategoryRowData | null>(null);
  const [form, setForm] = useState<SubcategoryForm>(emptyForm);

  const subcategories = useMemo(
    () =>
      categories.flatMap((category) =>
        (category.subcategories ?? []).map((subcategory) => ({
          ...subcategory,
          parentId: category._id,
          parentName: category.name,
          parentSlug: category.slug,
        }))
      ),
    [categories]
  );

  const filteredSubcategories = useMemo(() => {
    const term = query.toLowerCase().trim();
    return subcategories.filter((subcategory) => {
      const matchesSearch =
        !term ||
        subcategory.name.toLowerCase().includes(term) ||
        subcategory.slug.toLowerCase().includes(term) ||
        subcategory.parentName.toLowerCase().includes(term);
      const matchesCategory = categoryFilter === "all" || subcategory.parentId === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [categoryFilter, query, subcategories]);

  const activeCount = subcategories.filter((subcategory) => subcategory.status !== "hidden").length;
  const totalProducts = subcategories.reduce(
    (sum, subcategory) => sum + (subcategory.productCount ?? 0),
    0
  );
  const isSaving = saveSubcategory.isPending;

  const openCreateModal = () => {
    setEditingSubcategory(null);
    setForm({ ...emptyForm, parentId: categories[0]?._id ?? "" });
    setIsModalOpen(true);
  };

  const openEditModal = (subcategory: SubcategoryRowData) => {
    setEditingSubcategory(subcategory);
    setForm(toForm(subcategory));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingSubcategory(null);
    setForm(emptyForm);
  };

  const handleNameChange = (name: string) => {
    setForm((current) => ({
      ...current,
      name,
      slug: current.slug ? current.slug : slugify(name),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.parentId) {
      toast.error("Parent category required", "Create a category before adding subcategories.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug: slugify(form.slug || form.name),
      description: form.description.trim(),
      status: form.status,
      sortOrder: Number(form.sortOrder) || 0,
    };

    try {
      await saveSubcategory.mutateAsync({
        categoryId: form.parentId,
        subcategorySlug: editingSubcategory?.slug,
        payload,
      });
      toast.success(
        editingSubcategory ? "Subcategory updated" : "Subcategory created",
        `${payload.name} is now available under the selected parent category.`
      );
      closeModal();
    } catch (saveError) {
      toast.error("Subcategory could not be saved", getErrorMessage(saveError));
    }
  };

  const toggleStatus = async (subcategory: SubcategoryRowData) => {
    try {
      await saveSubcategory.mutateAsync({
        categoryId: subcategory.parentId,
        subcategorySlug: subcategory.slug,
        payload: {
          name: subcategory.name,
          slug: subcategory.slug,
          description: subcategory.description ?? "",
          sortOrder: subcategory.sortOrder ?? 0,
          status: subcategory.status === "hidden" ? "active" : "hidden",
        },
      });
      toast.success("Subcategory visibility updated");
    } catch (statusError) {
      toast.error("Status update failed", getErrorMessage(statusError));
    }
  };

  const confirmDeleteSubcategory = async () => {
    if (!subcategoryToDelete) return;
    try {
      await deleteSubcategoryMutation.mutateAsync({
        categoryId: subcategoryToDelete.parentId,
        subcategorySlug: subcategoryToDelete.slug,
      });
      toast.success(
        "Subcategory deleted",
        `${subcategoryToDelete.name} was removed from ${subcategoryToDelete.parentName}.`
      );
      setSubcategoryToDelete(null);
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
              <Layers3 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                Product Subcategories
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Create subcategories, assign parent categories, and control storefront menu visibility.
              </p>
            </div>
          </div>
          <button
            onClick={openCreateModal}
            disabled={!categories.length || isLoading}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            New subcategory
          </button>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <Stat label="Subcategories" value={subcategories.length} />
          <Stat label="Active" value={activeCount} tone="emerald" />
          <Stat label="Assigned products" value={totalProducts} tone="warm" />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
              placeholder="Search subcategories..."
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto] lg:flex">
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none focus:border-slate-400"
            >
              <option value="all">All parent categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isFetching && <Loader2 className="h-4 w-4 animate-spin" />}
              Refresh
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-3 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-20 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : isError ? (
          <div className="py-14 text-center">
            <Layers3 className="mx-auto h-8 w-8 text-rose-300" />
            <p className="mt-3 text-sm font-semibold text-slate-700">Subcategories could not load</p>
            <p className="mt-1 text-sm text-slate-500">{getErrorMessage(error)}</p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
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
                    <SubcategoryRow
                      key={`${subcategory.parentId}:${subcategory.slug}`}
                      subcategory={subcategory}
                      disabled={saveSubcategory.isPending || deleteSubcategoryMutation.isPending}
                      onEdit={openEditModal}
                      onDelete={setSubcategoryToDelete}
                      onToggleStatus={toggleStatus}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 p-4 lg:hidden">
              {filteredSubcategories.map((subcategory) => (
                <SubcategoryCard
                  key={`${subcategory.parentId}:${subcategory.slug}`}
                  subcategory={subcategory}
                  disabled={saveSubcategory.isPending || deleteSubcategoryMutation.isPending}
                  onEdit={openEditModal}
                  onDelete={setSubcategoryToDelete}
                  onToggleStatus={toggleStatus}
                />
              ))}
            </div>
          </>
        )}

        {!isLoading && !isError && filteredSubcategories.length === 0 && (
          <div className="py-14 text-center">
            <Layers3 className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-600">No subcategories found</p>
            {!categories.length && (
              <p className="mt-1 text-sm text-slate-500">Create a parent category before adding subcategories.</p>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <form
            onSubmit={handleSubmit}
            className="flex max-h-[92dvh] w-full max-w-xl flex-col rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-4 sm:p-5">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-slate-950">
                  {editingSubcategory ? "Edit subcategory" : "Create subcategory"}
                </h2>
                <p className="text-sm text-slate-500">Choose the parent category and storefront URL slug.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Subcategory name</span>
                  <input
                    required
                    value={form.name}
                    onChange={(event) => handleNameChange(event.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                    placeholder="Running Shoes"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Parent category</span>
                  <select
                    required
                    value={form.parentId}
                    onChange={(event) => setForm((current) => ({ ...current, parentId: event.target.value }))}
                    disabled={Boolean(editingSubcategory)}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
                  >
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Slug</span>
                  <input
                    required
                    value={form.slug}
                    onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 font-mono text-sm outline-none focus:border-slate-400"
                    placeholder="running-shoes"
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
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Description</span>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  className="mt-2 min-h-24 w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-slate-400"
                  placeholder="Short description for admin reference and storefront planning."
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Status</span>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, status: event.target.value as SubcategoryStatus }))
                  }
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                >
                  <option value="active">Active</option>
                  <option value="hidden">Hidden</option>
                </select>
              </label>
            </div>

            <div className="grid gap-2 border-t border-slate-100 p-4 sm:flex sm:justify-end sm:p-5">
              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingSubcategory ? "Save changes" : "Create subcategory"}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(subcategoryToDelete)}
        title="Delete subcategory?"
        description={
          subcategoryToDelete
            ? `This will remove "${subcategoryToDelete.name}" from ${subcategoryToDelete.parentName}. Products already assigned to this slug will need to be moved separately.`
            : ""
        }
        confirmLabel="Delete subcategory"
        tone="danger"
        loading={deleteSubcategoryMutation.isPending}
        onCancel={() => {
          if (!deleteSubcategoryMutation.isPending) setSubcategoryToDelete(null);
        }}
        onConfirm={confirmDeleteSubcategory}
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

function StatusButton({
  subcategory,
  onToggleStatus,
  disabled,
}: {
  subcategory: SubcategoryRowData;
  onToggleStatus: (subcategory: SubcategoryRowData) => void;
  disabled?: boolean;
}) {
  const active = subcategory.status !== "hidden";
  return (
    <button
      onClick={() => onToggleStatus(subcategory)}
      disabled={disabled}
      className={`rounded-full px-3 py-1 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${
        active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
      }`}
    >
      {active ? "Active" : "Hidden"}
    </button>
  );
}

function RowActions({
  subcategory,
  onEdit,
  onDelete,
  disabled,
}: {
  subcategory: SubcategoryRowData;
  onEdit: (subcategory: SubcategoryRowData) => void;
  onDelete: (subcategory: SubcategoryRowData) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex justify-end gap-1">
      <button
        onClick={() => onEdit(subcategory)}
        disabled={disabled}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`Edit ${subcategory.name}`}
      >
        <Edit3 className="h-4 w-4" />
      </button>
      <button
        onClick={() => onDelete(subcategory)}
        disabled={disabled}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-rose-500 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`Delete ${subcategory.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function ParentBadge({ name }: { name: string }) {
  return (
    <span className="rounded-full bg-[#fff8f4] px-3 py-1 text-xs font-semibold text-[#8a5239]">
      {name}
    </span>
  );
}

function SubcategoryRow({
  subcategory,
  disabled,
  onEdit,
  onDelete,
  onToggleStatus,
}: {
  subcategory: SubcategoryRowData;
  disabled?: boolean;
  onEdit: (subcategory: SubcategoryRowData) => void;
  onDelete: (subcategory: SubcategoryRowData) => void;
  onToggleStatus: (subcategory: SubcategoryRowData) => void;
}) {
  return (
    <tr className="group hover:bg-slate-50/80">
      <td className="px-5 py-4">
        <p className="font-semibold text-slate-950">{subcategory.name}</p>
        <p className="mt-1 max-w-md truncate text-sm text-slate-500">{subcategory.description}</p>
      </td>
      <td className="px-5 py-4">
        <ParentBadge name={subcategory.parentName} />
      </td>
      <td className="px-5 py-4 font-mono text-xs text-slate-500">/{subcategory.slug}</td>
      <td className="px-5 py-4 text-right font-semibold text-slate-700">
        {subcategory.productCount ?? 0}
      </td>
      <td className="px-5 py-4 text-center">
        <StatusButton subcategory={subcategory} onToggleStatus={onToggleStatus} disabled={disabled} />
      </td>
      <td className="px-5 py-4">
        <RowActions subcategory={subcategory} onEdit={onEdit} onDelete={onDelete} disabled={disabled} />
      </td>
    </tr>
  );
}

function SubcategoryCard({
  subcategory,
  disabled,
  onEdit,
  onDelete,
  onToggleStatus,
}: {
  subcategory: SubcategoryRowData;
  disabled?: boolean;
  onEdit: (subcategory: SubcategoryRowData) => void;
  onDelete: (subcategory: SubcategoryRowData) => void;
  onToggleStatus: (subcategory: SubcategoryRowData) => void;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-950">{subcategory.name}</h3>
          <p className="mt-1 truncate font-mono text-xs text-slate-500">
            /{subcategory.parentSlug}/{subcategory.slug}
          </p>
        </div>
        <RowActions subcategory={subcategory} onEdit={onEdit} onDelete={onDelete} disabled={disabled} />
      </div>
      {subcategory.description && (
        <p className="mt-3 line-clamp-2 text-sm leading-5 text-slate-500">{subcategory.description}</p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <ParentBadge name={subcategory.parentName} />
        <StatusButton subcategory={subcategory} onToggleStatus={onToggleStatus} disabled={disabled} />
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
          {subcategory.productCount ?? 0} products
        </span>
      </div>
    </article>
  );
}

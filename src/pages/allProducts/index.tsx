import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Edit3,
  Eye,
  Loader2,
  Package,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useAdminCategories, useAdminProducts, useDeleteProduct } from "@/lib/api/queries";
import { useToast } from "@/lib/providers/ToastProvider";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const STOREFRONT_URL = import.meta.env.VITE_STOREFRONT_URL ?? "http://localhost:3000";

type ProductStatus = "active" | "draft" | "archived";

type ApiProduct = {
  _id: string;
  title: string;
  slug: string;
  sku: string;
  category: string;
  subcategory: string;
  price: number;
  comparePrice?: number;
  featuredImage?: { url?: string; alt?: string };
  rating?: number;
  reviewsCount?: number;
  inventory?: {
    stock?: number;
    reserved?: number;
    reorderPoint?: number;
    incoming?: number;
    warehouse?: string;
  };
  deliveryEstimate?: {
    minDays?: number;
    maxDays?: number;
    customWindow?: string;
    shipsFrom?: string;
  };
  status: ProductStatus;
  featured?: boolean;
};

type ProductResponse = {
  items: ApiProduct[];
  total: number;
  page: number;
  limit: number;
};

type ApiCategory = {
  _id: string;
  name: string;
  slug: string;
  subcategories?: { name: string; slug: string }[];
};

const statusClass: Record<ProductStatus, string> = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  draft: "border-slate-200 bg-slate-100 text-slate-600",
  archived: "border-amber-200 bg-amber-50 text-amber-700",
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

function formatCurrency(value = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatStatus(status: ProductStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getDeliveryWindow(product: ApiProduct) {
  const delivery = product.deliveryEstimate;
  if (!delivery) return "Not set";
  if (delivery.customWindow) return delivery.customWindow;
  if (delivery.minDays && delivery.maxDays) return `${delivery.minDays}-${delivery.maxDays} days`;
  return delivery.shipsFrom || "Not set";
}

function getStockStatus(product: ApiProduct) {
  const stock = product.inventory?.stock ?? 0;
  const reorderPoint = product.inventory?.reorderPoint ?? 10;
  if (stock <= 0) return "Out of Stock";
  if (stock <= reorderPoint) return "Low Stock";
  return "In Stock";
}

function getCategoryLabel(categories: ApiCategory[], slug: string) {
  return categories.find((category) => category.slug === slug)?.name ?? slug;
}

function getSubcategoryLabel(categories: ApiCategory[], categorySlug: string, subcategorySlug: string) {
  const category = categories.find((item) => item.slug === categorySlug);
  return category?.subcategories?.find((item) => item.slug === subcategorySlug)?.name ?? subcategorySlug;
}

export default function ProductsPage() {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<"all" | ProductStatus>("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [productToArchive, setProductToArchive] = useState<ApiProduct | null>(null);

  const productParams = useMemo(() => {
    const params = new URLSearchParams({ limit: "100" });
    params.set("status", status);
    if (query.trim()) params.set("search", query.trim());
    if (category !== "all") params.set("category", category);
    return params.toString();
  }, [category, query, status]);

  const {
    data: productData,
    isLoading: productsLoading,
    isFetching: productsFetching,
    isError: productsError,
    error: productError,
  } = useAdminProducts(productParams);
  const { data: categoriesData = [], isLoading: categoriesLoading } = useAdminCategories();
  const deleteProduct = useDeleteProduct();

  const response = productData as ProductResponse | undefined;
  const products = response?.items ?? [];
  const categories = categoriesData as ApiCategory[];

  const activeCount = products.filter((product) => product.status === "active").length;
  const draftCount = products.filter((product) => product.status === "draft").length;
  const lowStockCount = products.filter((product) => getStockStatus(product) !== "In Stock").length;
  const averageRating =
    products.length > 0
      ? products.reduce((sum, product) => sum + (product.rating ?? 0), 0) / products.length
      : 0;

  const stats: { label: string; value: string | number; icon: LucideIcon; color: string }[] = [
    { label: "Active products", value: activeCount, icon: CheckCircle2, color: "text-emerald-600" },
    { label: "Drafts", value: draftCount, icon: Clock3, color: "text-slate-600" },
    { label: "Stock alerts", value: lowStockCount, icon: AlertTriangle, color: "text-amber-600" },
    { label: "Avg rating", value: averageRating.toFixed(1), icon: Star, color: "text-yellow-500" },
  ];

  const toggleSelect = (id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const handleDeleteProduct = async () => {
    if (!productToArchive) return;

    try {
      await deleteProduct.mutateAsync(productToArchive._id);
      toast.success("Product deleted", `${productToArchive.title} was removed from the catalogue.`);
      setSelected((current) => current.filter((id) => id !== productToArchive._id));
      setProductToArchive(null);
    } catch (error) {
      toast.error("Product could not be deleted", getErrorMessage(error));
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Catalogue
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                Products
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Manage the same products used by the approved storefront design: collection routes,
                images, inventory, ratings, pricing, and delivery promise.
              </p>
            </div>
          </div>
          <Link
            to="/products/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Add product
          </Link>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                <Icon className={cn("h-4 w-4", color)} />
              </div>
              <p className={cn("mt-2 text-2xl font-bold", color)}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-3 border-b border-slate-100 p-4 lg:grid-cols-[minmax(280px,1fr)_210px_190px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
              placeholder="Search product, SKU, slug..."
            />
          </div>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            disabled={categoriesLoading}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item._id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as "all" | ProductStatus)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {selected.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
            <span className="text-sm font-semibold text-slate-700">{selected.length} selected</span>
            <span className="text-sm text-slate-500">Bulk product actions will use the same archive flow.</span>
          </div>
        )}

        {productsError && (
          <div className="m-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            Products could not load: {getErrorMessage(productError)}
          </div>
        )}

        <div className="relative overflow-x-auto">
          {productsFetching && !productsLoading && (
            <div className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Refreshing
            </div>
          )}
          <table className="w-full min-w-[1120px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-4">
                  <input
                    type="checkbox"
                    checked={products.length > 0 && selected.length === products.length}
                    onChange={() =>
                      setSelected(selected.length === products.length ? [] : products.map((product) => product._id))
                    }
                    aria-label="Select all products"
                  />
                </th>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Route</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4 text-right">Price</th>
                <th className="px-5 py-4 text-center">Stock</th>
                <th className="px-5 py-4 text-center">Rating</th>
                <th className="px-5 py-4">Delivery</th>
                <th className="px-5 py-4 text-center">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productsLoading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-5 py-4" colSpan={10}>
                        <div className="h-14 animate-pulse rounded-xl bg-slate-100" />
                      </td>
                    </tr>
                  ))
                : products.map((product) => {
                    const stockStatus = getStockStatus(product);
                    return (
                      <tr key={product._id} className="group hover:bg-slate-50/80">
                        <td className="px-5 py-4">
                          <input
                            type="checkbox"
                            checked={selected.includes(product._id)}
                            onChange={() => toggleSelect(product._id)}
                            aria-label={`Select ${product.title}`}
                          />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {product.featuredImage?.url ? (
                              <img
                                src={product.featuredImage.url}
                                alt=""
                                className="h-14 w-12 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="flex h-14 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                                <Package className="h-4 w-4" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-slate-950">{product.title}</p>
                              <p className="mt-0.5 font-mono text-xs text-slate-400">{product.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-mono text-xs text-slate-500">
                          /collections/{product.category}/{product.slug}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-700">
                            {getCategoryLabel(categories, product.category)}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {getSubcategoryLabel(categories, product.category, product.subcategory)}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <p className="font-bold text-slate-950">{formatCurrency(product.price)}</p>
                          {product.comparePrice && (
                            <p className="text-xs text-slate-400 line-through">
                              {formatCurrency(product.comparePrice)}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                              stockStatus === "In Stock" && "bg-emerald-50 text-emerald-700",
                              stockStatus === "Low Stock" && "bg-amber-50 text-amber-700",
                              stockStatus === "Out of Stock" && "bg-rose-50 text-rose-700"
                            )}
                          >
                            {stockStatus !== "In Stock" && <AlertTriangle className="h-3.5 w-3.5" />}
                            {product.inventory?.stock ?? 0}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            {(product.rating ?? 0).toFixed(1)}
                          </span>
                          <p className="text-xs text-slate-400">{product.reviewsCount ?? 0} reviews</p>
                        </td>
                        <td className="px-5 py-4 text-slate-600">{getDeliveryWindow(product)}</td>
                        <td className="px-5 py-4 text-center">
                          <span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold", statusClass[product.status])}>
                            {formatStatus(product.status)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
                            <a
                              href={`${STOREFRONT_URL}/collections/${product.category}/${product.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-white hover:text-slate-900"
                              aria-label="Preview product route"
                            >
                              <Eye className="h-4 w-4" />
                            </a>
                            <Link
                              to={`/products/${product._id}/edit`}
                              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-white hover:text-slate-900"
                              aria-label="Edit product"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => setProductToArchive(product)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl text-rose-500 hover:bg-rose-50"
                              aria-label="Delete product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>

        {!productsLoading && products.length === 0 && (
          <div className="py-16 text-center">
            <Package className="mx-auto h-9 w-9 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-600">No products found</p>
            <p className="mt-1 text-sm text-slate-400">Create a product or adjust the filters.</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(productToArchive)}
        title="Delete product?"
        description={
          productToArchive
            ? `${productToArchive.title} will be permanently removed from the product catalogue.`
            : ""
        }
        confirmLabel="Delete product"
        tone="danger"
        loading={deleteProduct.isPending}
        onCancel={() => setProductToArchive(null)}
        onConfirm={handleDeleteProduct}
      />
    </section>
  );
}

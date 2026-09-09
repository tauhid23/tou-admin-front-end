"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ImagePlus,
  Loader2,
  PackagePlus,
  Palette,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  useAdminCategories,
  useAdminProduct,
  useSaveProduct,
  useUploadImages,
} from "@/lib/api/queries";
import { useToast } from "@/lib/providers/ToastProvider";

type ProductStatus = "active" | "draft";

type ApiCategory = {
  _id: string;
  name: string;
  slug: string;
  status?: "active" | "hidden";
  subcategories?: {
    name: string;
    slug: string;
    status?: "active" | "hidden";
  }[];
};

type UploadedAsset = {
  url: string;
  publicId?: string;
  alt?: string;
};

type ColorVariant = {
  id: string;
  name: string;
  swatch: string;
  image: UploadedAsset | null;
};

type ApiProduct = {
  _id: string;
  title?: string;
  slug?: string;
  description?: string;
  sku?: string;
  price?: number;
  comparePrice?: number;
  costPrice?: number;
  category?: string;
  subcategory?: string;
  featuredImage?: UploadedAsset;
  gallery?: UploadedAsset[];
  colors?: {
    name?: string;
    slug?: string;
    swatch?: string;
    image?: UploadedAsset;
  }[];
  sizes?: string[];
  tags?: string[];
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
    note?: string;
  };
  status?: ProductStatus;
  featured?: boolean;
};

type ProductFormData = {
  title: string;
  slug: string;
  description: string;
  sku: string;
  price: string;
  comparePrice: string;
  costPrice: string;
  category: string;
  subcategory: string;
  stock: string;
  reserved: string;
  reorderPoint: string;
  incoming: string;
  warehouse: string;
  sizes: string;
  tags: string[];
  rating: string;
  reviewsCount: string;
  deliveryWindow: string;
  shipsFrom: string;
  deliveryNote: string;
  status: ProductStatus;
  featured: boolean;
};

const emptyForm: ProductFormData = {
  title: "",
  slug: "",
  description: "",
  sku: "",
  price: "",
  comparePrice: "",
  costPrice: "",
  category: "",
  subcategory: "",
  stock: "0",
  reserved: "0",
  reorderPoint: "10",
  incoming: "0",
  warehouse: "Main warehouse",
  sizes: "",
  tags: [],
  rating: "0",
  reviewsCount: "0",
  deliveryWindow: "2-3 days",
  shipsFrom: "Local warehouse",
  deliveryNote: "",
  status: "draft",
  featured: false,
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

function numberOrUndefined(value: string) {
  if (value.trim() === "") return undefined;
  return Number(value);
}

function numberOrZero(value: string) {
  return Number(value) || 0;
}

function parseList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseDeliveryWindow(value: string) {
  const match = value.match(/(\d+)\s*(?:-|to)\s*(\d+)/i);
  if (!match) return { customWindow: value.trim() };
  return {
    minDays: Number(match[1]),
    maxDays: Number(match[2]),
  };
}

function stringifyNumber(value?: number) {
  return value === undefined || value === null ? "" : String(value);
}

function formatDeliveryWindow(delivery?: ApiProduct["deliveryEstimate"]) {
  if (!delivery) return emptyForm.deliveryWindow;
  if (delivery.customWindow) return delivery.customWindow;
  if (delivery.minDays && delivery.maxDays) return `${delivery.minDays}-${delivery.maxDays} days`;
  return emptyForm.deliveryWindow;
}

function productToFormData(product: ApiProduct): ProductFormData {
  return {
    title: product.title ?? "",
    slug: product.slug ?? "",
    description: product.description ?? "",
    sku: product.sku ?? "",
    price: stringifyNumber(product.price),
    comparePrice: stringifyNumber(product.comparePrice),
    costPrice: stringifyNumber(product.costPrice),
    category: product.category ?? "",
    subcategory: product.subcategory ?? "",
    stock: stringifyNumber(product.inventory?.stock) || "0",
    reserved: stringifyNumber(product.inventory?.reserved) || "0",
    reorderPoint: stringifyNumber(product.inventory?.reorderPoint) || "10",
    incoming: stringifyNumber(product.inventory?.incoming) || "0",
    warehouse: product.inventory?.warehouse ?? "Main warehouse",
    sizes: product.sizes?.join(", ") ?? "",
    tags: product.tags ?? [],
    rating: stringifyNumber(product.rating) || "0",
    reviewsCount: stringifyNumber(product.reviewsCount) || "0",
    deliveryWindow: formatDeliveryWindow(product.deliveryEstimate),
    shipsFrom: product.deliveryEstimate?.shipsFrom ?? "Local warehouse",
    deliveryNote: product.deliveryEstimate?.note ?? "",
    status: product.status === "active" ? "active" : "draft",
    featured: Boolean(product.featured),
  };
}

function createColorVariant(): ColorVariant {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    name: "",
    swatch: "#111111",
    image: null,
  };
}

export default function AddProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const { data = [], isLoading: categoriesLoading, isError, error } = useAdminCategories();
  const {
    data: productData,
    isLoading: productLoading,
    isError: productLoadError,
    error: productError,
  } = useAdminProduct(id);
  const saveProduct = useSaveProduct();
  const uploadImages = useUploadImages();
  const categories = data as ApiCategory[];
  const product = productData as ApiProduct | undefined;
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [featuredImage, setFeaturedImage] = useState<UploadedAsset | null>(null);
  const [galleryImages, setGalleryImages] = useState<UploadedAsset[]>([]);
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (!product) return;
    setFormData(productToFormData(product));
    setFeaturedImage(product.featuredImage?.url ? product.featuredImage : null);
    setGalleryImages(product.gallery ?? []);
    setColorVariants(
      (product.colors ?? []).map((color, index) => ({
        id: color.slug || `color-${index + 1}`,
        name: color.name ?? "",
        swatch: color.swatch || "#111111",
        image: color.image?.url ? color.image : null,
      }))
    );
  }, [product]);

  const visibleCategories = useMemo(
    () => categories.filter((category) => category.status !== "hidden"),
    [categories]
  );

  const selectedCategory = useMemo(
    () => visibleCategories.find((category) => category.slug === formData.category),
    [formData.category, visibleCategories]
  );

  const visibleSubcategories = useMemo(
    () =>
      selectedCategory?.subcategories?.filter((subcategory) => subcategory.status !== "hidden") ??
      [],
    [selectedCategory]
  );

  const isBusy = saveProduct.isPending || uploadImages.isPending;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => {
      if (name === "title") {
        return {
          ...current,
          title: value,
          slug: current.slug ? current.slug : slugify(value),
        };
      }

      if (name === "category") {
        return {
          ...current,
          category: value,
          subcategory: "",
        };
      }

      return { ...current, [name]: value };
    });
  };

  const handleFeaturedUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const [uploaded] = await uploadImages.mutateAsync({
        files: [file],
        folder: "sosbd/products/featured",
      });
      setFeaturedImage(uploaded);
      toast.success("Featured image uploaded");
    } catch (uploadError) {
      toast.error("Image upload failed", getErrorMessage(uploadError));
    } finally {
      event.target.value = "";
    }
  };

  const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    try {
      const uploaded = await uploadImages.mutateAsync({
        files,
        folder: "sosbd/products/gallery",
      });
      setGalleryImages((current) => [...current, ...uploaded]);
      toast.success("Gallery uploaded", `${uploaded.length} image${uploaded.length === 1 ? "" : "s"} added.`);
    } catch (uploadError) {
      toast.error("Gallery upload failed", getErrorMessage(uploadError));
    } finally {
      event.target.value = "";
    }
  };

  const updateColorVariant = (id: string, patch: Partial<ColorVariant>) => {
    setColorVariants((current) =>
      current.map((color) => (color.id === id ? { ...color, ...patch } : color))
    );
  };

  const handleColorImageUpload = async (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const [uploaded] = await uploadImages.mutateAsync({
        files: [file],
        folder: "sosbd/products/colors",
      });
      updateColorVariant(id, { image: uploaded });
      toast.success("Color image uploaded");
    } catch (uploadError) {
      toast.error("Color image upload failed", getErrorMessage(uploadError));
    } finally {
      event.target.value = "";
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag || formData.tags.includes(tag)) return;
    setFormData((current) => ({ ...current, tags: [...current.tags, tag] }));
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((current) => ({
      ...current,
      tags: current.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setFeaturedImage(null);
    setGalleryImages([]);
    setColorVariants([]);
    setTagInput("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.category) {
      toast.error("Category required", "Choose the category where this product belongs.");
      return;
    }

    if (!formData.subcategory) {
      toast.error("Subcategory required", "Choose a subcategory for storefront navigation.");
      return;
    }

    if (!featuredImage?.url) {
      toast.error("Featured image required", "Upload the main product image before saving.");
      return;
    }

    const title = formData.title.trim();
    const slug = slugify(formData.slug || title);
    const deliveryEstimate = {
      ...parseDeliveryWindow(formData.deliveryWindow),
      shipsFrom: formData.shipsFrom.trim(),
      note: formData.deliveryNote.trim(),
    };

    const payload = {
      title,
      slug,
      description: formData.description.trim(),
      sku: formData.sku.trim(),
      category: formData.category,
      subcategory: formData.subcategory,
      price: numberOrZero(formData.price),
      comparePrice: numberOrUndefined(formData.comparePrice),
      costPrice: numberOrUndefined(formData.costPrice),
      featuredImage: {
        url: featuredImage.url,
        publicId: featuredImage.publicId,
        alt: title,
      },
      gallery: galleryImages.map((image, index) => ({
        url: image.url,
        publicId: image.publicId,
        alt: `${title} gallery ${index + 1}`,
      })),
      colors: colorVariants
        .filter((color) => color.name.trim() || color.image?.url)
        .map((color, index) => {
          const name = color.name.trim() || `Color ${index + 1}`;
          return {
            name,
            slug: slugify(name) || `color-${index + 1}`,
            swatch: color.swatch,
            ...(color.image?.url
              ? {
                  image: {
                    url: color.image.url,
                    publicId: color.image.publicId,
                    alt: `${title} in ${name}`,
                  },
                }
              : {}),
          };
        }),
      sizes: parseList(formData.sizes),
      tags: formData.tags,
      rating: numberOrZero(formData.rating),
      reviewsCount: numberOrZero(formData.reviewsCount),
      inventory: {
        stock: numberOrZero(formData.stock),
        reserved: numberOrZero(formData.reserved),
        reorderPoint: numberOrZero(formData.reorderPoint),
        incoming: numberOrZero(formData.incoming),
        warehouse: formData.warehouse.trim() || "Main warehouse",
      },
      deliveryEstimate,
      status: formData.status,
      featured: formData.featured,
    };

    try {
      await saveProduct.mutateAsync({ id, payload });
      toast.success(
        isEditMode ? "Product updated" : "Product created",
        `${title} is now saved in the catalogue.`
      );
      if (!isEditMode) resetForm();
      navigate("/products");
    } catch (saveError) {
      toast.error(
        isEditMode ? "Product could not be updated" : "Product could not be created",
        getErrorMessage(saveError)
      );
    }
  };

  if (productLoading) {
    return (
      <div className="mx-auto flex min-h-[420px] max-w-6xl items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="inline-flex items-center gap-3 text-sm font-semibold text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading product details
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Catalogue</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {isEditMode
              ? "Update the product details used by storefront cards, detail page, gallery, inventory, and delivery promise."
              : "Create products for the approved storefront cards, detail page, gallery, inventory, and delivery promise."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Back to products
        </button>
      </div>

      {isError && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          Categories could not load: {getErrorMessage(error)}
        </div>
      )}

      {productLoadError && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          Product could not load: {getErrorMessage(productError)}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-8">
            <Panel title="Basic Information">
              <div className="space-y-5">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Product name</span>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-400"
                    placeholder="Premium Wireless Headphones"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Slug</span>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 font-mono text-sm outline-none transition focus:border-slate-400"
                    placeholder="premium-wireless-headphones"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Description</span>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                    placeholder="Write the product description shown on the product detail page."
                  />
                </label>
              </div>
            </Panel>

            <Panel title="Pricing">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <NumberField label="Selling price" name="price" value={formData.price} onChange={handleChange} required />
                <NumberField label="Compare price" name="comparePrice" value={formData.comparePrice} onChange={handleChange} />
                <NumberField label="Cost price" name="costPrice" value={formData.costPrice} onChange={handleChange} />
              </div>
            </Panel>

            <Panel title="Inventory">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">SKU</span>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    required
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 font-mono text-sm outline-none transition focus:border-slate-400"
                    placeholder="PROD-39281"
                  />
                </label>
                <NumberField label="Stock quantity" name="stock" value={formData.stock} onChange={handleChange} />
                <NumberField label="Reserved stock" name="reserved" value={formData.reserved} onChange={handleChange} />
                <NumberField label="Low stock threshold" name="reorderPoint" value={formData.reorderPoint} onChange={handleChange} />
                <NumberField label="Incoming stock" name="incoming" value={formData.incoming} onChange={handleChange} />
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Warehouse</span>
                  <input
                    type="text"
                    name="warehouse"
                    value={formData.warehouse}
                    onChange={handleChange}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-400"
                    placeholder="Main warehouse"
                  />
                </label>
              </div>
            </Panel>

            <Panel title="Storefront Details">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Sizes</span>
                  <input
                    name="sizes"
                    value={formData.sizes}
                    onChange={handleChange}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-400"
                    placeholder="S, M, L, XL"
                  />
                </label>
                <NumberField label="Rating" name="rating" value={formData.rating} onChange={handleChange} min={0} max={5} step={0.1} />
                <NumberField label="Reviews count" name="reviewsCount" value={formData.reviewsCount} onChange={handleChange} />
                <label className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 md:mt-7">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(event) => setFormData((current) => ({ ...current, featured: event.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Feature on storefront
                </label>
              </div>
            </Panel>

            <Panel title="Delivery Promise">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Delivery window</span>
                  <input
                    name="deliveryWindow"
                    value={formData.deliveryWindow}
                    onChange={handleChange}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-400"
                    placeholder="2-3 days or 10-16 days"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Ships from</span>
                  <input
                    name="shipsFrom"
                    value={formData.shipsFrom}
                    onChange={handleChange}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-400"
                    placeholder="Local warehouse"
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">Delivery note</span>
                  <textarea
                    name="deliveryNote"
                    value={formData.deliveryNote}
                    onChange={handleChange}
                    rows={3}
                    className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                    placeholder="Optional note for imported or special delivery products."
                  />
                </label>
              </div>
            </Panel>
          </div>

          <aside className="space-y-8">
            <Panel title="Featured Image">
              <div className="relative flex aspect-[4/5] overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
                {featuredImage ? (
                  <>
                    <img src={featuredImage.url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFeaturedImage(null)}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm transition hover:text-rose-600"
                      aria-label="Remove featured image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center p-6 text-center transition hover:bg-slate-100">
                    {uploadImages.isPending ? (
                      <Loader2 className="mb-3 h-9 w-9 animate-spin text-slate-400" />
                    ) : (
                      <Upload className="mb-3 h-9 w-9 text-slate-400" />
                    )}
                    <span className="text-sm font-semibold text-slate-700">Upload main product image</span>
                    <span className="mt-1 text-xs text-slate-500">Used on cards and product details</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFeaturedUpload}
                      disabled={uploadImages.isPending}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </Panel>

            <Panel title="Category & Status">
              <div className="space-y-5">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Category</span>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={categoriesLoading || !visibleCategories.length}
                    required
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">
                      {categoriesLoading ? "Loading categories..." : "Select category"}
                    </option>
                    {visibleCategories.map((category) => (
                      <option key={category._id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Subcategory</span>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    disabled={!formData.category || !visibleSubcategories.length}
                    required
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">
                      {formData.category ? "Select subcategory" : "Select category first"}
                    </option>
                    {visibleSubcategories.map((subcategory) => (
                      <option key={subcategory.slug} value={subcategory.slug}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </label>

                <div>
                  <span className="text-sm font-semibold text-slate-700">Status</span>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {(["draft", "active"] as const).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setFormData((current) => ({ ...current, status }))}
                        className={cn(
                          "inline-flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold capitalize transition",
                          formData.status === status
                            ? "bg-slate-950 text-white"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        )}
                      >
                        {formData.status === status && <Check className="h-4 w-4" />}
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="Gallery">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center transition hover:bg-slate-100">
                {uploadImages.isPending ? (
                  <Loader2 className="mb-3 h-8 w-8 animate-spin text-slate-400" />
                ) : (
                  <ImagePlus className="mb-3 h-8 w-8 text-slate-400" />
                )}
                <span className="text-sm font-semibold text-slate-700">Choose gallery images</span>
                <span className="mt-1 text-xs text-slate-500">Optional product detail images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleGalleryUpload}
                  disabled={uploadImages.isPending}
                />
              </label>
              {galleryImages.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {galleryImages.map((image, index) => (
                    <div key={image.publicId || image.url} className="relative aspect-square overflow-hidden rounded-xl border border-slate-200">
                      <img src={image.url} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setGalleryImages((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-white text-rose-600 shadow"
                        aria-label="Remove gallery image"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            <Panel title="Color Variants">
              <div className="space-y-4">
                {colorVariants.map((color, index) => (
                  <div key={color.id} className="rounded-xl border border-slate-200 p-3">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="text-xs font-bold uppercase text-slate-500">
                        Color {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setColorVariants((current) =>
                            current.filter((item) => item.id !== color.id)
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                        aria-label={`Remove color ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-[44px_minmax(0,1fr)] gap-3">
                      <label className="relative h-11 overflow-hidden rounded-lg border border-slate-200" title="Choose swatch color">
                        <input
                          type="color"
                          value={color.swatch}
                          onChange={(event) => updateColorVariant(color.id, { swatch: event.target.value })}
                          className="absolute -inset-2 h-16 w-16 cursor-pointer border-0 bg-transparent p-0"
                          aria-label={`Swatch for color ${index + 1}`}
                        />
                      </label>
                      <input
                        type="text"
                        value={color.name}
                        onChange={(event) => updateColorVariant(color.id, { name: event.target.value })}
                        placeholder="Color name, e.g. Navy"
                        className="h-11 min-w-0 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-400"
                      />
                    </div>

                    <div className="mt-3">
                      {color.image ? (
                        <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-2">
                          <img src={color.image.url} alt="" className="h-16 w-14 rounded-md object-cover" />
                          <span className="min-w-0 flex-1 text-xs font-semibold text-slate-500">
                            Color-specific image
                          </span>
                          <button
                            type="button"
                            onClick={() => updateColorVariant(color.id, { image: null })}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-rose-600"
                            aria-label={`Remove image for color ${index + 1}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
                          {uploadImages.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ImagePlus className="h-4 w-4" />
                          )}
                          Add color image (optional)
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadImages.isPending}
                            onChange={(event) => handleColorImageUpload(color.id, event)}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setColorVariants((current) => [...current, createColorVariant()])}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  <Palette className="h-4 w-4" />
                  Add optional color
                </button>
              </div>
            </Panel>

            <Panel title="Tags">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add tag"
                  className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-400"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-950 hover:text-white"
                  aria-label="Add tag"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              {formData.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-slate-400 hover:text-rose-600"
                        aria-label={`Remove ${tag}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </Panel>
          </aside>
        </div>

        <div className="sticky bottom-0 z-20 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:rounded-2xl sm:border sm:shadow-lg">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <PackagePlus className="h-4 w-4" />
              <span>{formData.status === "active" ? "This product will publish immediately." : "This product will be saved as a draft."}</span>
            </div>
            <motion.button
              type="submit"
              disabled={isBusy}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isBusy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {isBusy ? "Saving product..." : isEditMode ? "Save changes" : "Create product"}
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-5 text-base font-bold text-slate-950">{title}</h2>
      {children}
    </section>
  );
}

function NumberField({
  label,
  name,
  value,
  onChange,
  required,
  min = 0,
  max,
  step = 1,
}: {
  label: string;
  name: keyof ProductFormData;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        max={max}
        step={step}
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-400"
      />
    </label>
  );
}

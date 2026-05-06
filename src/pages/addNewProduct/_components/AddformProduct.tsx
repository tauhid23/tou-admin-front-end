// src/pages/products/add/page.tsx  (or _components/AddProductForm.tsx)

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, Plus, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  category: string;
  subcategory?: string;
  tags: string[];
  status: "active" | "draft";
}

export default function AddProductForm() {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    slug: "",
    description: "",
    price: 0,
    comparePrice: undefined,
    costPrice: undefined,
    sku: "",
    stock: 0,
    lowStockThreshold: 10,
    category: "",
    subcategory: "",
    tags: [],
    status: "draft",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value === "" ? 0 : Number(value) }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      alert("Product created successfully!"); // Replace with real API later
      // Reset form after success
      setFormData({
        name: "", slug: "", description: "", price: 0, comparePrice: undefined,
        costPrice: undefined, sku: "", stock: 0, lowStockThreshold: 10,
        category: "", subcategory: "", tags: [], status: "draft"
      });
      setImagePreview(null);
    } catch (err) {
      setError("Failed to create product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
        <p className="text-muted-foreground mt-1">Fill in the details to create a new product</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN - Main Info */}
          <div className="lg:col-span-2 space-y-8">

            {/* Basic Information */}
            <div className="bg-card border border-border rounded-3xl p-8">
              <h2 className="text-lg font-semibold mb-6">Basic Information</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3 bg-background border border-border rounded-2xl focus:border-primary outline-none transition-colors"
                    placeholder="Premium Wireless Headphones"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-full px-5 py-3 bg-background border border-border rounded-2xl focus:border-primary outline-none"
                    placeholder="premium-wireless-headphones"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-5 py-4 bg-background border border-border rounded-3xl focus:border-primary outline-none resize-y"
                    placeholder="Write a detailed description..."
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-card border border-border rounded-3xl p-8">
              <h2 className="text-lg font-semibold mb-6">Pricing</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="text-sm font-medium block mb-1.5">Selling Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleNumberChange}
                    required
                    className="w-full px-5 py-3 bg-background border border-border rounded-2xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">Compare Price</label>
                  <input
                    type="number"
                    name="comparePrice"
                    value={formData.comparePrice || ""}
                    onChange={handleNumberChange}
                    className="w-full px-5 py-3 bg-background border border-border rounded-2xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">Cost Price</label>
                  <input
                    type="number"
                    name="costPrice"
                    value={formData.costPrice || ""}
                    onChange={handleNumberChange}
                    className="w-full px-5 py-3 bg-background border border-border rounded-2xl"
                  />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-card border border-border rounded-3xl p-8">
              <h2 className="text-lg font-semibold mb-6">Inventory</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium block mb-1.5">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full px-5 py-3 bg-background border border-border rounded-2xl font-mono"
                    placeholder="PROD-39281"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleNumberChange}
                    className="w-full px-5 py-3 bg-background border border-border rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Sidebar */}
          <div className="space-y-8">

            {/* Product Image */}
            <div className="bg-card border border-border rounded-3xl p-8">
              <h2 className="text-lg font-semibold mb-4">Featured Image</h2>
              
              <div className="border-2 border-dashed border-border rounded-3xl h-64 flex flex-col items-center justify-center hover:border-primary/50 transition-colors relative overflow-hidden">
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-3xl" />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">Click to upload image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Category & Status */}
            <div className="bg-card border border-border rounded-3xl p-8 space-y-6">
              <div>
                <label className="text-sm font-medium block mb-1.5">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-background border border-border rounded-2xl"
                >
                  <option value="">Select Category</option>
                  <option value="fashion">Fashion</option>
                  <option value="electronics">Electronics</option>
                  <option value="home">Home & Living</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1.5">Status</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({...p, status: "active"}))}
                    className={cn(
                      "flex-1 py-3 rounded-2xl text-sm font-medium transition-all",
                      formData.status === "active" 
                        ? "bg-primary text-white" 
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({...p, status: "draft"}))}
                    className={cn(
                      "flex-1 py-3 rounded-2xl text-sm font-medium transition-all",
                      formData.status === "draft" 
                        ? "bg-primary text-white" 
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    Draft
                  </button>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-card border border-border rounded-3xl p-8">
              <h2 className="text-lg font-semibold mb-4">Tags</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Add tag"
                  className="flex-1 px-5 py-3 bg-background border border-border rounded-2xl"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-6 bg-muted hover:bg-primary hover:text-white rounded-2xl transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {formData.tags.map((tag, i) => (
                  <div key={i} className="bg-muted px-4 py-1.5 rounded-2xl text-sm flex items-center gap-2">
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-muted-foreground hover:text-danger">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-border">
          {error && <p className="text-danger mr-6 self-center">{error}</p>}
          
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-2xl font-medium text-lg shadow-sm disabled:opacity-70 transition-all"
          >
            <Save className="w-5 h-5" />
            {isSubmitting ? "Creating Product..." : "Create Product"}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
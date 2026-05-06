// src/pages/products/index.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Filter, Edit3, Trash2, Eye, MoreHorizontal,
  Package, AlertTriangle, CheckCircle, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  sku: string;
  image: string;
  category: string;
  subcategory?: string;
  price: number;
  stock: number;
  status: "active" | "draft" | "out_of_stock";
  lastUpdated: string;
}

const mockProducts: Product[] = [
  // Add more mock data as needed
  { id: "1", name: "Premium Leather Jacket", sku: "LJ-39281", image: "https://picsum.photos/id/1015/80/80", category: "Fashion", price: 129.99, stock: 43, status: "active", lastUpdated: "2 hours ago" },
  { id: "2", name: "Wireless Noise Cancelling Headphones", sku: "WH-29471", image: "https://picsum.photos/id/60/80/80", category: "Electronics", price: 89.99, stock: 0, status: "out_of_stock", lastUpdated: "Yesterday" },
  { id: "3", name: "Ceramic Coffee Mug Set", sku: "CM-11902", image: "https://picsum.photos/id/201/80/80", category: "Home & Living", price: 24.99, stock: 124, status: "active", lastUpdated: "3 days ago" },
];

export default function ProductsPage() {
  const [products] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft" | "out_of_stock">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const toggleSelect = (id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const getStatusIcon = (status: Product["status"]) => {
    if (status === "active") return <CheckCircle className="w-4 h-4 text-success" />;
    if (status === "out_of_stock") return <AlertTriangle className="w-4 h-4 text-danger" />;
    return <Clock className="w-4 h-4 text-warning" />;
  };

  const getStatusText = (status: Product["status"]) => {
    if (status === "active") return "Active";
    if (status === "out_of_stock") return "Out of Stock";
    return "Draft";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your store catalogue</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-2xl font-medium shadow-sm transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </motion.button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search products or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 bg-card border border-border rounded-2xl py-3 text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-card border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-card border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Fashion">Fashion</option>
            <option value="Electronics">Electronics</option>
            <option value="Home & Living">Home & Living</option>
          </select>

          <button className="px-5 py-3 border border-border rounded-2xl flex items-center gap-2 hover:bg-muted transition-colors">
            <Filter className="w-5 h-5" />
            More Filters
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4"
          >
            <span className="text-sm font-medium">{selectedProducts.length} selected</span>
            <button className="text-danger hover:text-red-600 transition-colors flex items-center gap-1.5">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Table */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-left w-10">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length}
                    onChange={() => {/* bulk select logic */}}
                    className="rounded"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Product</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">SKU</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Category</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Price</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-muted-foreground">Stock</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-muted-foreground">Updated</th>
                <th className="px-6 py-4 w-20"></th>
              </tr>
            </thead>

            <tbody>
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-border hover:bg-muted/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="rounded"
                      />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-2xl border border-border"
                        />
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-muted-foreground font-mono">
                      {product.sku}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                        {product.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right font-semibold">
                      ${product.price.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm",
                        product.stock === 0 ? "text-danger bg-red-50" : "text-foreground"
                      )}>
                        {product.stock === 0 ? "0" : product.stock}
                        {product.stock < 10 && product.stock > 0 && <AlertTriangle className="w-3.5 h-3.5" />}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {getStatusIcon(product.status)}
                        <span className="text-sm capitalize">{getStatusText(product.status)}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-muted-foreground text-center">
                      {product.lastUpdated}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-2 hover:bg-muted rounded-xl">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-xl">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-xl text-danger">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <Package className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium">No products found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          Showing 1-{filteredProducts.length} of {products.length} products
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-border rounded-2xl hover:bg-muted">Previous</button>
          <button className="px-4 py-2 bg-primary text-white rounded-2xl">1</button>
          <button className="px-4 py-2 border border-border rounded-2xl hover:bg-muted">Next</button>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye,
  AlertTriangle,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: string;
  sku: string;
}

const mockProducts: Product[] = [
  { id: 'P001', name: 'Wireless Headphones Pro', category: 'Electronics', price: 129.99, stock: 45, status: 'In Stock', lastUpdated: '2026-05-06', sku: 'WH-PRO-001' },
  { id: 'P002', name: 'Organic Cotton T-Shirt', category: 'Fashion', price: 24.99, stock: 12, status: 'Low Stock', lastUpdated: '2026-05-05', sku: 'TS-ORG-045' },
  { id: 'P003', name: 'Smart Watch Ultra', category: 'Electronics', price: 299.99, stock: 8, status: 'Low Stock', lastUpdated: '2026-05-07', sku: 'SW-ULT-202' },
  { id: 'P004', name: 'Stainless Steel Water Bottle', category: 'Home', price: 19.99, stock: 0, status: 'Out of Stock', lastUpdated: '2026-05-04', sku: 'WB-SS-789' },
  { id: 'P005', name: 'Leather Laptop Sleeve', category: 'Accessories', price: 49.99, stock: 67, status: 'In Stock', lastUpdated: '2026-05-06', sku: 'LS-LTH-112' },
];

const InventoryPage: React.FC = () => {
  const [products] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState<'All' | 'In Stock' | 'Low Stock' | 'Out of Stock'>('All');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price'>('stock');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Accessories'];

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.sku.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Stock filter
    if (stockFilter !== 'All') {
      result = result.filter(p => p.status === stockFilter);
    }

    // Sort
    result.sort((a, b) => {
      let valA: any, valB: any;
      
      if (sortBy === 'name') {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else if (sortBy === 'stock') {
        valA = a.stock;
        valB = b.stock;
      } else {
        valA = a.price;
        valB = b.price;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [products, searchTerm, selectedCategory, stockFilter, sortBy, sortOrder]);

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.status === 'In Stock').length,
    lowStock: products.filter(p => p.status === 'Low Stock').length,
    outOfStock: products.filter(p => p.status === 'Out of Stock').length,
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30';
      case 'Low Stock': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
      case 'Out of Stock': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Package className="w-8 h-8" />
              Inventory
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your product stock and availability</p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </motion.button>

            <Link
                to="/products/new"
            //   whileHover={{ scale: 1.02 }}
            //   whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Products", value: stats.total, color: "blue" },
            { label: "In Stock", value: stats.inStock, color: "emerald" },
            { label: "Low Stock", value: stats.lowStock, color: "amber" },
            { label: "Out of Stock", value: stats.outOfStock, color: "red" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800"
            >
              <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              <div className={`text-4xl font-semibold mt-2 text-${stat.color}-600 dark:text-${stat.color}-500`}>
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-5 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-indigo-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Stock Filter */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="px-5 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Stock</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>

            <button className="flex items-center gap-2 px-5 py-3 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">SKU</th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    onClick={() => {
                      if (sortBy === 'name') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      else { setSortBy('name'); setSortOrder('asc'); }
                    }}
                  >
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Category</th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    onClick={() => {
                      if (sortBy === 'price') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      else { setSortBy('price'); setSortOrder('desc'); }
                    }}
                  >
                    Price
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    onClick={() => {
                      if (sortBy === 'stock') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      else { setSortBy('stock'); setSortOrder('desc'); }
                    }}
                  >
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <AnimatePresence>
                  {filteredAndSortedProducts.map((product, index) => (
                    <motion.tr 
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-950/50 transition-colors group"
                    >
                      <td className="px-6 py-5 font-mono text-sm text-gray-500 dark:text-gray-400">{product.sku}</td>
                      <td className="px-6 py-5">
                        <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-medium text-gray-900 dark:text-white">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{product.stock}</span>
                          <span className="text-xs text-gray-500">units</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStockColor(product.status)}`}>
                          {product.status === 'Low Stock' && <AlertTriangle className="w-3.5 h-3.5 mr-1" />}
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-500 dark:text-gray-400">
                        {product.lastUpdated}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 hover:text-indigo-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 hover:text-amber-600 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 hover:text-red-600 transition-colors">
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
          {filteredAndSortedProducts.length === 0 && (
            <div className="py-20 text-center">
              <Package className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700" />
              <p className="mt-4 text-gray-500">No products found matching your criteria.</p>
            </div>
          )}

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-sm">
            <div className="text-gray-500">
              Showing 1-{filteredAndSortedProducts.length} of {filteredAndSortedProducts.length} products
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800">Previous</button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl">1</button>
              <button className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
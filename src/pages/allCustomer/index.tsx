'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  UserPlus, 
  Eye, 
  Users, 
//   TrendingUp, 
  DollarSign, 
  Calendar, 
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  totalOrders: number;
  totalSpent: number;
  status: 'Active' | 'Inactive';
  joinDate: string;
  lastOrderDate?: string;
}

const mockCustomers: Customer[] = [
  { id: 'C001', name: 'Ahmed Rahman', email: 'ahmed.r@gmail.com', phone: '+880 1711-234567', totalOrders: 12, totalSpent: 2450.75, status: 'Active', joinDate: '2025-03-15', lastOrderDate: '2026-05-06' },
  { id: 'C002', name: 'Sadia Khan', email: 'sadia.khan@gmail.com', phone: '+880 1812-345678', totalOrders: 8, totalSpent: 890.50, status: 'Active', joinDate: '2025-06-22', lastOrderDate: '2026-05-05' },
  { id: 'C003', name: 'Rakib Hassan', email: 'rakib.h@gmail.com', totalOrders: 3, totalSpent: 329.99, status: 'Inactive', joinDate: '2025-08-10', lastOrderDate: '2026-04-12' },
  { id: 'C004', name: 'Nadia Islam', email: 'nadia.i@gmail.com', phone: '+880 1913-456789', totalOrders: 15, totalSpent: 1870.25, status: 'Active', joinDate: '2025-01-05', lastOrderDate: '2026-05-07' },
  { id: 'C005', name: 'Fahim Chowdhury', email: 'fahim.c@gmail.com', totalOrders: 5, totalSpent: 645.00, status: 'Active', joinDate: '2025-09-18', lastOrderDate: '2026-05-01' },
];

const AllCustomersPage: React.FC = () => {
  const [customers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(c => c.status === statusFilter);
    }

    return result.sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
  }, [customers, searchTerm, statusFilter]);

  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'Active').length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    newThisMonth: customers.filter(c => {
      const joinDate = new Date(c.joinDate);
      return joinDate.getMonth() === 4 && joinDate.getFullYear() === 2026; // May 2026
    }).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Users className="w-9 h-9" />
              All Customers
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and analyze your customer base</p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              Export Customers
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-medium"
            >
              <UserPlus className="w-4 h-4" />
              Add Customer
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Customers", value: stats.totalCustomers, icon: Users, color: "blue" },
            { label: "Active Customers", value: stats.activeCustomers, icon: Users, color: "emerald" },
            { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: "emerald" },
            { label: "New This Month", value: stats.newThisMonth, icon: Calendar, color: "amber" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-semibold mt-3 text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`w-9 h-9 text-${stat.color}-600`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-5 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:border-indigo-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'All' | 'Active' | 'Inactive')}
              className="px-5 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl focus:border-indigo-500"
            >
              <option value="All">All Customers</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-5 text-left">Customer</th>
                  <th className="px-6 py-5 text-left">Contact</th>
                  <th className="px-6 py-5 text-center">Orders</th>
                  <th className="px-6 py-5 text-right">Total Spent</th>
                  <th className="px-6 py-5 text-center">Status</th>
                  <th className="px-6 py-5 text-left">Joined</th>
                  <th className="px-6 py-5 text-left">Last Order</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <AnimatePresence>
                  {filteredCustomers.map((customer, idx) => (
                    <motion.tr
                      key={customer.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-950/70 group cursor-pointer"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{customer.name}</div>
                            <div className="text-sm text-gray-500">{customer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-600 dark:text-gray-400">
                        {customer.phone || '—'}
                      </td>
                      <td className="px-6 py-5 text-center font-medium">{customer.totalOrders}</td>
                      <td className="px-6 py-5 text-right font-semibold">
                        ${customer.totalSpent.toFixed(2)}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-flex px-4 py-1.5 text-xs font-medium rounded-full ${
                          customer.status === 'Active' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' 
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-500">{customer.joinDate}</td>
                      <td className="px-6 py-5 text-sm text-gray-500">
                        {customer.lastOrderDate || '—'}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => { e.stopPropagation(); setSelectedCustomer(customer); }}
                          className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-500 hover:text-indigo-600"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Customer Details Modal - Will expand later if needed */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl p-8"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-medium">
                    {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCustomer.name}</h2>
                    <p className="text-gray-500">{selectedCustomer.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)}>
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-2xl">
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-2xl font-semibold">{selectedCustomer.totalOrders}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-2xl">
                    <p className="text-sm text-gray-500">Total Spent</p>
                    <p className="text-2xl font-semibold">${selectedCustomer.totalSpent.toFixed(2)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Member Since</p>
                  <p className="font-medium">{selectedCustomer.joinDate}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllCustomersPage;
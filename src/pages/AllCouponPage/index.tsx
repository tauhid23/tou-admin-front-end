'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Edit2, Trash2, Copy, Tag, Calendar, Percent 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CreateCouponModal from './_components/CreateCouponModal';

interface Coupon {
  id: string;
  code: string;
  type: 'Percentage' | 'Fixed';
  value: number;
  minOrder: number;
  usageLimit: number;
  used: number;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Expired' | 'Scheduled';
}

const mockCoupons: Coupon[] = [
  { id: 'CP001', code: 'SUMMER25', type: 'Percentage', value: 25, minOrder: 1500, usageLimit: 500, used: 142, startDate: '2026-05-01', endDate: '2026-05-31', status: 'Active' },
  { id: 'CP002', code: 'WELCOME10', type: 'Fixed', value: 100, minOrder: 500, usageLimit: 1000, used: 876, startDate: '2026-04-01', endDate: '2026-06-30', status: 'Active' },
  { id: 'CP003', code: 'FLASH50', type: 'Percentage', value: 50, minOrder: 3000, usageLimit: 200, used: 45, startDate: '2026-05-10', endDate: '2026-05-12', status: 'Active' },
  { id: 'CP004', code: 'NEWUSER15', type: 'Percentage', value: 15, minOrder: 0, usageLimit: 300, used: 289, startDate: '2026-01-01', endDate: '2026-12-31', status: 'Active' },
];

const AllCouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Expired' | 'Scheduled'>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredCoupons = useMemo(() => {
    let result = [...coupons];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c => c.code.toLowerCase().includes(term));
    }

    if (statusFilter !== 'All') {
      result = result.filter(c => c.status === statusFilter);
    }

    return result;
  }, [coupons, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400';
      case 'Expired': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
      case 'Scheduled': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };


  const handleCreateCoupon = (newCouponData: any) => {
    const newCoupon: Coupon = {
      ...newCouponData,
      id: `CP${Date.now().toString().slice(-4)}`,
      used: 0,
      status: 'Active',
    };

    setCoupons(prev => [newCoupon, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Tag className="w-9 h-9" />
              All Coupons
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage promotional codes and discounts</p>
          </div>

          <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsCreateModalOpen(true)}
        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-medium hover:bg-indigo-700"
      >
        <Plus className="w-5 h-5" />
        Create Coupon
      </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
            <p className="text-gray-500">Total Coupons</p>
            <p className="text-4xl font-bold mt-2">{coupons.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
            <p className="text-gray-500">Active Coupons</p>
            <p className="text-4xl font-bold mt-2 text-emerald-600">
              {coupons.filter(c => c.status === 'Active').length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
            <p className="text-gray-500">Total Used</p>
            <p className="text-4xl font-bold mt-2">
              {coupons.reduce((sum, c) => sum + c.used, 0)}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 mb-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search coupon code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl focus:border-indigo-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-5 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Scheduled">Scheduled</option>
            </select>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-950 border-b">
                <th className="px-8 py-5 text-left">Coupon Code</th>
                <th className="px-8 py-5 text-left">Type</th>
                <th className="px-8 py-5 text-right">Value</th>
                <th className="px-8 py-5 text-right">Min Order</th>
                <th className="px-8 py-5 text-center">Usage</th>
                <th className="px-8 py-5 text-center">Validity</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredCoupons.map((coupon) => (
                <motion.tr key={coupon.id} className="hover:bg-gray-50 dark:hover:bg-gray-950/70 group">
                  <td className="px-8 py-6 font-mono font-semibold text-lg">{coupon.code}</td>
                  <td className="px-8 py-6">
                    <span className="px-4 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 rounded-full text-sm">
                      {coupon.type}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right font-semibold">
                    {coupon.type === 'Percentage' ? `${coupon.value}%` : `৳${coupon.value}`}
                  </td>
                  <td className="px-8 py-6 text-right">৳{coupon.minOrder}</td>
                  <td className="px-8 py-6 text-center">
                    <div className="text-sm">
                      {coupon.used} / {coupon.usageLimit}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center text-sm text-gray-500">
                    {coupon.startDate} — {coupon.endDate}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`inline-flex px-4 py-1 rounded-full text-xs font-medium ${getStatusColor(coupon.status)}`}>
                      {coupon.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"><Copy className="w-4 h-4" /></button>
                      <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CreateCouponModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateCoupon={handleCreateCoupon}
      />
    </div>
  );
};

export default AllCouponsPage;
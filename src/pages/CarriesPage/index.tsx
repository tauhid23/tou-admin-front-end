'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

interface Carrier {
  id: number;
  name: string;
  logo?: string;
  type: 'Courier' | 'Express' | 'Self';
  baseRate: number;
  estimatedDays: string;
  status: 'Active' | 'Inactive';
  description: string;
}

const CarriersPage: React.FC = () => {
  const [carriers, setCarriers] = useState<Carrier[]>([
    { id: 1, name: "Pathao", type: "Express", baseRate: 70, estimatedDays: "1-2 Days", status: "Active", description: "Fastest delivery in Dhaka" },
    { id: 2, name: "RedX", type: "Courier", baseRate: 90, estimatedDays: "2-3 Days", status: "Active", description: "Reliable nationwide delivery" },
    { id: 3, name: "Sundarban Courier", type: "Courier", baseRate: 110, estimatedDays: "3-5 Days", status: "Active", description: "Best for outside Dhaka" },
    { id: 4, name: "Self Delivery", type: "Self", baseRate: 50, estimatedDays: "Same Day", status: "Active", description: "Internal delivery team" },
  ]);

  const toggleStatus = (id: number) => {
    setCarriers(prev => prev.map(c => 
      c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Truck className="w-9 h-9" />
              Shipping Carriers
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Manage your delivery partners and rates</p>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl hover:bg-indigo-700 transition-colors">
            <Plus className="w-5 h-5" /> Add New Carrier
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-950 border-b">
                <th className="px-8 py-5 text-left">Carrier</th>
                <th className="px-8 py-5 text-left">Type</th>
                <th className="px-8 py-5 text-right">Base Rate</th>
                <th className="px-8 py-5 text-center">Estimated Delivery</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {carriers.map((carrier) => (
                <motion.tr key={carrier.id} className="hover:bg-gray-50 dark:hover:bg-gray-950/70 group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                        🚚
                      </div>
                      <div>
                        <p className="font-semibold">{carrier.name}</p>
                        <p className="text-sm text-gray-500">{carrier.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-4 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 rounded-full text-sm">
                      {carrier.type}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right font-medium">৳{carrier.baseRate}</td>
                  <td className="px-8 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    {carrier.estimatedDays}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button
                      onClick={() => toggleStatus(carrier.id)}
                      className={`flex items-center gap-2 text-sm font-medium ${carrier.status === 'Active' ? 'text-emerald-600' : 'text-gray-400'}`}
                    >
                      {carrier.status === 'Active' ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                      {carrier.status}
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CarriersPage;
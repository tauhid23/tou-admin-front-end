'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface DeliveryRule {
  id: number;
  title: string;
  type: 'Free Shipping' | 'Express Delivery' | 'Cut-off Time' | 'Minimum Order';
  condition: string;
  value: string;
  status: 'Active' | 'Inactive';
}

const DeliveryRulesPage: React.FC = () => {
  const [rules, setRules] = useState<DeliveryRule[]>([
    {
      id: 1,
      title: "Free Shipping Over",
      type: "Free Shipping",
      condition: "Order amount greater than",
      value: "৳1500",
      status: "Active"
    },
    {
      id: 2,
      title: "Express Delivery",
      type: "Express Delivery",
      condition: "Additional charge for",
      value: "Same day delivery",
      status: "Active"
    },
    {
      id: 3,
      title: "Order Cut-off Time",
      type: "Cut-off Time",
      condition: "Orders placed before",
      value: "3:00 PM",
      status: "Active"
    },
    {
      id: 4,
      title: "Minimum Order Value",
      type: "Minimum Order",
      condition: "Minimum order amount",
      value: "৳500",
      status: "Active"
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Zap className="w-9 h-9" />
              Delivery Rules
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Configure smart delivery conditions and promotions</p>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl hover:bg-indigo-700">
            <Plus className="w-5 h-5" /> Add New Rule
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
          <div className="grid grid-cols-1 gap-4">
            {rules.map((rule) => (
              <motion.div
                key={rule.id}
                className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="px-4 py-1.5 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 rounded-full">
                        {rule.type}
                      </span>
                      <h3 className="font-semibold text-lg">{rule.title}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {rule.condition} <span className="font-medium text-gray-900 dark:text-white">{rule.value}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${rule.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {rule.status}
                    </span>
                    <div className="flex gap-2">
                      <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryRulesPage;
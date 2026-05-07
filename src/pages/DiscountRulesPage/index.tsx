'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface DiscountRule {
  id: string;
  name: string;
  type: 'Cart Amount' | 'Product Category' | 'Buy X Get Y' | 'First Order' | 'Loyalty';
  condition: string;
  discount: string;
  applicableTo: string;
  status: 'Active' | 'Inactive';
}

const DiscountRulesPage: React.FC = () => {
  const [rules, setRules] = useState<DiscountRule[]>([
    {
      id: 'DR001',
      name: 'Spend More Save More',
      type: 'Cart Amount',
      condition: 'Cart total ≥ ৳2000',
      discount: '10% OFF',
      applicableTo: 'All Products',
      status: 'Active'
    },
    {
      id: 'DR002',
      name: 'Buy 2 Get 1 Free',
      type: 'Buy X Get Y',
      condition: 'Minimum 2 items',
      discount: '1 Free',
      applicableTo: 'T-Shirts & Polos',
      status: 'Active'
    },
    {
      id: 'DR003',
      name: 'First Order Special',
      type: 'First Order',
      condition: 'New Customers Only',
      discount: '15% OFF',
      applicableTo: 'All Products',
      status: 'Active'
    },
    {
      id: 'DR004',
      name: 'Electronics Discount',
      type: 'Product Category',
      condition: 'On Electronics Category',
      discount: '8% OFF',
      applicableTo: 'Headphones, Watches, Chargers',
      status: 'Inactive'
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Target className="w-9 h-9" />
              Discount Rules
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Automatic discounts applied without coupon codes</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-medium hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5" />
            New Discount Rule
          </motion.button>
        </div>

        <div className="space-y-4">
          {rules.map((rule) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-7 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{rule.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{rule.condition}</p>
                    <p className="text-sm text-gray-500 mt-2">Applies to: {rule.applicableTo}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-emerald-600">{rule.discount}</div>
                  <span className={`inline-block mt-3 px-5 py-1.5 text-sm font-medium rounded-full ${
                    rule.status === 'Active' 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {rule.status}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
                <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscountRulesPage;
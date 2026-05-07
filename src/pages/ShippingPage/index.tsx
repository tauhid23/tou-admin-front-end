'use client';

import React from 'react';
import { Truck, MapPin, Settings, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import {Link} from 'react-router-dom';

const ShippingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Truck className="w-9 h-9" />
            Shipping Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Configure how your products are delivered to customers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Shipping Zones */}
          <Link to="/dashboard/shipping/zones">
            <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-xl cursor-pointer group">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Shipping Zones</h3>
              <p className="text-gray-500 dark:text-gray-400">Define regions and zone-based pricing</p>
            </motion.div>
          </Link>

          {/* Carriers */}
          <Link to="/dashboard/shipping/carriers">
            <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-xl cursor-pointer group">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Truck className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Carriers</h3>
              <p className="text-gray-500 dark:text-gray-400">Manage shipping partners & rates</p>
            </motion.div>
          </Link>

          {/* Delivery Rules */}
          <Link to="/dashboard/shipping/rules">
            <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-xl cursor-pointer group">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Delivery Rules</h3>
              <p className="text-gray-500 dark:text-gray-400">Free shipping, express, cut-off times</p>
            </motion.div>
          </Link>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-semibold mb-6">Quick Overview</h3>
            <div className="space-y-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Active Zones</span>
                <span className="font-semibold">6</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Active Carriers</span>
                <span className="font-semibold">4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Free Shipping Orders</span>
                <span className="font-semibold text-emerald-600">87</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
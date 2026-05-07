'use client';
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const ShippingZonesPage = () => {
  const [zones] = useState([
    { id: 1, name: "Dhaka Metro", type: "Domestic", rate: 60, minOrder: 0, status: "Active" },
    { id: 2, name: "Outside Dhaka", type: "Domestic", rate: 120, minOrder: 500, status: "Active" },
    { id: 3, name: "International", type: "International", rate: 850, minOrder: 0, status: "Active" },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Shipping Zones</h1>
            <p className="text-gray-500">Manage delivery regions and pricing</p>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl hover:bg-indigo-700">
            <Plus className="w-4 h-4" /> New Zone
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-5">Zone Name</th>
                <th className="text-left py-5">Type</th>
                <th className="text-right py-5">Base Rate</th>
                <th className="text-right py-5">Min Order</th>
                <th className="text-center py-5">Status</th>
                <th className="text-right py-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {zones.map(zone => (
                <tr key={zone.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-5 font-medium flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" /> {zone.name}
                  </td>
                  <td className="py-5">{zone.type}</td>
                  <td className="py-5 text-right">৳{zone.rate}</td>
                  <td className="py-5 text-right">৳{zone.minOrder}</td>
                  <td className="py-5 text-center">
                    <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm">Active</span>
                  </td>
                  <td className="py-5 text-right">
                    <button className="p-2 hover:bg-gray-100 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShippingZonesPage;
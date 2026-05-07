'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlashSale {
  id?: string;
  title: string;
  subtitle: string;
  discount: string;
  startTime: string;
  endTime: string;
  bannerColor: string;
  productsCount?: number;
  status?: 'Active' | 'Upcoming' | 'Ended';
}

interface FlashSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sale: FlashSale) => void;
  initialData?: FlashSale | null;   // For editing
  mode: 'create' | 'edit';
}

const bannerColors = [
  'from-purple-600 to-pink-600',
  'from-orange-500 to-red-600',
  'from-blue-600 to-cyan-500',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-purple-600',
];

const FlashSaleModal: React.FC<FlashSaleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState<FlashSale>({
    title: '',
    subtitle: '',
    discount: '',
    startTime: '',
    endTime: '',
    bannerColor: bannerColors[0],
  });

  // Populate form when editing
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        subtitle: '',
        discount: '',
        startTime: '',
        endTime: '',
        bannerColor: bannerColors[0],
      });
    }
  }, [initialData, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="px-8 py-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Zap className="w-6 h-6 text-orange-500" />
                {mode === 'create' ? 'Create Flash Sale' : 'Edit Flash Sale'}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Flash Sale Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-orange-500 bg-gray-50 dark:bg-gray-950"
                  placeholder="Eid Mega Sale"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-orange-500 bg-gray-50 dark:bg-gray-950"
                  placeholder="Hurry! Limited Time Offer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Discount Text</label>
                <input
                  type="text"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-orange-500 bg-gray-50 dark:bg-gray-950"
                  placeholder="Up to 60% OFF"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Time</label>
                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-950"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Time</label>
                  <input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-950"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Banner Color</label>
                <div className="flex gap-3">
                  {bannerColors.map((color, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData({ ...formData, bannerColor: color })}
                      className={`w-10 h-10 rounded-xl bg-gradient-to-r ${color} border-2 transition-all ${
                        formData.bannerColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 border border-gray-300 dark:border-gray-700 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-medium hover:brightness-110"
                >
                  {mode === 'create' ? 'Create Flash Sale' : 'Update Flash Sale'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FlashSaleModal;
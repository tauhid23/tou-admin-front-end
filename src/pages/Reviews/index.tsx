'use client';

import React, { useState, useMemo } from 'react';
import { 
  Star, 
  Search, 
  Filter, 
  Reply, 
  Trash2, 
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  id: string;
  customerName: string;
  customerAvatar?: string;
  productName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  verified: boolean;
}

const mockReviews: Review[] = [
  {
    id: 'R001',
    customerName: 'Ahmed Rahman',
    productName: 'Wireless Headphones Pro',
    rating: 5,
    comment: 'Excellent sound quality and very comfortable for long use. Battery lasts forever!',
    date: '2026-05-06',
    status: 'Approved',
    verified: true,
  },
  {
    id: 'R002',
    customerName: 'Sadia Khan',
    productName: 'Organic Cotton T-Shirt',
    rating: 4,
    comment: 'Good quality but slightly smaller than expected. Still happy with the purchase.',
    date: '2026-05-05',
    status: 'Pending',
    verified: true,
  },
  {
    id: 'R003',
    customerName: 'Rakib Hassan',
    productName: 'Smart Watch Ultra',
    rating: 3,
    comment: 'The watch is nice but the heart rate sensor is not very accurate.',
    date: '2026-05-07',
    status: 'Approved',
    verified: false,
  },
  {
    id: 'R004',
    customerName: 'Nadia Islam',
    productName: 'Stainless Steel Water Bottle',
    rating: 5,
    comment: 'Best water bottle I have ever used. Keeps water cold for 24+ hours.',
    date: '2026-05-04',
    status: 'Rejected',
    verified: true,
  },
];

const ReviewsPage: React.FC = () => {
  const [reviews] = useState<Review[]>(mockReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Approved' | 'Pending' | 'Rejected'>('All');
  const [ratingFilter, setRatingFilter] = useState<number | 'All'>('All');

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(r =>
        r.customerName.toLowerCase().includes(term) ||
        r.productName.toLowerCase().includes(term) ||
        r.comment.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(r => r.status === statusFilter);
    }

    if (ratingFilter !== 'All') {
      result = result.filter(r => r.rating === ratingFilter);
    }

    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [reviews, searchTerm, statusFilter, ratingFilter]);

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
        />
      ))}
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30';
      case 'Pending': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
      case 'Rejected': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customer Reviews</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor and manage all product reviews</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800"
          >
            <div className="text-gray-500 dark:text-gray-400">Total Reviews</div>
            <div className="text-4xl font-semibold mt-2">{reviews.length}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800"
          >
            <div className="text-gray-500 dark:text-gray-400">Average Rating</div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-4xl font-semibold">{averageRating}</span>
              <div className="flex">{renderStars(Math.round(parseFloat(averageRating)))}</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800"
          >
            <div className="text-gray-500 dark:text-gray-400">Approved</div>
            <div className="text-4xl font-semibold mt-2 text-emerald-600">
              {reviews.filter(r => r.status === 'Approved').length}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800"
          >
            <div className="text-gray-500 dark:text-gray-400">Pending</div>
            <div className="text-4xl font-semibold mt-2 text-amber-600">
              {reviews.filter(r => r.status === 'Pending').length}
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews, customers, or products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-indigo-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-5 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value === 'All' ? 'All' : Number(e.target.value))}
              className="px-5 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Ratings</option>
              {[5, 4, 3, 2, 1].map((num) => (
                <option key={num} value={num}>{num} Stars</option>
              ))}
            </select>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Product</th>
                  <th className="px-6 py-4 text-left">Rating</th>
                  <th className="px-6 py-4 text-left">Review</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <AnimatePresence>
                  {filteredReviews.map((review, idx) => (
                    <motion.tr
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-950/50 group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {review.customerName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-medium">{review.customerName}</div>
                            {review.verified && (
                              <div className="text-xs text-emerald-600 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Verified Purchase
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-700 dark:text-gray-300">
                        {review.productName}
                      </td>

                      <td className="px-6 py-5">
                        {renderStars(review.rating)}
                      </td>

                      <td className="px-6 py-5 max-w-md">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          "{review.comment}"
                        </p>
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-500 dark:text-gray-400">
                        {review.date}
                      </td>

                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                          {review.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 hover:text-indigo-600">
                            <Reply className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 hover:text-emerald-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 hover:text-red-600">
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

          {filteredReviews.length === 0 && (
            <div className="py-20 text-center text-gray-500">
              No reviews found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
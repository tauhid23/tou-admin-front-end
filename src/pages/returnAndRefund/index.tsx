'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, Download, Eye, RotateCcw, CheckCircle, XCircle, DollarSign, Package 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReturnRequest {
  id: string;
  returnNumber: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  reason: string;
  amount: number;
  status: 'Return Requested' | 'Return Approved' | 'Items Received' | 'Refund Processed' | 'Rejected';
  requestDate: string;
  returnReasonDetail?: string;
}

const mockReturns: ReturnRequest[] = [
  {
    id: 'RET-1001',
    returnNumber: '#RET-1001',
    orderNumber: '#ORD-1001',
    customerName: 'Ahmed Rahman',
    customerEmail: 'ahmed.r@gmail.com',
    productName: 'Wireless Headphones Pro',
    reason: 'Defective Product',
    amount: 129.99,
    status: 'Return Requested',
    requestDate: '2026-05-06',
    returnReasonDetail: 'Sound is distorted on left side.'
  },
  {
    id: 'RET-1002',
    returnNumber: '#RET-1002',
    orderNumber: '#ORD-1004',
    customerName: 'Nadia Islam',
    customerEmail: 'nadia.i@gmail.com',
    productName: 'Organic Cotton T-Shirt',
    reason: 'Wrong Size',
    amount: 24.99,
    status: 'Items Received',
    requestDate: '2026-05-07',
  },
  {
    id: 'RET-1003',
    returnNumber: '#RET-1003',
    orderNumber: '#ORD-1005',
    customerName: 'Fahim Chowdhury',
    customerEmail: 'fahim.c@gmail.com',
    productName: 'Smart Watch Ultra',
    reason: 'Changed Mind',
    amount: 299.99,
    status: 'Refund Processed',
    requestDate: '2026-05-05',
  },
];

const ReturnsAndRefundsPage: React.FC = () => {
  const [returns, setReturns] = useState<ReturnRequest[]>(mockReturns);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filteredReturns = useMemo(() => {
    let result = [...returns];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(r =>
        r.returnNumber.toLowerCase().includes(term) ||
        r.orderNumber.toLowerCase().includes(term) ||
        r.customerName.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(r => r.status === statusFilter);
    }

    return result.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
  }, [returns, searchTerm, statusFilter]);

  const stats = {
    totalRequests: returns.length,
    pending: returns.filter(r => r.status === 'Return Requested').length,
    approved: returns.filter(r => r.status === 'Return Approved' || r.status === 'Items Received').length,
    refundedAmount: returns
      .filter(r => r.status === 'Refund Processed')
      .reduce((sum, r) => sum + r.amount, 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Return Requested': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
      case 'Return Approved': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400';
      case 'Items Received': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400';
      case 'Refund Processed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400';
      case 'Rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const updateReturnStatus = (newStatus: ReturnRequest['status']) => {
    if (!selectedReturn) return;

    setActionLoading(true);

    setTimeout(() => {
      setReturns(prev => prev.map(item =>
        item.id === selectedReturn.id ? { ...item, status: newStatus } : item
      ));
      setActionLoading(false);
      alert(`✅ Return ${selectedReturn.returnNumber} updated to ${newStatus}`);
      setSelectedReturn(null);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <RotateCcw className="w-9 h-9" />
              Returns & Refunds
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage all return and refund requests</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export Report
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Requests", value: stats.totalRequests, icon: Package, color: "blue" },
            { label: "Pending Approval", value: stats.pending, icon: RotateCcw, color: "amber" },
            { label: "Approved", value: stats.approved, icon: CheckCircle, color: "blue" },
            { label: "Refunded Amount", value: `$${stats.refundedAmount.toFixed(2)}`, icon: DollarSign, color: "emerald" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-semibold mt-3">{stat.value}</p>
                </div>
                <stat.icon className={`w-10 h-10 text-${stat.color}-600`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Return ID, Order ID or Customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl focus:border-indigo-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-5 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl focus:border-indigo-500"
            >
              <option value="All">All Status</option>
              <option value="Return Requested">Return Requested</option>
              <option value="Return Approved">Return Approved</option>
              <option value="Items Received">Items Received</option>
              <option value="Refund Processed">Refund Processed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-950 border-b">
                <th className="px-6 py-5 text-left">Return ID</th>
                <th className="px-6 py-5 text-left">Order ID</th>
                <th className="px-6 py-5 text-left">Customer</th>
                <th className="px-6 py-5 text-left">Product</th>
                <th className="px-6 py-5 text-left">Reason</th>
                <th className="px-6 py-5 text-right">Amount</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-left">Date</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredReturns.map((ret, idx) => (
                <motion.tr
                  key={ret.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-950/70 group cursor-pointer"
                  onClick={() => setSelectedReturn(ret)}
                >
                  <td className="px-6 py-5 font-mono font-medium">{ret.returnNumber}</td>
                  <td className="px-6 py-5 font-mono text-gray-500">{ret.orderNumber}</td>
                  <td className="px-6 py-5">
                    <div className="font-medium">{ret.customerName}</div>
                    <div className="text-sm text-gray-500">{ret.customerEmail}</div>
                  </td>
                  <td className="px-6 py-5 text-sm">{ret.productName}</td>
                  <td className="px-6 py-5 text-sm text-gray-600 dark:text-gray-400">{ret.reason}</td>
                  <td className="px-6 py-5 text-right font-semibold">${ret.amount.toFixed(2)}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex px-4 py-1.5 text-xs font-medium rounded-full ${getStatusColor(ret.status)}`}>
                      {ret.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500">{ret.requestDate}</td>
                  <td className="px-6 py-5 text-right">
                    <Eye className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================== RETURN DETAILS MODAL ==================== */}
      <AnimatePresence>
        {selectedReturn && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold">Return {selectedReturn.returnNumber}</h2>
                <button onClick={() => setSelectedReturn(null)}>
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium">{selectedReturn.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Reference</p>
                    <p className="font-medium">{selectedReturn.orderNumber}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Product</p>
                  <p className="font-medium">{selectedReturn.productName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Reason</p>
                  <p className="font-medium">{selectedReturn.reason}</p>
                  {selectedReturn.returnReasonDetail && (
                    <p className="mt-2 text-sm bg-gray-50 dark:bg-gray-950 p-4 rounded-2xl">{selectedReturn.returnReasonDetail}</p>
                  )}
                </div>

                <div className="flex justify-between items-center py-4 border-t border-b">
                  <span className="text-sm text-gray-500">Refund Amount</span>
                  <span className="text-2xl font-bold">${selectedReturn.amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-8 pt-0 flex flex-wrap gap-3">
                {selectedReturn.status === 'Return Requested' && (
                  <>
                    <button
                      onClick={() => updateReturnStatus('Return Approved')}
                      disabled={actionLoading}
                      className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-medium"
                    >
                      Approve Return
                    </button>
                    <button
                      onClick={() => updateReturnStatus('Rejected')}
                      disabled={actionLoading}
                      className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-medium"
                    >
                      Reject Request
                    </button>
                  </>
                )}

                {selectedReturn.status === 'Return Approved' && (
                  <button
                    onClick={() => updateReturnStatus('Items Received')}
                    className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-medium"
                  >
                    Mark Items as Received
                  </button>
                )}

                {selectedReturn.status === 'Items Received' && (
                  <button
                    onClick={() => updateReturnStatus('Refund Processed')}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-medium"
                  >
                    Process Refund
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReturnsAndRefundsPage;
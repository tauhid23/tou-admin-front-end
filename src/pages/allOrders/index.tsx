'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Eye, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  DollarSign,
  X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  products: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  date: string;
  items: string;
}

const AllOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    { id: 'ORD-1001', orderNumber: '#ORD-1001', customerName: 'Ahmed Rahman', customerEmail: 'ahmed.r@gmail.com', products: 3, total: 458.97, status: 'Delivered', paymentStatus: 'Paid', date: '2026-05-06', items: 'Headphones, T-Shirt, Watch' },
    { id: 'ORD-1002', orderNumber: '#ORD-1002', customerName: 'Sadia Khan', customerEmail: 'sadia.khan@gmail.com', products: 2, total: 324.98, status: 'Shipped', paymentStatus: 'Paid', date: '2026-05-07', items: 'Laptop Sleeve, Water Bottle' },
    { id: 'ORD-1003', orderNumber: '#ORD-1003', customerName: 'Rakib Hassan', customerEmail: 'rakib.h@gmail.com', products: 1, total: 129.99, status: 'Processing', paymentStatus: 'Paid', date: '2026-05-07', items: 'Wireless Headphones' },
    { id: 'ORD-1004', orderNumber: '#ORD-1004', customerName: 'Nadia Islam', customerEmail: 'nadia.i@gmail.com', products: 4, total: 89.96, status: 'Pending', paymentStatus: 'Pending', date: '2026-05-08', items: 'T-Shirt x4' },
    { id: 'ORD-1005', orderNumber: '#ORD-1005', customerName: 'Fahim Chowdhury', customerEmail: 'fahim.c@gmail.com', products: 1, total: 299.99, status: 'Cancelled', paymentStatus: 'Refunded', date: '2026-05-05', items: 'Smart Watch Ultra' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'total'>('date');

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newOrderStatus, setNewOrderStatus] = useState<Order['status'] | ''>('');
  const [newPaymentStatus, setNewPaymentStatus] = useState<Order['paymentStatus'] | ''>('');

  // Update Order Status & Payment Status
  const updateOrder = () => {
    if (!selectedOrder) return;

    setOrders(prev => prev.map(order => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          status: (newOrderStatus || order.status) as Order['status'],
          paymentStatus: (newPaymentStatus || order.paymentStatus) as Order['paymentStatus'],
        };
      }
      return order;
    }));

    alert(`✅ Order ${selectedOrder.orderNumber} updated successfully!`); // Replace with toast in production
    setSelectedOrder(null);
    setNewOrderStatus('');
    setNewPaymentStatus('');
  };

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order =>
        order.orderNumber.toLowerCase().includes(term) ||
        order.customerName.toLowerCase().includes(term) ||
        order.customerEmail.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(order => order.status === statusFilter);
    }

    if (paymentFilter !== 'All') {
      result = result.filter(order => order.paymentStatus === paymentFilter);
    }

    result.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.total - a.total;
    });

    return result;
  }, [orders, searchTerm, statusFilter, paymentFilter, sortBy]);

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    pending: orders.filter(o => o.status === 'Pending').length,
    shipped: orders.filter(o => o.status === 'Shipped').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400';
      case 'Shipped': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400';
      case 'Processing': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400';
      case 'Pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
      case 'Cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
      case 'Refunded': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'text-emerald-600';
      case 'Pending': return 'text-amber-600';
      case 'Refunded': return 'text-gray-600';
      case 'Failed': return 'text-red-600';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Package className="w-9 h-9" />
              All Orders
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track all customer orders. I have to Make a new Order, So that admin can manually make a order</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Orders", value: stats.totalOrders, icon: Package, color: "blue" },
            { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: "emerald" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "amber" },
            { label: "Shipped", value: stats.shipped, icon: Truck, color: "blue" },
            { label: "Delivered", value: stats.delivered, icon: CheckCircle, color: "emerald" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-semibold mt-3 text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`w-9 h-9 text-${stat.color}-600 dark:text-${stat.color}-500`} />
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
                placeholder="Search by Order ID, Customer name or Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:border-indigo-500"
              />
            </div>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-5 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:border-indigo-500">
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Refunded">Refunded</option>
            </select>

            <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="px-5 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:border-indigo-500">
              <option value="All">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Payment Pending</option>
              <option value="Refunded">Refunded</option>
              <option value="Failed">Failed</option>
            </select>

            <button
              onClick={() => setSortBy(sortBy === 'date' ? 'total' : 'date')}
              className="px-5 py-3 border border-gray-200 dark:border-gray-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              Sort by {sortBy === 'date' ? 'Amount' : 'Date'}
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-5 text-left">Order ID</th>
                  <th className="px-6 py-5 text-left">Customer</th>
                  <th className="px-6 py-5 text-left">Items</th>
                  <th className="px-6 py-5 text-right">Amount</th>
                  <th className="px-6 py-5 text-center">Order Status</th>
                  <th className="px-6 py-5 text-center">Payment</th>
                  <th className="px-6 py-5 text-left">Date</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <AnimatePresence>
                  {filteredOrders.map((order, idx) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-950/70 group transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedOrder(order);
                        setNewOrderStatus(order.status);
                        setNewPaymentStatus(order.paymentStatus);
                      }}
                    >
                      <td className="px-6 py-5 font-mono font-medium text-gray-900 dark:text-white">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{order.customerEmail}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{order.products}</span>
                          <span className="text-xs text-gray-500">items</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">{order.items}</div>
                      </td>
                      <td className="px-6 py-5 text-right font-semibold text-lg">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-flex px-4 py-1.5 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`font-medium ${getPaymentColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-500 dark:text-gray-400">
                        {order.date}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                          className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-500 hover:text-indigo-600 transition-colors"
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

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
          <p>Showing {filteredOrders.length} orders</p>
        </div>
      </div>

      {/* ==================== ORDER DETAILS & STATUS UPDATE MODAL ==================== */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="px-8 py-6 border-b flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Order {selectedOrder.orderNumber}</h2>
                  <p className="text-gray-500">{selectedOrder.date}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 space-y-8">
                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold mb-3">Customer</h3>
                  <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded-2xl">
                    <p className="font-medium text-lg">{selectedOrder.customerName}</p>
                    <p className="text-gray-500">{selectedOrder.customerEmail}</p>
                  </div>
                </div>

                {/* Status Update */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Order Status</label>
                    <select
                      value={newOrderStatus || selectedOrder.status}
                      onChange={(e) => setNewOrderStatus(e.target.value as Order['status'])}
                      className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-950 focus:border-indigo-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Payment Status</label>
                    <select
                      value={newPaymentStatus || selectedOrder.paymentStatus}
                      onChange={(e) => setNewPaymentStatus(e.target.value as Order['paymentStatus'])}
                      className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-950 focus:border-indigo-500"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Failed">Failed</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-3">Order Items</h3>
                  <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded-2xl">
                    {selectedOrder.items}
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 border-t flex justify-end gap-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updateOrder}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-medium transition-colors"
                >
                  Update Order
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllOrdersPage;
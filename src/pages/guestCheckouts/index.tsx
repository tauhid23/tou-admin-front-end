'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Eye, 
  UserPlus, 
  Users, 
  DollarSign, 
  TrendingUp, 
  X,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


interface GuestOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone?: string;
  total: number;
  itemsCount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  checkoutDate: string;
  shippingAddress: string;
}

const mockGuestOrders: GuestOrder[] = [
  {
    id: 'GCO-1001',
    orderNumber: '#GCO-1001',
    customerName: 'Tanvir Ahmed',
    email: 'tanvir.guest@gmail.com',
    phone: '+880 1712-345678',
    total: 458.97,
    itemsCount: 3,
    status: 'Delivered',
    checkoutDate: '2026-05-06',
    shippingAddress: 'House 45, Road 12, Gulshan-2, Dhaka'
  },
  {
    id: 'GCO-1002',
    orderNumber: '#GCO-1002',
    customerName: 'Priya Sharma',
    email: 'priya.sharma92@yahoo.com',
    total: 129.99,
    itemsCount: 1,
    status: 'Shipped',
    checkoutDate: '2026-05-07',
    shippingAddress: 'Apartment 3B, Block D, Mirpur-10, Dhaka'
  },
  {
    id: 'GCO-1003',
    orderNumber: '#GCO-1003',
    customerName: 'Kazi Rafiq',
    email: 'kazi.rafiq@hotmail.com',
    phone: '+880 1819-876543',
    total: 299.99,
    itemsCount: 2,
    status: 'Processing',
    checkoutDate: '2026-05-07',
    shippingAddress: 'Road 7, Sector 11, Uttara, Dhaka'
  },
];

const GuestCheckoutsPage: React.FC = () => {
  const [guestOrders] = useState<GuestOrder[]>(mockGuestOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<GuestOrder | null>(null);
const [isConverting, setIsConverting] = useState(false);
  const [conversionSuccess, setConversionSuccess] = useState(false);
  const filteredOrders = useMemo(() => {
    let result = [...guestOrders];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order =>
        order.customerName.toLowerCase().includes(term) ||
        order.email.toLowerCase().includes(term) ||
        order.orderNumber.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(order => order.status === statusFilter);
    }

    return result.sort((a, b) => new Date(b.checkoutDate).getTime() - new Date(a.checkoutDate).getTime());
  }, [guestOrders, searchTerm, statusFilter]);

  const stats = {
    totalGuestOrders: guestOrders.length,
    totalRevenue: guestOrders.reduce((sum, o) => sum + o.total, 0),
    avgOrderValue: guestOrders.length ? 
      (guestOrders.reduce((sum, o) => sum + o.total, 0) / guestOrders.length) : 0,
    pendingOrders: guestOrders.filter(o => o.status === 'Pending' || o.status === 'Processing').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400';
      case 'Shipped': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400';
      case 'Processing': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400';
      case 'Pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
      case 'Cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };


  
  const handleConvertToCustomer = async () => {
    if (!selectedOrder) return;

    setIsConverting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));

    setIsConverting(false);
    setConversionSuccess(true);

    // In real app, you would create a new customer record and link the order
    setTimeout(() => {
      setConversionSuccess(false);
      setSelectedOrder(null);
      alert(`🎉 ${selectedOrder.customerName} has been successfully converted to a registered customer!`);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Users className="w-9 h-9" />
              Guest Checkouts
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Orders placed without account creation
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              Export Guest Data
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Guest Orders", value: stats.totalGuestOrders, icon: Users, color: "blue" },
            { label: "Revenue from Guests", value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: "emerald" },
            { label: "Average Order Value", value: `$${stats.avgOrderValue.toFixed(2)}`, icon: TrendingUp, color: "amber" },
            { label: "Pending Orders", value: stats.pendingOrders, icon: Users, color: "orange" },
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
                  <p className="text-3xl font-semibold mt-3">{stat.value}</p>
                </div>
                <stat.icon className={`w-9 h-9 text-${stat.color}-600`} />
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
                placeholder="Search by name, email or order number..."
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
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table */}
       <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <table className="w-full min-w-[1100px]">
            {/* Table Header same as before */}
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-950 border-b">
                <th className="px-6 py-5 text-left">Order ID</th>
                <th className="px-6 py-5 text-left">Customer</th>
                <th className="px-6 py-5 text-left">Email</th>
                <th className="px-6 py-5 text-center">Items</th>
                <th className="px-6 py-5 text-right">Amount</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-left">Checkout Date</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredOrders.map((order, idx) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-950/70 group cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  {/* Same table cells as before */}
                  <td className="px-6 py-5 font-mono font-medium">{order.orderNumber}</td>
                  <td className="px-6 py-5 font-medium">{order.customerName}</td>
                  <td className="px-6 py-5 text-sm text-gray-600 dark:text-gray-400">{order.email}</td>
                  <td className="px-6 py-5 text-center font-medium">{order.itemsCount}</td>
                  <td className="px-6 py-5 text-right font-semibold text-lg">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex px-4 py-1.5 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500">{order.checkoutDate}</td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <motion.button whileHover={{ scale: 1.1 }} onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-emerald-600">
                        <UserPlus className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Guest Order {selectedOrder.orderNumber}</h2>
                  <p className="text-gray-500">{selectedOrder.checkoutDate}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 space-y-10">
                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Customer Name</p>
                    <p className="text-xl font-semibold">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-flex px-4 py-1.5 text-sm font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                {/* Contact & Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedOrder.email}</p>
                  </div>
                  {selectedOrder.phone && (
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{selectedOrder.phone}</p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Shipping Address</p>
                  <p className="bg-gray-50 dark:bg-gray-950 p-5 rounded-2xl leading-relaxed">
                    {selectedOrder.shippingAddress}
                  </p>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Order Items</h3>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-950">
                        <tr>
                          <th className="px-6 py-4 text-left">Product</th>
                          <th className="px-6 py-4 text-center">Qty</th>
                          <th className="px-6 py-4 text-right">Price</th>
                          <th className="px-6 py-4 text-right">Total</th>
                        </tr>
                      </thead>
                      {/* <tbody className="divide-y">
                        {selectedOrder.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4 font-medium">{item.name}</td>
                            <td className="px-6 py-4 text-center">{item.quantity}</td>
                            <td className="px-6 py-4 text-right">${item.price.toFixed(2)}</td>
                            <td className="px-6 py-4 text-right font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody> */}
                    </table>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-6 border-t text-xl">
                  <span className="font-semibold">Total Amount</span>
                  <span className="font-bold text-3xl">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-8 py-6 border-t flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-3.5 border border-gray-300 dark:border-gray-700 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Close
                </button>

                <button
                  onClick={handleConvertToCustomer}
                  disabled={isConverting || conversionSuccess}
                  className="flex-1 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-medium flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {conversionSuccess ? (
                    <> <CheckCircle className="w-5 h-5" /> Converted Successfully </>
                  ) : isConverting ? (
                    <> Converting to Customer... </>
                  ) : (
                    <> <UserPlus className="w-5 h-5" /> Convert to Registered Customer </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GuestCheckoutsPage;
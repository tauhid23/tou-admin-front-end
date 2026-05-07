// 'use client';

// import React, { useState } from 'react';
// import { Plus, Clock, Zap, Edit2, Trash2, Play } from 'lucide-react';
// import { motion } from 'framer-motion';
// import FlashSaleModal from './_components/FlashSalesModal';

// interface FlashSale {
//   id: string;
//   title: string;
//   subtitle: string;
//   discount: string;
//   startTime: string;
//   endTime: string;
//   status: 'Active' | 'Upcoming' | 'Ended';
//   productsCount: number;
//   bannerColor: string;
// }

// const FlashSalesPage: React.FC = () => {
//   const [flashSales,setFlashSales] = useState<FlashSale[]>([
//     {
//       id: 'FS001',
//       title: 'Midnight Flash Sale',
//       subtitle: 'Hurry! Limited Time',
//       discount: 'Up to 60% OFF',
//       startTime: '2026-05-20 00:00',
//       endTime: '2026-05-21 23:59',
//       status: 'Upcoming',
//       productsCount: 67,
//       bannerColor: 'from-purple-600 to-pink-600'
//     },
//     {
//       id: 'FS002',
//       title: 'Eid Ultra Sale',
//       subtitle: 'Biggest Sale of the Year',
//       discount: 'Flat 50% OFF',
//       startTime: '2026-05-08 10:00',
//       endTime: '2026-05-10 22:00',
//       status: 'Active',
//       productsCount: 142,
//       bannerColor: 'from-orange-500 to-red-600'
//     },
//   ]);

// const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingSale, setEditingSale] = useState<FlashSale | null>(null);
// const handleSaveSale = (sale: FlashSale) => {
//     if (editingSale) {
//       // Edit mode
//       setFlashSales(prev => prev.map(s => s.id === editingSale.id ? { ...sale, id: editingSale.id } : s));
//     } else {
//       // Create mode
//       const newSale = {
//         ...sale,
//         id: `FS${Date.now().toString().slice(-4)}`,
//         status: 'Upcoming' as const,
//         productsCount: 0,
//       };
//       setFlashSales(prev => [newSale, ...prev]);
//     }
//   };

//   const handleEdit = (sale: FlashSale) => {
//     setEditingSale(sale);
//     setIsModalOpen(true);
//   };

//   const handleCreate = () => {
//     setEditingSale(null);
//     setIsModalOpen(true);
//   };

//  return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
//               <Zap className="w-9 h-9 text-orange-500" />
//               Flash Sales
//             </h1>
//             <p className="text-gray-500 dark:text-gray-400 mt-1">Create time-sensitive high-impact promotions</p>
//           </div>
//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={handleCreate}
//             className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl font-medium hover:brightness-110"
//           >
//             <Plus className="w-5 h-5" />
//             Create Flash Sale
//           </motion.button>
//         </div>

//         {/* Rest of your cards remain same, just update Edit button */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {flashSales.map((sale) => (
//             <motion.div key={sale.id} className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all">
//               {/* ... your existing card content ... */}

//               <div className="flex gap-4 mt-10 px-8 pb-8">
//                 <button 
//                   onClick={() => handleEdit(sale)}
//                   className="flex-1 py-4 border border-gray-300 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-2"
//                 >
//                   <Edit2 className="w-4 h-4" /> Edit
//                 </button>
//                 <button className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 flex items-center justify-center gap-2">
//                   <Play className="w-4 h-4" /> Manage Products
//                 </button>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* Modal */}
//       <FlashSaleModal
//         isOpen={isModalOpen}
//         onClose={() => {
//           setIsModalOpen(false);
//           setEditingSale(null);
//         }}
//         onSave={handleSaveSale}
//         initialData={editingSale}
//         mode={editingSale ? 'edit' : 'create'}
//       />
//     </div>
//   );
// };

// export default FlashSalesPage;
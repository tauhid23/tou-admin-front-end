// src/routes/index.tsx
import { createBrowserRouter } from "react-router-dom";

/* Layout */
import DashboardPage from "@/pages/dashboard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProductsPage from "@/pages/allProducts";
import AddProduct from "@/pages/addNewProduct";
import InventoryPage from "@/pages/Inventory";
import ReviewsPage from "@/pages/Reviews";
import AllOrdersPage from "@/pages/allOrders";
import ReturnsAndRefundsPage from "@/pages/returnAndRefund";
import AllCustomersPage from "@/pages/allCustomer";
import GuestCheckoutsPage from "@/pages/guestCheckouts";
// import ShippingPage from "@/pages/ShippingPage";
import ShippingZonesPage from "@/pages/ShippingZonesPage";
import CarriersPage from "@/pages/CarriesPage";
import DeliveryRulesPage from "@/pages/DeliveryRulesPage";
import AllCouponsPage from "@/pages/AllCouponPage";
import DiscountRulesPage from "@/pages/DiscountRulesPage";
// import FlashSalesPage from "@/pages/FlashSalePage";

/* Pages */
// import Products from "@/pages/products/Products";
// import AddProduct from "@/pages/products/AddProduct";
// import Orders from "@/pages/orders/Orders";
// import Customers from "@/pages/customers/Customers";
// import Settings from "@/pages/settings/Settings";
// import NotFound from "@/pages/NotFound";

/**
 * Senior-Level Route Architecture
 * - Nested layouts
 * - Scalable for large admin systems
 * - Clean separation
 * - Ready for lazy loading later
 */

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    // errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },

      /* Products */
      {
        path: "products",
        children: [
          {
            index: true,
            element: <ProductsPage />,
          },
          {
            path: "new",
            element: <AddProduct />,
          },
          {
            path: "inventory",
            element: <InventoryPage />,
          },
          {
            path: "reviews",
            element: <ReviewsPage />,
          },
        ],
      },

      /* Orders */
      {
        path: "orders",
        children: [
          {
            index: true,
            element: <AllOrdersPage />,
          },
          // Returns and Refunds
          {
            path: "/orders/returns",
            element: <ReturnsAndRefundsPage />,
          },
        ],
      },

      /* Customers */
      {
        path: "customers",
        element: <AllCustomersPage />,
      },
      {
        path: "guests",
        element: <GuestCheckoutsPage />,
      },

      /* Shipping Management */
      {
        path: "shipping",
        children: [
          {
            index: true,
            // element: <ShippingPage />,           // Main Shipping Overview
          },
          {
            path: "zones",
            element: <ShippingZonesPage />,
          },
          {
            path: "carriers",
            element: <CarriersPage />,
          },
          {
            path: "rules",
            element: <DeliveryRulesPage />,
          },
        ],
      },

      // Coupons
      {
        path: "marketing",
        children: [
          { index: true, element: <AllCouponsPage /> },
          { path: "coupons", element: <AllCouponsPage /> },
          { path: "discounts", element: <DiscountRulesPage /> },
          // { path: "flash-sales", element: <FlashSalesPage /> },
        ],
      },

      //   /* Settings */
      //   {
      //     path: "settings",
      //     element: <Settings />,
      //   },
    ],
  },

  /* Catch All */
  {
    path: "*",
    // element: <NotFound />,
  },
]);

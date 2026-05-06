// src/routes/index.tsx
import { createBrowserRouter } from "react-router-dom";

/* Layout */
import DashboardPage from "@/pages/dashboard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProductsPage from "@/pages/allProducts";
import AddProduct from "@/pages/addNewProduct";

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
        ],
      },

    //   /* Orders */
    //   {
    //     path: "orders",
    //     element: <Orders />,
    //   },

    //   /* Customers */
    //   {
    //     path: "customers",
    //     element: <Customers />,
    //   },

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
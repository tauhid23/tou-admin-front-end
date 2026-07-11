// src/routes/index.tsx
import { createBrowserRouter } from "react-router-dom";
import {
  BadgePercent,
  BarChart3,
  Bell,
  Blocks,
  BookOpenText,
  Boxes,
  Brush,
  ChartNoAxesCombined,
  CircleDollarSign,
  ClipboardList,
  Code2,
  FileJson,
  FileSearch,
  FileText,
  Gauge,
  Gift,
  Globe2,
  HelpCircle,
  Home,
  Image,
  Mail,
  Map,
  Megaphone,
  MonitorCog,
  Palette,
  ReceiptText,
  Repeat2,
  ScrollText,
  Search,
  Send,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Tags,
  TicketPercent,
  Users,
  Webhook,
} from "lucide-react";

/* Layout */
import DashboardPage from "@/pages/dashboard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProductsPage from "@/pages/allProducts";
import AddProduct from "@/pages/addNewProduct";
import InventoryPage from "@/pages/Inventory";
import CategoriesPage from "@/pages/Categories";
import SubcategoriesPage from "@/pages/Subcategories";
import ReviewsPage from "@/pages/Reviews";
import AllOrdersPage from "@/pages/allOrders";
import ReturnsAndRefundsPage from "@/pages/returnAndRefund";
import AllCustomersPage from "@/pages/allCustomer";
import GuestCheckoutsPage from "@/pages/guestCheckouts";
import ShippingPage from "@/pages/ShippingPage";
import ShippingZonesPage from "@/pages/ShippingZonesPage";
import CarriersPage from "@/pages/CarriesPage";
import DeliveryRulesPage from "@/pages/DeliveryRulesPage";
import AllCouponsPage from "@/pages/AllCouponPage";
import DiscountRulesPage from "@/pages/DiscountRulesPage";
import SignInPage from "@/pages/Auth/SigninPage";
import LogoFavicon from "@/pages/LogoFavicon";
import BannersSlidersTwo from "@/pages/BannerTwo";
import AllPages from "@/pages/AllPages";
import BlogManager from "@/pages/BlogPost";
import AboutUsEditor from "@/pages/AboutUs";
import TaglinesManager from "@/pages/Tagline";
import HeaderMenu from "@/pages/HeaderMenu";
import FooterManager from "@/pages/Footer";
import FlashSalesPage from "@/pages/FlashSalePage";
import ManagementPage from "@/pages/_shared/ManagementPage";

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
          {
            path: "categories",
            element: <CategoriesPage />,
          },
          {
            path: "subcategories",
            element: <SubcategoriesPage />,
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
          {
            path: "pending",
            element: (
              <ManagementPage
                title="Pending Orders"
                description="Review newly placed orders before fulfilment begins."
                icon={ClipboardList}
                actionLabel="Create order"
              />
            ),
          },
          {
            path: "processing",
            element: (
              <ManagementPage
                title="Processing Orders"
                description="Track packed, assigned, and in-progress fulfilment work."
                icon={Boxes}
                actionLabel="Add shipment"
              />
            ),
          },
          {
            path: "completed",
            element: (
              <ManagementPage
                title="Completed Orders"
                description="Audit fulfilled orders, receipts, and delivery confirmations."
                icon={ShieldCheck}
                actionLabel="Export report"
              />
            ),
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
      {
        path: "customers/groups",
        element: (
          <ManagementPage
            title="Customer Groups"
            description="Segment buyers for pricing rules, campaigns, and loyalty experiences."
            icon={Users}
            actionLabel="New group"
          />
        ),
      },

      /* Shipping Management */
      {
        path: "shipping",
        children: [
          {
            index: true,
            element: <ShippingPage />,
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
          {
            path: "coupons/new",
            element: (
              <ManagementPage
                title="Create Coupon"
                description="Build a coupon with usage limits, eligibility rules, and scheduled publishing."
                icon={TicketPercent}
                actionLabel="Save coupon"
              />
            ),
          },
          { path: "discounts", element: <DiscountRulesPage /> },
          { path: "flash-sales", element: <FlashSalesPage /> },
          {
            path: "promotions",
            element: (
              <ManagementPage
                title="Campaigns"
                description="Plan seasonal storefront campaigns and promotional placements."
                icon={Megaphone}
                actionLabel="New campaign"
              />
            ),
          },
          {
            path: "loyalty",
            element: (
              <ManagementPage
                title="Loyalty Program"
                description="Configure points, member tiers, and repeat-purchase incentives."
                icon={Gift}
                actionLabel="New reward"
              />
            ),
          },
          {
            path: "referral",
            element: (
              <ManagementPage
                title="Referral Program"
                description="Manage referral links, reward rules, and invite performance."
                icon={Send}
                actionLabel="Create rule"
              />
            ),
          },
          {
            path: "abandoned-cart",
            element: (
              <ManagementPage
                title="Abandoned Cart"
                description="Recover carts with timed reminders and discount triggers."
                icon={ShoppingBag}
                actionLabel="New flow"
              />
            ),
          },
          {
            path: "email/newsletters",
            element: (
              <ManagementPage
                title="Newsletters"
                description="Draft and schedule broadcast email campaigns."
                icon={Mail}
                actionLabel="New newsletter"
              />
            ),
          },
          {
            path: "email/automations",
            element: (
              <ManagementPage
                title="Email Automations"
                description="Create lifecycle flows for welcome, winback, and post-purchase journeys."
                icon={Repeat2}
                actionLabel="New automation"
              />
            ),
          },
          {
            path: "email/subscribers",
            element: (
              <ManagementPage
                title="Subscribers"
                description="Review subscriber segments, consent status, and list growth."
                icon={Users}
                actionLabel="Import list"
              />
            ),
          },
          {
            path: "email/templates",
            element: (
              <ManagementPage
                title="Email Templates"
                description="Design reusable transactional and campaign email layouts."
                icon={BookOpenText}
                actionLabel="New template"
              />
            ),
          },
        ],
      },

      // Storefront Appearance
      {
        path: "appearance",
        children: [
          {
            index: true,
            element: (
              <ManagementPage
                title="Appearance"
                description="Control the storefront visual system, home assets, and brand identity."
                icon={Palette}
                actionLabel="Customize theme"
              />
            ),
          },
          { path: "banners-sliders", element: <BannersSlidersTwo /> },
          { path: "logo-favicon", element: <LogoFavicon /> },
        ],
      },

      // Content and Pages
      {
        path: "storefront",
        children: [
          {
            index: true,
            element: <AllPages />,
          },
          { path: "/storefront/pages", element: <AllPages /> },
          { path: "/storefront/blog", element: <BlogManager /> },
          { path: "/storefront/about-us", element: <AboutUsEditor /> },
          { path: "/storefront/tagline", element: <TaglinesManager /> },
          { path: "/storefront/header", element: <HeaderMenu /> },
          { path: "/storefront/footer", element: <FooterManager /> },
          {
            path: "/storefront/themes",
            element: (
              <ManagementPage
                title="Themes"
                description="Preview, customize, and publish storefront theme versions."
                icon={MonitorCog}
                actionLabel="New theme"
              />
            ),
          },
          {
            path: "/storefront/branding",
            element: (
              <ManagementPage
                title="Colour & Typography"
                description="Tune brand colors, type styles, and storefront interface tokens."
                icon={Brush}
                actionLabel="Save styles"
              />
            ),
          },
          {
            path: "/storefront/homepage",
            element: (
              <ManagementPage
                title="Homepage Sections"
                description="Arrange hero modules, collections, editorial blocks, and campaign sections."
                icon={Home}
                actionLabel="Add section"
              />
            ),
          },
          {
            path: "/storefront/media",
            element: (
              <ManagementPage
                title="Media Library"
                description="Manage images, videos, documents, and reusable storefront assets."
                icon={Image}
                actionLabel="Upload media"
              />
            ),
          },
        ],
      },

      // Links
      // {
      //   path: "storefront/navigation",
      //   children: [
      //     {
      //       index: true,
      //     },
      //     { path: "/storefront/navigation/header", element: <HeaderMenu /> },
      //     { path: "/storefront/navigation/header", element: <HeaderMenu /> },
      //   ],
      // },

      {
        path: "analytics",
        children: [
          {
            path: "reports",
            element: (
              <ManagementPage
                title="Reports"
                description="Monitor sales, traffic, conversion, and customer performance in one place."
                icon={BarChart3}
                actionLabel="Create report"
              />
            ),
          },
          {
            path: "sales",
            element: (
              <ManagementPage
                title="Sales Report"
                description="Analyze revenue, average order value, refunds, and purchase trends."
                icon={ChartNoAxesCombined}
                actionLabel="Export sales"
              />
            ),
          },
          {
            path: "traffic",
            element: (
              <ManagementPage
                title="Traffic"
                description="Review storefront sessions, channel sources, and campaign attribution."
                icon={Gauge}
                actionLabel="Export traffic"
              />
            ),
          },
          {
            path: "conversion",
            element: (
              <ManagementPage
                title="Conversion Funnel"
                description="Find drop-offs from visit to cart, checkout, and purchase."
                icon={FileSearch}
                actionLabel="Save funnel"
              />
            ),
          },
          {
            path: "products",
            element: (
              <ManagementPage
                title="Product Performance"
                description="Compare product views, add-to-cart rate, revenue, and margin."
                icon={Tags}
                actionLabel="Export products"
              />
            ),
          },
          {
            path: "customers",
            element: (
              <ManagementPage
                title="Customer Insights"
                description="Understand retention, cohorts, location, and lifetime value."
                icon={Users}
                actionLabel="Create segment"
              />
            ),
          },
        ],
      },
      {
        path: "seo",
        children: [
          {
            index: true,
            element: (
              <ManagementPage
                title="SEO"
                description="Improve search appearance, indexing, redirects, and structured data."
                icon={Search}
                actionLabel="Run audit"
              />
            ),
          },
          {
            path: "meta",
            element: (
              <ManagementPage
                title="Meta Tags"
                description="Edit titles, descriptions, and social preview metadata."
                icon={FileText}
                actionLabel="New meta rule"
              />
            ),
          },
          {
            path: "sitemap",
            element: (
              <ManagementPage
                title="Sitemap"
                description="Control indexed URLs, sitemap status, and regeneration history."
                icon={Map}
                actionLabel="Regenerate"
              />
            ),
          },
          {
            path: "redirects",
            element: (
              <ManagementPage
                title="Redirects"
                description="Manage 301 and 302 redirects for moved storefront content."
                icon={Globe2}
                actionLabel="New redirect"
              />
            ),
          },
          {
            path: "schema",
            element: (
              <ManagementPage
                title="Structured Data"
                description="Configure product, organization, breadcrumb, and article schema."
                icon={FileJson}
                actionLabel="Add schema"
              />
            ),
          },
        ],
      },
      {
        path: "reviews",
        element: <ReviewsPage />,
      },
      {
        path: "integrations",
        children: [
          {
            path: "tracking",
            element: (
              <ManagementPage
                title="Pixels & Tracking"
                description="Connect analytics pixels and campaign tracking destinations."
                icon={Code2}
                actionLabel="Connect pixel"
              />
            ),
          },
          {
            path: "meta-pixel",
            element: (
              <ManagementPage
                title="Meta Pixel"
                description="Configure events, conversion API settings, and diagnostics."
                icon={BadgePercent}
                actionLabel="Connect Meta"
              />
            ),
          },
          {
            path: "google-analytics",
            element: (
              <ManagementPage
                title="Google Analytics"
                description="Manage GA measurement IDs, events, and ecommerce reporting."
                icon={BarChart3}
                actionLabel="Connect GA"
              />
            ),
          },
          {
            path: "gtm",
            element: (
              <ManagementPage
                title="Google Tag Manager"
                description="Install container IDs and review tag health."
                icon={Blocks}
                actionLabel="Add container"
              />
            ),
          },
          {
            path: "tiktok-pixel",
            element: (
              <ManagementPage
                title="TikTok Pixel"
                description="Connect TikTok events and campaign attribution."
                icon={BadgePercent}
                actionLabel="Connect TikTok"
              />
            ),
          },
          {
            path: "snapchat-pixel",
            element: (
              <ManagementPage
                title="Snapchat Pixel"
                description="Configure Snap Pixel tracking and conversion events."
                icon={BadgePercent}
                actionLabel="Connect Snap"
              />
            ),
          },
          {
            path: "payments",
            element: (
              <ManagementPage
                title="Payment Gateways"
                description="Manage payment providers, capture settings, and checkout availability."
                icon={CircleDollarSign}
                actionLabel="Add gateway"
              />
            ),
          },
          {
            path: "currencies",
            element: (
              <ManagementPage
                title="Currencies"
                description="Configure supported currencies, exchange display, and rounding."
                icon={Globe2}
                actionLabel="Add currency"
              />
            ),
          },
          {
            path: "invoices",
            element: (
              <ManagementPage
                title="Invoices"
                description="Customize invoice templates, tax display, and numbering."
                icon={ReceiptText}
                actionLabel="New template"
              />
            ),
          },
          {
            path: "apps",
            element: (
              <ManagementPage
                title="App Store"
                description="Connect apps that extend storefront, fulfilment, and marketing workflows."
                icon={Blocks}
                actionLabel="Browse apps"
              />
            ),
          },
          {
            path: "webhooks",
            element: (
              <ManagementPage
                title="Webhooks"
                description="Send order, customer, product, and inventory events to external systems."
                icon={Webhook}
                actionLabel="New webhook"
              />
            ),
          },
          {
            path: "api-keys",
            element: (
              <ManagementPage
                title="API Keys"
                description="Create and rotate secure credentials for custom integrations."
                icon={Code2}
                actionLabel="Generate key"
              />
            ),
          },
        ],
      },
      {
        path: "settings",
        children: [
          {
            index: true,
            element: (
              <ManagementPage
                title="Settings"
                description="Manage store-wide preferences, account access, and operational defaults."
                icon={Settings}
                actionLabel="Save settings"
              />
            ),
          },
          {
            path: "general",
            element: (
              <ManagementPage
                title="General Settings"
                description="Set store name, timezone, locale, and business preferences."
                icon={Settings}
                actionLabel="Save general"
              />
            ),
          },
          {
            path: "store",
            element: (
              <ManagementPage
                title="Store Details"
                description="Maintain business profile, contact details, and public store metadata."
                icon={ScrollText}
                actionLabel="Save details"
              />
            ),
          },
          {
            path: "tax",
            element: (
              <ManagementPage
                title="Tax Settings"
                description="Configure tax regions, inclusive pricing, and invoice tax display."
                icon={ReceiptText}
                actionLabel="New tax rule"
              />
            ),
          },
          {
            path: "notifications",
            element: (
              <ManagementPage
                title="Notifications"
                description="Control admin alerts, customer emails, and operational notifications."
                icon={Bell}
                actionLabel="New notification"
              />
            ),
          },
          {
            path: "team",
            element: (
              <ManagementPage
                title="Team & Roles"
                description="Invite teammates and manage role-based admin permissions."
                icon={ShieldCheck}
                actionLabel="Invite member"
              />
            ),
          },
          {
            path: "billing",
            element: (
              <ManagementPage
                title="Billing & Plan"
                description="Review subscription status, invoices, and plan usage."
                icon={CircleDollarSign}
                actionLabel="Update plan"
              />
            ),
          },
        ],
      },
      {
        path: "help",
        element: (
          <ManagementPage
            title="Help & Support"
            description="Find setup guidance, support tickets, and operational documentation."
            icon={HelpCircle}
            actionLabel="New ticket"
          />
        ),
      },
      {
        path: "/login",
        element: <SignInPage />,
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
    element: (
      <ManagementPage
        title="Page not found"
        description="This admin page is not available yet. Use the sidebar to return to a configured workspace."
        icon={FileSearch}
        actionLabel="Go back"
      />
    ),
  },
]);

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, authApi, uploadImages } from "./client";

export type ContactPageContent = {
  eyebrow: string;
  title: string;
  description: string;
  address: string;
  email: string;
  phone: string;
  businessHours: string;
  responseTime: string;
  mapEmbedUrl: string;
  mapLink: string;
  mapEnabled: boolean;
};

export type AboutImage = {
  url: string;
  publicId: string;
  alt: string;
};

export type AboutPageContent = {
  eyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: AboutImage;
  stats: { value: string; label: string }[];
  storyEyebrow: string;
  storyTitle: string;
  story: string;
  storyImage: AboutImage;
  missionTitle: string;
  mission: string;
  visionTitle: string;
  vision: string;
  valuesEyebrow: string;
  valuesTitle: string;
  values: { title: string; description: string }[];
  ctaTitle: string;
  ctaDescription: string;
  ctaLabel: string;
  ctaUrl: string;
};

export type ContactMessageStatus = "new" | "read" | "resolved";

export type ContactMessage = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  sourcePath: string;
  createdAt: string;
};

export type ContactMessagesResponse = {
  messages: ContactMessage[];
  counts: Record<"all" | ContactMessageStatus, number>;
};

export type StorefrontContentResponse = {
  contactPage: ContactPageContent & { _id?: string; updatedAt?: string };
  aboutPage?: AboutPageContent & { _id?: string; updatedAt?: string };
  banners?: AdminHeroBanner[];
  heroSettings?: HeroSettings;
  homepageSections?: AdminHomepageSection[];
  navigation?: unknown;
  footer?: unknown;
};

export type StorefrontAsset = { url: string; publicId: string; alt: string };
export type AdminHeroBanner = {
  _id?: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  ctaLabel: string;
  ctaUrl: string;
  desktopImage: StorefrontAsset;
  mobileImage: StorefrontAsset;
  searchPlaceholder: string;
  popularTags: string[];
  textPosition: "left" | "center" | "right";
  focalPoint: "top" | "center" | "bottom";
  overlayOpacity: number;
  audience: string;
  startDate?: string;
  endDate?: string;
  status: "published" | "scheduled" | "draft" | "paused";
  sortOrder: number;
};

export type HeroSettings = {
  autoplay: boolean;
  duration: number;
  transition: "slide" | "fade";
  showDots: boolean;
  pauseOnHover: boolean;
};

export type AdminHomepageSection = {
  _id?: string;
  type: "hero" | "category_carousel" | "big_category_grid" | "info_strip" | "feature_grid" | "featured_products" | "reviews";
  title: string;
  eyebrow: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  status: "published" | "draft" | "hidden";
  visibleDesktop: boolean;
  visibleMobile: boolean;
  sortOrder: number;
  items: Array<{
    title: string;
    subtitle: string;
    image?: StorefrontAsset;
    url?: string;
    meta?: string;
    enabled: boolean;
  }>;
};

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type AdminOrder = {
  _id: string;
  orderNumber: string;
  customer: { name: string; email?: string; phone: string };
  address: { line1: string; line2?: string; city?: string; state?: string; postalCode?: string; country?: string };
  items: Array<{
    _id?: string;
    productId: string;
    title: string;
    sku?: string;
    image?: string;
    quantity: number;
    unitPrice: number;
    originalUnitPrice?: number;
    promotionName?: string;
    selectedColor?: string;
    selectedSize?: string;
  }>;
  subtotal: number;
  shipping: number;
  discount: number;
  flashDiscount?: number;
  automaticDiscount?: number;
  automaticPromotionName?: string;
  total: number;
  couponCode?: string;
  currency: string;
  shippingZone: string;
  paymentMethod: "cod";
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  fulfilment?: { courierName?: string; trackingNumber?: string; estimatedDeliveryAt?: string };
  adminNote?: string;
  cancellationReason?: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  statusHistory?: Array<{
    _id?: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    note?: string;
    changedByEmail?: string;
    changedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

export type AdminOrdersResponse = {
  items: AdminOrder[];
  pagination: { page: number; limit: number; total: number; pages: number };
  summary: Record<OrderStatus, number> & { totalOrders: number; revenue: number };
};

export type CustomerSegment = "all" | "repeat" | "high-value" | "new" | "inactive" | "blocked";

export type AdminCustomer = {
  key: string;
  name: string;
  email?: string;
  phone: string;
  latestAddress?: AdminOrder["address"];
  currency: string;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  firstOrderAt: string;
  lastOrderAt: string;
  status: "active" | "blocked";
  tags: string[];
  internalNote: string;
};

export type AdminCustomerDetails = AdminCustomer & { orders: AdminOrder[] };

export type AdminCustomersResponse = {
  items: AdminCustomer[];
  pagination: { page: number; limit: number; total: number; pages: number };
  summary: {
    totalCustomers: number;
    repeatCustomers: number;
    highValueCustomers: number;
    activeCustomers: number;
    inactiveCustomers: number;
    newThisMonth: number;
    blockedCustomers: number;
    customerRevenue: number;
  };
};

export type ShippingZone = {
  _id?: string;
  code: string;
  name: string;
  description: string;
  rate: number;
  minDeliveryDays: number;
  maxDeliveryDays: number;
  active: boolean;
  sortOrder: number;
};

export type ShippingCarrier = {
  _id?: string;
  name: string;
  code: string;
  type: "courier" | "express" | "self";
  contactPhone: string;
  trackingUrl: string;
  serviceAreas: string;
  active: boolean;
};

export type DeliveryRules = {
  freeShippingEnabled: boolean;
  freeShippingThreshold: number;
  minimumOrder: number;
  cutoffTime: string;
  processingDays: number;
  cashOnDeliveryEnabled: boolean;
};

export type ShippingSettings = {
  _id: string;
  currency: string;
  zones: ShippingZone[];
  carriers: ShippingCarrier[];
  rules: DeliveryRules;
  updatedAt?: string;
  updatedByEmail?: string;
};

export type CouponStatus = "active" | "scheduled" | "expired" | "exhausted" | "disabled";
export type AdminCoupon = {
  _id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  value: number;
  minimumOrder: number;
  maximumDiscount: number;
  usageLimit: number;
  perCustomerLimit: number;
  usedCount: number;
  startsAt: string;
  endsAt: string;
  active: boolean;
  firstOrderOnly: boolean;
  computedStatus: CouponStatus;
  createdAt: string;
  updatedAt: string;
};

export type AdminCouponsResponse = {
  items: AdminCoupon[];
  pagination: { page: number; limit: number; total: number; pages: number };
  summary: Record<CouponStatus, number> & { totalCoupons: number; totalUses: number };
};

export type PromotionKind = "automatic" | "flash_sale";
export type PromotionStatus = "active" | "scheduled" | "ended" | "exhausted" | "disabled";
export type AdminPromotion = {
  _id: string;
  kind: PromotionKind;
  name: string;
  description: string;
  discountType: "percentage" | "fixed";
  value: number;
  maximumDiscount: number;
  minimumSubtotal: number;
  minimumQuantity: number;
  scope: "all" | "categories" | "products";
  categorySlugs: string[];
  productIds: string[];
  priority: number;
  combinableWithCoupons: boolean;
  active: boolean;
  startsAt: string;
  endsAt: string;
  usageLimit: number;
  usedCount: number;
  computedStatus: PromotionStatus;
  productsCount: number;
  categoriesCount: number;
  createdAt: string;
  updatedAt: string;
};

export type PromotionsResponse = {
  items: AdminPromotion[];
  summary: Record<PromotionStatus, number> & { total: number; totalUses: number };
};

export function useLogin() {
  return useMutation({
    mutationFn: authApi.login,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => queryClient.clear(),
  });
}

export function useMe(enabled = true) {
  return useQuery({
    queryKey: ["admin-me"],
    queryFn: authApi.me,
    enabled,
    retry: false,
  });
}

export function useAdminProducts(params = "") {
  return useQuery({
    queryKey: ["admin-products", params],
    queryFn: () => api.get(`/catalog/products/admin?${params || "status=all"}`),
  });
}

export function useAdminOrders(params = "") {
  return useQuery({
    queryKey: ["admin-orders", params],
    queryFn: () => api.get<AdminOrdersResponse>(`/orders?${params}`),
    placeholderData: (previous) => previous,
  });
}

export function useUpdateAdminOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<AdminOrder> & { statusNote?: string } }) =>
      api.patch<AdminOrder>(`/orders/${id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
  });
}

export function useAdminCustomers(params = "") {
  return useQuery({
    queryKey: ["admin-customers", params],
    queryFn: () => api.get<AdminCustomersResponse>(`/customers?${params}`),
    placeholderData: (previous) => previous,
  });
}

export function useAdminCustomer(key?: string) {
  return useQuery({
    queryKey: ["admin-customer", key],
    queryFn: () => api.get<AdminCustomerDetails>(`/customers/${encodeURIComponent(key!)}`),
    enabled: Boolean(key),
  });
}

export function useUpdateAdminCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, payload }: { key: string; payload: Pick<AdminCustomer, "status" | "tags" | "internalNote"> }) =>
      api.patch(`/customers/${encodeURIComponent(key)}`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-customer", variables.key] });
    },
  });
}

export function useShippingSettings() {
  return useQuery({ queryKey: ["shipping-settings"], queryFn: () => api.get<ShippingSettings>("/shipping/admin") });
}

function useSaveShippingSection<T>(section: "zones" | "carriers" | "rules") {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: T) => api.put<ShippingSettings>(`/shipping/admin/${section}`, payload),
    onSuccess: (settings) => queryClient.setQueryData(["shipping-settings"], settings),
  });
}

export function useSaveShippingZones() { return useSaveShippingSection<{ zones: ShippingZone[] }>("zones"); }
export function useSaveShippingCarriers() { return useSaveShippingSection<{ carriers: ShippingCarrier[] }>("carriers"); }
export function useSaveDeliveryRules() { return useSaveShippingSection<DeliveryRules>("rules"); }

export function useAdminCoupons(params = "") {
  return useQuery({ queryKey: ["admin-coupons", params], queryFn: () => api.get<AdminCouponsResponse>(`/coupons?${params}`), placeholderData: (previous) => previous });
}

export function useSaveCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id?: string; payload: Omit<AdminCoupon, "_id" | "computedStatus" | "usedCount" | "createdAt" | "updatedAt"> }) => id ? api.put<AdminCoupon>(`/coupons/${id}`, payload) : api.post<AdminCoupon>("/coupons", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-coupons"] }),
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (id: string) => api.delete<{ archived: boolean }>(`/coupons/${id}`), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-coupons"] }) });
}

export function useAdminPromotions(kind: PromotionKind) {
  return useQuery({ queryKey: ["admin-promotions", kind], queryFn: () => api.get<PromotionsResponse>(`/promotions?kind=${kind}`) });
}

export function useSavePromotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id?: string; payload: Omit<AdminPromotion, "_id" | "computedStatus" | "productsCount" | "categoriesCount" | "usedCount" | "createdAt" | "updatedAt"> }) => id ? api.put<AdminPromotion>(`/promotions/${id}`, payload) : api.post<AdminPromotion>("/promotions", payload),
    onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ["admin-promotions", variables.payload.kind] }),
  });
}

export function useDeletePromotion() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (variables: { id: string; kind: PromotionKind }) => api.delete<{ archived: boolean }>(`/promotions/${variables.id}`), onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ["admin-promotions", variables.kind] }) });
}

export function useAdminProduct(id?: string) {
  return useQuery({
    queryKey: ["admin-product", id],
    queryFn: () => api.get(`/catalog/products/id/${id}`),
    enabled: Boolean(id),
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => api.get("/catalog/categories?status=all"),
  });
}

export function useStorefrontContent() {
  return useQuery({
    queryKey: ["admin-storefront-content"],
    queryFn: () => api.get<StorefrontContentResponse>("/storefront/admin/content"),
  });
}

export function useSaveBanners() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { banners: AdminHeroBanner[] }) =>
      api.put<AdminHeroBanner[]>("/storefront/admin/banners", payload),
    onSuccess: (banners) => {
      queryClient.setQueryData<StorefrontContentResponse>(["admin-storefront-content"], (current) =>
        current ? { ...current, banners } : current
      );
    },
  });
}

export function useSaveHeroSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: HeroSettings) =>
      api.put<HeroSettings>("/storefront/admin/hero-settings", payload),
    onSuccess: (heroSettings) => {
      queryClient.setQueryData<StorefrontContentResponse>(["admin-storefront-content"], (current) =>
        current ? { ...current, heroSettings } : current
      );
    },
  });
}

export function useSaveHomepageSections() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { sections: AdminHomepageSection[] }) =>
      api.put<AdminHomepageSection[]>("/storefront/admin/homepage-sections", payload),
    onSuccess: (homepageSections) => {
      queryClient.setQueryData<StorefrontContentResponse>(["admin-storefront-content"], (current) =>
        current ? { ...current, homepageSections } : current
      );
    },
  });
}

export function useAdminContactPage() {
  return useQuery({
    queryKey: ["admin-contact-page"],
    queryFn: () => api.get<ContactPageContent & { _id?: string; updatedAt?: string }>("/storefront/admin/contact"),
  });
}

export function useAdminAboutPage() {
  return useQuery({
    queryKey: ["admin-about-page"],
    queryFn: () => api.get<AboutPageContent & { _id?: string; updatedAt?: string }>("/storefront/admin/about"),
  });
}

export function useContactMessages(status = "all") {
  return useQuery({
    queryKey: ["contact-messages", status],
    queryFn: () => api.get<ContactMessagesResponse>(`/storefront/admin/contact/messages?status=${status}`),
  });
}

export function useSaveContactPage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ContactPageContent) =>
      api.put<ContactPageContent>("/storefront/admin/contact", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contact-page"] });
      queryClient.invalidateQueries({ queryKey: ["admin-storefront-content"] });
    },
  });
}

export function useSaveAboutPage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AboutPageContent) =>
      api.put<AboutPageContent>("/storefront/admin/about", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-about-page"] });
      queryClient.invalidateQueries({ queryKey: ["admin-storefront-content"] });
    },
  });
}

export function useUpdateContactMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactMessageStatus }) =>
      api.patch<ContactMessage>(`/storefront/admin/contact/messages/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contact-messages"] }),
  });
}

export function useSaveProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id?: string; payload: unknown }) =>
      id ? api.put(`/catalog/products/${id}`, payload) : api.post("/catalog/products", payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      if (variables.id) queryClient.invalidateQueries({ queryKey: ["admin-product", variables.id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/catalog/products/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
  });
}

export function useSaveCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id?: string; payload: unknown }) =>
      id ? api.put(`/catalog/categories/${id}`, payload) : api.post("/catalog/categories", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-categories"] }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/catalog/categories/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-categories"] }),
  });
}

export function useSaveSubcategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      categoryId,
      subcategorySlug,
      payload,
    }: {
      categoryId: string;
      subcategorySlug?: string;
      payload: unknown;
    }) =>
      subcategorySlug
        ? api.put(`/catalog/categories/${categoryId}/subcategories/${subcategorySlug}`, payload)
        : api.post(`/catalog/categories/${categoryId}/subcategories`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-categories"] }),
  });
}

export function useDeleteSubcategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ categoryId, subcategorySlug }: { categoryId: string; subcategorySlug: string }) =>
      api.delete(`/catalog/categories/${categoryId}/subcategories/${subcategorySlug}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-categories"] }),
  });
}

export function useUploadImages() {
  return useMutation({
    mutationFn: ({ files, folder }: { files: File[]; folder?: string }) => uploadImages(files, folder),
  });
}

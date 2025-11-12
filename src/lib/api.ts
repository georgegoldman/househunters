/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api.ts
import { http, adminToken } from "./http";
import type { Property } from "../types/property";

/** ---------- generic helpers ---------- */
const get = async <T>(url: string, params?: any) =>
  (await http.get<T>(url, { params })).data;

const post = async <T, B = any>(url: string, body?: B) =>
  (await http.post<T>(url, body)).data;

const put = async <T, B = any>(url: string, body?: B) =>
  (await http.put<T>(url, body)).data;

const patch = async <T, B = any>(url: string, body?: B) =>
  (await http.patch<T>(url, body)).data;

const del = async <T>(url: string) => (await http.delete<T>(url)).data;

// axios supports body in DELETE via { data }
const delBody = async <T, B = any>(url: string, body?: B) =>
  (await http.delete<T>(url, { data: body })).data;

/** ---------- Property Request Types ---------- */
export type RequestStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type Title = "MR" | "MRS" | "MS" | "DR";

export interface PropertyRequest {
  id: string;
  propertyId: number;
  userId?: string;
  title?: Title;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  preferredDate: string;
  preferredTime: string;
  additionalInfo?: string;
  specialRequirements?: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  property?: {
    id: number;
    address: string;
    city: string;
    price: number;
    main_image: string;
  };
  user?: {
    id: string;
    email: string;
  };
}

export interface CreatePropertyRequestPayload {
  title?: Title;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  preferredDate: string;
  preferredTime: string;
  additionalInfo?: string;
  specialRequirements?: string;
}

/** ---------- Property Review Types ---------- */
export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED" | "RESOLVED";

export interface PropertyReview {
  id: string;
  propertyId: number;
  userId?: string;
  reviewerName: string;
  reviewerEmail: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  adminReply?: string;
  createdAt: string;
  updatedAt: string;
  property?: {
    id: number;
    address: string;
    city: string;
    price: number;
    main_image: string;
  };
  user?: {
    id: string;
    email: string;
  };
}

export interface CreatePropertyReviewPayload {
  reviewerName: string;
  reviewerEmail: string;
  rating: number;
  comment: string;
  userId?: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  statusCounts: Record<ReviewStatus, number>;
}

/** ---------- Analytics Types ---------- */
export interface SalesData {
  period: string;
  primary: number;
  secondary: number;
  month: string;
}

export interface LocationPerformance {
  city: string;
  properties: number;
  inquiries: number;
  sales: number;
  rentals: number;
}

export interface ActivityData {
  id: number;
  title: string;
  inquiries: number;
  date: string;
  status: "Available" | "Rented" | "Sold";
}

export interface ResponseMetrics {
  avgResponseTime: number;
  fastestResponse: number;
  slowestResponse: number;
}

export interface AnalyticsOverview {
  totalProperties: number;
  soldProperties: number;
  rentedProperties: number;
  availableProperties: number;
}

/** ---------- Filter Types ---------- */
export interface AnalyticsFilters {
  propertyType?: string;
  location?: string;
  dateRange?: string;
}

export interface ReviewFilters extends AnalyticsFilters {
  status?: ReviewStatus;
  propertyId?: number;
  reviewerEmail?: string;
}

/** ---------- Image Upload Types ---------- */
export interface UploadedImage {
  key: string;
  url: string;
  size?: number;
  lastModified?: string;
}

export interface SingleImageUploadResponse {
  success: boolean;
  url: string;
  key: string;
}

export interface MultipleImageUploadResponse {
  success: boolean;
  count: number;
  files: Array<{
    url: string;
    key: string;
  }>;
}

export interface ImagesListResponse {
  images: UploadedImage[];
}

/** ---------- response envelopes ---------- */
export type PagedProperties = {
  data: Property[];
  page: number;
};

export type SingleProperty = {
  data: Property;
};

export type PropertyRequestsResponse = {
  requests: PropertyRequest[];
  error: boolean;
};

export type PropertyRequestResponse = {
  request: PropertyRequest;
  error: boolean;
};

export type CreateRequestResponse = {
  message: string;
  error: boolean;
  request: PropertyRequest;
};

export type UpdateRequestResponse = {
  message: string;
  error: boolean;
  request: PropertyRequest;
};

export type PropertyReviewsResponse = {
  reviews: PropertyReview[];
  error: boolean;
};

export type PropertyReviewResponse = {
  review: PropertyReview;
  error: boolean;
};

export type CreateReviewResponse = {
  message: string;
  error: boolean;
  review: PropertyReview;
};

export type UpdateReviewResponse = {
  message: string;
  error: boolean;
  review: PropertyReview;
};

export type ReviewStatsResponse = {
  stats: ReviewStats;
  error: boolean;
};

export type AnalyticsResponse<T> = {
  data: T;
  error: boolean;
};

export type ForSaleFilter = boolean | "both";

/** ---------- API ---------- */
export const api = {
  properties: {
    list: (params: { all?: boolean; forsale?: ForSaleFilter; page?: number }) =>
      get<PagedProperties>("/property", params),

    listAdminAll: (page = 0) =>
      get<PagedProperties>("/property", { all: true, forsale: "both", page }),

    listAdminSale: (page = 0) =>
      get<PagedProperties>("/property", { all: true, forsale: true, page }),

    listAdminRent: (page = 0) =>
      get<PagedProperties>("/property", { all: true, forsale: false, page }),

    getById: (params: { id: number }) =>
      get<SingleProperty>("/property", params),
  },

  propertyRequests: {
    create: (propertyId: number, payload: CreatePropertyRequestPayload) =>
      post<CreateRequestResponse>(
        `/property/${propertyId}/request`,
        payload
      ).then((r) => r.request),
  },

  propertyReviews: {
    create: (propertyId: number, payload: CreatePropertyReviewPayload) =>
      post<CreateReviewResponse>(
        `/property/${propertyId}/review`,
        payload
      ).then((r) => r.review),

    getByProperty: (propertyId: number) =>
      get<PropertyReviewsResponse>(`/property/${propertyId}/reviews`).then(
        (r) => r.reviews
      ),
  },

  admin: {
    login: async (payload: { username: string; password: string }) => {
      const data = await post<{ accessToken: string }>(
        "/admin/auth/login",
        payload
      );
      adminToken.set(data.accessToken);
      return data;
    },

    me: () =>
      get<{ ok: boolean; user: { sub: string; role: "ADMIN"; email: string } }>(
        "/auth/me"
      ),

    logout: async () => {
      try {
        await post<void>("/admin/auth/logout", {});
      } finally {
        adminToken.set(null);
      }
    },

    createProperty: (p: Omit<Property, "id">) =>
      post<{ message: string; error: boolean; property: Property }>(
        "/property",
        p
      ).then((r) => r.property),

    updateProperty: (p: Partial<Property> & { id: number }) =>
      put<{ message: string; error: boolean; property: Property }>(
        "/property",
        p
      ).then((r) => r.property),

    hideProperty: (id: number | string) =>
      patch<{ message: string; error: boolean }>(`/property/${id}/hide`).then(
        (r) => r.message
      ),

    showProperty: (id: number | string) =>
      patch<{ message: string; error: boolean }>(`/property/${id}/show`).then(
        (r) => r.message
      ),

    deleteProperty: (id: number | string) =>
      del<{ message: string; error: boolean }>(`/property/${id}`).then(
        (r) => r.message
      ),

    addImages: (propertyId: number | string, images: string[]) =>
      post<{ message: string; error: boolean }>("/property/images", {
        propertyId: String(propertyId),
        images,
      }).then((r) => r.message),

    removeImage: (id: number | string, imageUrl: string) =>
      delBody<{ message: string; error: boolean }>(`/property/${id}/image`, {
        imageUrl,
      }).then((r) => r.message),

    // Image Upload Management
    images: {
      // Upload single image
      uploadSingle: async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        return (await http.post<SingleImageUploadResponse>('/api/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })).data;
      },

      // Upload multiple images
      uploadMultiple: async (files: File[]) => {
        const formData = new FormData();
        files.forEach(file => {
          formData.append('images', file);
        });

        return (await http.post<MultipleImageUploadResponse>('/api/upload-images', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })).data;
      },

      // List all uploaded images
      list: () => get<ImagesListResponse>('/api/images').then(r => r.images),

      // Delete image by key
      delete: (key: string) =>
        del<{ success: boolean; message: string }>(`/api/images/${key}`)
          .then(r => r.message),
    },

    propertyRequests: {
      list: (
        filters?: {
          status?: RequestStatus;
          propertyId?: number;
          email?: string;
        } & AnalyticsFilters
      ) =>
        get<PropertyRequestsResponse>("/property/requests", filters).then(
          (r) => r.requests
        ),

      getByProperty: (propertyId: number) =>
        get<PropertyRequestsResponse>(`/property/${propertyId}/requests`).then(
          (r) => r.requests
        ),

      getById: (id: string) =>
        get<PropertyRequestResponse>(`/property/request/${id}`).then(
          (r) => r.request
        ),

      updateStatus: (id: string, status: RequestStatus) =>
        patch<UpdateRequestResponse>(`/property/request/${id}/status`, {
          status,
        }).then((r) => r.request),

      delete: (id: string) =>
        del<{ message: string; error: boolean }>(
          `/property/request/${id}`
        ).then((r) => r.message),
    },

    propertyReviews: {
      list: (filters?: ReviewFilters) =>
        get<PropertyReviewsResponse>("/property/reviews", filters).then(
          (r) => r.reviews
        ),

      getById: (id: string) =>
        get<PropertyReviewResponse>(`/property/review/${id}`).then(
          (r) => r.review
        ),

      updateStatus: (id: string, status: ReviewStatus) =>
        patch<UpdateReviewResponse>(`/property/review/${id}/status`, {
          status,
        }).then((r) => r.review),

      addReply: (id: string, reply: string) =>
        patch<UpdateReviewResponse>(`/property/review/${id}/reply`, {
          reply,
        }).then((r) => r.review),

      delete: (id: string) =>
        del<{ message: string; error: boolean }>(`/property/review/${id}`).then(
          (r) => r.message
        ),

      getStats: (filters?: AnalyticsFilters & { propertyId?: number }) =>
        get<ReviewStatsResponse>("/property/reviews/stats", filters).then(
          (r) => r.stats
        ),
    },

    analytics: {
      overview: (filters?: AnalyticsFilters) =>
        get<AnalyticsResponse<AnalyticsOverview>>(
          "/api/analytics/overview",
          filters
        ).then((r) => r.data),

      salesPerformance: (
        timeRange: "daily" | "weekly" | "monthly" | "yearly" = "monthly",
        filters?: AnalyticsFilters
      ) =>
        get<AnalyticsResponse<SalesData[]>>(
          "/api/analytics/sales-performance",
          {
            timeRange,
            ...filters,
          }
        ).then((r) => r.data),

      locationPerformance: (filters?: AnalyticsFilters) =>
        get<AnalyticsResponse<LocationPerformance[]>>(
          "/api/analytics/location-performance",
          filters
        ).then((r) => r.data),

      recentActivity: (limit: number = 10, filters?: AnalyticsFilters) =>
        get<AnalyticsResponse<ActivityData[]>>(
          "/api/analytics/recent-activity",
          {
            limit,
            ...filters,
          }
        ).then((r) => r.data),

      responseMetrics: (filters?: AnalyticsFilters) =>
        get<AnalyticsResponse<ResponseMetrics>>(
          "/api/analytics/response-metrics",
          filters
        ).then((r) => r.data),
    },
  },
};

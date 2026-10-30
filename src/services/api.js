import { resolveBaseUrl } from "./axiosInstance.js";

// API Service for SHASH Studios Admin Dashboard
const API_BASE_URL = resolveBaseUrl();

const getHeaders = () => {
  const token = localStorage.getItem("shash_admin_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const parseJsonSafe = async (res) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
};

export const adminApi = {
  // Authentication
  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) {
      throw new Error(
        data.message || `Login failed (${res.status} ${res.statusText})`
      );
    }
    return data;
  },

  // Stats Overview
  getStats: async () => {
    const res = await fetch(`${API_BASE_URL}/batches/overview/stats`, {
      headers: getHeaders()
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch stats");
    }
    return data.data;
  },

  // Sections & Disciplines (Dynamic Collection)
  getSections: async () => {
    const res = await fetch(`${API_BASE_URL}/sections`, {
      headers: getHeaders()
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch sections");
    }
    return data.data || [];
  },

  createSection: async (sectionData) => {
    const res = await fetch(`${API_BASE_URL}/sections`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(sectionData)
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) throw new Error(data.message || "Failed to create section");
    return data.data;
  },

  updateSection: async (idOrSlug, sectionData) => {
    const res = await fetch(`${API_BASE_URL}/sections/${idOrSlug}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(sectionData)
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) throw new Error(data.message || "Failed to update section");
    return data.data;
  },

  // Batches & Slots
  getBatches: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/batches${query ? `?${query}` : ""}`, {
      headers: getHeaders()
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch batches");
    }
    return data.data || [];
  },

  getBatchById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/batches/${id}`, {
      headers: getHeaders()
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch batch details");
    }
    return data.data || null;
  },

  createBatch: async (batchData) => {
    const res = await fetch(`${API_BASE_URL}/batches`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(batchData)
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) throw new Error(data.message || "Failed to create batch");
    return data.data;
  },

  updateBatch: async (id, updateData) => {
    const res = await fetch(`${API_BASE_URL}/batches/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(updateData)
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) throw new Error(data.message || "Failed to update batch");
    return data.data;
  },

  rescheduleBatch: async (id, payload) => {
    const res = await fetch(`${API_BASE_URL}/batches/${id}/reschedule`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) throw new Error(data.message || "Failed to reschedule batch");
    return data.data;
  },

  // Registrations & Students
  getRegistrations: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/registrations?${qs}`, {
      headers: getHeaders()
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch registrations");
    }
    return data.data?.registrations || data.data || [];
  },

  rescheduleStudent: async (bookingId, payload) => {
    const res = await fetch(`${API_BASE_URL}/registrations/${bookingId}/reschedule`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) throw new Error(data.message || "Failed to reschedule student");
    return data.data;
  },

  updatePaymentStatus: async (bookingId, status) => {
    const res = await fetch(`${API_BASE_URL}/registrations/${bookingId}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) throw new Error(data.message || "Failed to update payment status");
    return data.data;
  },

  // Inquiries
  getInquiries: async () => {
    const res = await fetch(`${API_BASE_URL}/inquiries`, {
      headers: getHeaders()
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch inquiries");
    }
    return data.data?.inquiries || data.data || [];
  },

  updateInquiryStatus: async (id, status, notes) => {
    const res = await fetch(`${API_BASE_URL}/inquiries/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ status, notes })
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) throw new Error(data.message || "Failed to update inquiry");
    return data.data;
  },

  // Store Products Management
  getProducts: async () => {
    const res = await fetch(`${API_BASE_URL}/products`);
    const data = await parseJsonSafe(res);
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch products");
    }
    return data.data || [];
  },

  createProduct: async (productData) => {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(productData)
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) throw new Error(data.message || "Failed to create product");
    return data.data;
  },

  updateProduct: async (id, productData) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(productData)
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) throw new Error(data.message || "Failed to update product");
    return data.data;
  },

  deleteProduct: async (id) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) throw new Error(data.message || "Failed to delete product");
    return data.data;
  },

  // Store Product Orders
  getProductOrders: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/products/orders/all?${query}`, {
      headers: getHeaders()
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch orders");
    }
    return data.data || [];
  },

  updateProductOrderStatus: async (id, statusData) => {
    const res = await fetch(`${API_BASE_URL}/products/orders/${id}/status`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(statusData)
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) throw new Error(data.message || "Failed to update order status");
    return data.data;
  }
};

export const api = adminApi;
export default adminApi;

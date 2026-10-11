import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";

// QUERY KEYS
export const QUERY_KEYS = {
  BATCHES: ["batches"],
  BATCH_DETAIL: (id) => ["batches", id],
  REGISTRATIONS: ["registrations"],
  INQUIRIES: ["inquiries"],
  STATS: ["stats"],
  SECTIONS: ["sections"],
  PRODUCTS: ["products"],
  ORDERS: ["orders"]
};

// 1. Batches Query
export const useBatchesQuery = (params = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.BATCHES, params],
    queryFn: async () => {
      const res = await axiosInstance.get("/batches", { params });
      const list = res.data?.batches || res.data;
      return Array.isArray(list) ? list : [];
    }
  });
};

// 2. Batch Detail Query
export const useBatchDetailQuery = (batchId) => {
  return useQuery({
    queryKey: QUERY_KEYS.BATCH_DETAIL(batchId),
    queryFn: async () => {
      const res = await axiosInstance.get(`/batches/${batchId}`);
      return res.data || null;
    },
    enabled: Boolean(batchId)
  });
};

// 3. Registrations Query
export const useRegistrationsQuery = (params = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.REGISTRATIONS, params],
    queryFn: async () => {
      const res = await axiosInstance.get("/registrations", { params });
      const list = res.data?.registrations || res.data;
      return Array.isArray(list) ? list : [];
    }
  });
};

// 4. Inquiries Query
export const useInquiriesQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.INQUIRIES,
    queryFn: async () => {
      const res = await axiosInstance.get("/inquiries");
      const list = res.data?.inquiries || res.data;
      return Array.isArray(list) ? list : [];
    }
  });
};

// 5. Overview Stats Query
export const useStatsQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.STATS,
    queryFn: async () => {
      const res = await axiosInstance.get("/batches/overview/stats");
      return res.data || null;
    }
  });
};

// 6. Dynamic Sections Query
export const useSectionsQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SECTIONS,
    queryFn: async () => {
      const res = await axiosInstance.get("/sections");
      const list = res.data?.data || res.data;
      return Array.isArray(list) ? list : [];
    }
  });
};

// --- MUTATIONS ---

// Create Batch Mutation
export const useCreateBatchMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (batchData) => {
      const res = await axiosInstance.post("/batches", batchData);
      return res.data;
    },
    onSuccess: (newBatch) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BATCHES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
    }
  });
};

// Update Batch Mutation
export const useUpdateBatchMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axiosInstance.put(`/batches/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BATCHES });
    }
  });
};

// Reschedule Batch Mutation (Migrates students)
export const useRescheduleBatchMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await axiosInstance.post(`/batches/${id}/reschedule`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BATCHES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REGISTRATIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
    }
  });
};

// Reschedule Individual Student Mutation
export const useRescheduleStudentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ bookingId, payload }) => {
      const res = await axiosInstance.patch(`/registrations/${bookingId}/reschedule`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REGISTRATIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BATCHES });
    }
  });
};

// Toggle Payment Status Mutation
export const useTogglePaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ bookingId, status }) => {
      const res = await axiosInstance.patch(`/registrations/${bookingId}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REGISTRATIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
    }
  });
};

// Create Section Mutation
export const useCreateSectionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sectionData) => {
      const res = await axiosInstance.post("/sections", sectionData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SECTIONS });
    }
  });
};

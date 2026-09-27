import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";
import { DEFAULT_BATCHES, DEFAULT_REGISTRATIONS, DEFAULT_INQUIRIES, DEFAULT_SECTIONS } from "../services/api";

// QUERY KEYS
export const QUERY_KEYS = {
  BATCHES: ["batches"],
  BATCH_DETAIL: (id) => ["batches", id],
  REGISTRATIONS: ["registrations"],
  INQUIRIES: ["inquiries"],
  STATS: ["stats"],
  SECTIONS: ["sections"]
};

// 1. Batches Query
export const useBatchesQuery = (params = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.BATCHES, params],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/batches", { params });
        const list = res.data?.batches || res.data;
        return Array.isArray(list) && list.length > 0 ? list : DEFAULT_BATCHES;
      } catch (err) {
        console.warn("Using offline fallback batches:", err.message);
        return DEFAULT_BATCHES;
      }
    }
  });
};

// 2. Batch Detail Query
export const useBatchDetailQuery = (batchId) => {
  return useQuery({
    queryKey: QUERY_KEYS.BATCH_DETAIL(batchId),
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/batches/${batchId}`);
        return res.data || DEFAULT_BATCHES.find((b) => b._id === batchId) || null;
      } catch (err) {
        console.warn("Using offline fallback batch detail:", err.message);
        return DEFAULT_BATCHES.find((b) => b._id === batchId) || null;
      }
    },
    enabled: Boolean(batchId)
  });
};

// 3. Registrations Query
export const useRegistrationsQuery = (params = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.REGISTRATIONS, params],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/registrations", { params });
        const list = res.data?.registrations || res.data;
        return Array.isArray(list) && list.length > 0 ? list : DEFAULT_REGISTRATIONS;
      } catch (err) {
        console.warn("Using offline fallback registrations:", err.message);
        return DEFAULT_REGISTRATIONS;
      }
    }
  });
};

// 4. Inquiries Query
export const useInquiriesQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.INQUIRIES,
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/inquiries");
        const list = res.data?.inquiries || res.data;
        return Array.isArray(list) && list.length > 0 ? list : DEFAULT_INQUIRIES;
      } catch (err) {
        console.warn("Using offline fallback inquiries:", err.message);
        return DEFAULT_INQUIRIES;
      }
    }
  });
};

// 5. Overview Stats Query
export const useStatsQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.STATS,
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/batches/overview/stats");
        return res.data;
      } catch (err) {
        console.warn("Using calculated stats fallback:", err.message);
        return null;
      }
    }
  });
};

// --- MUTATIONS ---

// Create Batch Mutation
export const useCreateBatchMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (batchData) => {
      try {
        const res = await axiosInstance.post("/batches", batchData);
        return res.data;
      } catch (err) {
        return {
          _id: `batch-${Date.now()}`,
          batchCode: `BATCH-${Date.now().toString().slice(-4)}`,
          ...batchData,
          status: "upcoming",
          enrolledCount: 0,
          spotsAvailable: Number(batchData.capacity)
        };
      }
    },
    onSuccess: (newBatch) => {
      queryClient.setQueryData(QUERY_KEYS.BATCHES, (old = []) => [newBatch, ...old]);
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
      try {
        const res = await axiosInstance.put(`/batches/${id}`, data);
        return res.data;
      } catch (err) {
        return { _id: id, ...data };
      }
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.BATCHES, (old = []) =>
        old.map((b) => (b._id === updated._id ? { ...b, ...updated } : b))
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BATCHES });
    }
  });
};

// Reschedule Batch Mutation (Migrates students)
export const useRescheduleBatchMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      try {
        const res = await axiosInstance.post(`/batches/${id}/reschedule`, payload);
        return res.data;
      } catch (err) {
        return { id, payload };
      }
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
      try {
        const res = await axiosInstance.patch(`/registrations/${bookingId}/reschedule`, payload);
        return res.data;
      } catch (err) {
        return { bookingId, payload };
      }
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
      try {
        const res = await axiosInstance.patch(`/registrations/${bookingId}/status`, { status });
        return res.data;
      } catch (err) {
        return { bookingId, status };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REGISTRATIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
    }
  });
};

// 7. Dynamic Sections Query
export const useSectionsQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SECTIONS,
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/sections");
        const list = res.data?.data || res.data;
        return Array.isArray(list) && list.length > 0 ? list : DEFAULT_SECTIONS;
      } catch (err) {
        console.warn("Using offline fallback sections:", err.message);
        return DEFAULT_SECTIONS;
      }
    }
  });
};

// 8. Create Section Mutation
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

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import {
  useBatchesQuery,
  useRegistrationsQuery,
  useInquiriesQuery,
  useStatsQuery,
  useCreateBatchMutation,
  useUpdateBatchMutation,
  useRescheduleBatchMutation,
  useRescheduleStudentMutation,
  useTogglePaymentMutation,
  useSectionsQuery,
  useCreateSectionMutation
} from "../../hooks/useAdminQueries";

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const [adminUser] = useState(() => {
    const saved = localStorage.getItem("shash_admin_user");
    return saved
      ? JSON.parse(saved)
      : { name: "Sushmitha (Sushii)", email: "admin@shashstudios.com", role: "Superadmin" };
  });

  // TanStack Queries (via Axios Instance)
  const { data: batches = [] } = useBatchesQuery();
  const { data: registrations = [] } = useRegistrationsQuery();
  const { data: inquiries = [] } = useInquiriesQuery();
  const { data: backendStats } = useStatsQuery();
  const { data: sections = [] } = useSectionsQuery();

  // TanStack Mutations
  const createBatchMutation = useCreateBatchMutation();
  const updateBatchMutation = useUpdateBatchMutation();
  const rescheduleBatchMutation = useRescheduleBatchMutation();
  const rescheduleStudentMutation = useRescheduleStudentMutation();
  const togglePaymentMutation = useTogglePaymentMutation();
  const createSectionMutation = useCreateSectionMutation();

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F6F4ED] font-sans text-[#131A15]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl bg-[#1C3325] px-5 py-3.5 text-white shadow-2xl border border-white/20 animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="material-symbols-outlined text-[20px] text-[#7EE0B6]">
            check_circle
          </span>
          <span className="text-[13.5px] font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Fixed Collapsible Sidebar (Does not scroll with page) */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        batchesCount={batches.length}
        bookingsCount={registrations.length}
        inquiriesCount={inquiries.length}
      />

      {/* Right Column: Fixed Navbar + Independent Scrollable Page Content */}
      <div className="flex flex-1 flex-col h-screen min-w-0 overflow-hidden">
        {/* Fixed Navbar (Does not scroll with page) */}
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          adminUser={adminUser}
        />

        {/* Scrollable Page Body (Only this area scrolls!) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1400px] w-full mx-auto">
            <Outlet
              context={{
                batches,
                registrations,
                inquiries,
                backendStats,
                sections,
                createBatchMutation,
                updateBatchMutation,
                rescheduleBatchMutation,
                rescheduleStudentMutation,
                togglePaymentMutation,
                createSectionMutation,
                showToast
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
};


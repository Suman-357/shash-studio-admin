import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";

export const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  batchesCount = 0,
  bookingsCount = 0,
  inquiriesCount = 0
}) => {
  const navItems = [
    { to: "/", label: "Executive Overview", icon: "dashboard", end: true },
    { to: "/batches", label: "Batches & Time Slots", icon: "schedule", count: batchesCount },
    { to: "/bookings", label: "Student Rosters", icon: "groups", count: bookingsCount },
    { to: "/inquiries", label: "Inbound Leads", icon: "forum", count: inquiriesCount }
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-screen flex-col shrink-0 border-r border-[#E2DDD2] bg-[#FDFBF7] transition-all duration-300 ease-in-out md:static ${
        isSidebarOpen ? "w-64 translate-x-0" : "-translate-x-full md:w-20 md:translate-x-0"
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-[#E2DDD2] px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <img src={logo} alt="SHASH Studios" className="h-10 w-10 shrink-0 object-contain rounded-lg" />
          {isSidebarOpen && (
            <div className="whitespace-nowrap transition-opacity duration-200">
              <span className="font-serif text-[16px] font-bold text-[#1C3325] block leading-tight">
                SHASH Studios
              </span>
              <span className="text-[9.5px] uppercase font-bold tracking-widest text-[#C26D38] block">
                Command Center
              </span>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2DDD2] text-[#1C3325] md:hidden cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
        {navItems.map((item) => {
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => {
                if (window.innerWidth < 768) setIsSidebarOpen(false);
              }}
              title={!isSidebarOpen ? item.label : undefined}
              className={({ isActive }) =>
                `group flex w-full items-center rounded-xl p-3 text-[13.5px] font-semibold transition-all duration-200 sidebar-link ${
                  isActive
                    ? "active-item !bg-[#1C3325] !text-white shadow-md shadow-[#1C3325]/25"
                    : "text-[#4A554E] hover:!bg-[#E6F0EB] hover:!text-[#1C3325]"
                } ${isSidebarOpen ? "justify-between" : "justify-center"}`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <span
                      className={`sidebar-icon material-symbols-outlined text-[21px] transition-transform group-hover:scale-110 ${
                        isActive ? "!text-[#4ADE80]" : "text-[#5C665F] group-hover:!text-[#1C3325]"
                      }`}
                    >
                      {item.icon}
                    </span>
                    {isSidebarOpen && (
                      <span
                        className={`sidebar-label whitespace-nowrap transition-colors ${
                          isActive ? "!text-white font-bold" : "text-[#3D4740] group-hover:!text-[#1C3325]"
                        }`}
                      >
                        {item.label}
                      </span>
                    )}
                  </div>

                  {isSidebarOpen && item.count !== undefined && (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold shrink-0 transition-colors ${
                        isActive
                          ? "!bg-white/25 !text-white"
                          : "bg-[#EDE8DE] text-[#1C3325] group-hover:bg-white"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer / Toggle Mini Trigger */}
      <div className="border-t border-[#E2DDD2] p-3">
        {isSidebarOpen ? (
          <div className="rounded-2xl bg-[#EFECE3]/70 p-3.5 border border-[#E2DDD2]">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#1C3325]">
              <span>Mysuru Lineage</span>
              <span className="text-[#0E6848]">● Online</span>
            </div>
            <p className="mt-1 text-[11px] text-[#5C665F] leading-tight">
              stay healthy and stay happy
            </p>
          </div>
        ) : (
          <div className="flex justify-center text-xs text-[#0E6848]">
            ●
          </div>
        )}

        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E2DDD2] bg-white py-2 text-[12px] font-semibold text-[#5C665F] hover:bg-[#FAF8F2] hover:text-[#131A15] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isSidebarOpen ? "chevron_left" : "chevron_right"}
          </span>
          {isSidebarOpen && <span>Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
};

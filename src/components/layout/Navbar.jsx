import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import logo from "../../assets/logo.png";

export const Navbar = ({ isSidebarOpen, setIsSidebarOpen, adminUser }) => {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 w-full items-center justify-between border-b border-[#E2DDD2] bg-[#FFFFFF]/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Sidebar Toggle & Studio Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2DDD2] bg-[#FAF8F2] text-[#1C3325] hover:bg-[#EFECE3] transition-colors cursor-pointer"
          title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          aria-label="Toggle Sidebar"
        >
          <span className="material-symbols-outlined text-[22px]">
            {isSidebarOpen ? "menu_open" : "menu"}
          </span>
        </button>

        <div className="flex items-center gap-2.5">
          <img src={logo} alt="SHASH Studios" className="h-10 w-10 object-contain rounded-lg" />
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-serif text-[17px] font-bold text-[#1C3325] leading-none">
                SHASH Studios
              </span>
              <span className="rounded-full bg-[#E3F5EE] px-2.5 py-0.5 text-[10px] font-bold text-[#0E6848] border border-[#0E6848]/20 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0E6848] animate-pulse"></span>
                Mysuru Shala Live
              </span>
            </div>
            <p className="text-[10.5px] font-medium text-[#5C665F] tracking-wide mt-0.5">
              stay healthy and stay happy
            </p>
          </div>
        </div>
      </div>

      {/* Right: Quick Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Refresh Cache */}
        <button
          onClick={handleRefresh}
          className="flex h-9 items-center gap-1.5 rounded-full border border-[#E2DDD2] bg-[#FFFFFF] px-3 text-[12px] font-semibold text-[#1C3325] hover:bg-[#FAF8F2] transition-colors shadow-xs cursor-pointer"
          title="Refresh real-time data from database"
        >
          <span className="material-symbols-outlined text-[16px] text-[#2D4A37]">
            refresh
          </span>
          <span className="hidden md:inline">Sync Data</span>
        </button>

        {/* View Student Website */}
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="flex h-9 items-center gap-1.5 rounded-full border border-[#E2DDD2] bg-[#FAF8F2] px-3.5 text-[12px] font-semibold text-[#1C3325] hover:bg-[#EFECE3] transition-colors"
        >
          <span className="material-symbols-outlined text-[16px] text-[#C26D38]">
            open_in_new
          </span>
          <span className="hidden sm:inline">Student Site</span>
        </a>

        {/* Profile Card */}
        <div className="flex items-center gap-2.5 rounded-xl border border-[#E2DDD2] bg-[#FAF8F2] py-1.5 pl-2 pr-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1C3325] text-white font-bold text-[12px]">
            S
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-[12px] font-bold text-[#131A15] leading-tight">
              {adminUser?.name || "Sushmitha (Sushii)"}
            </p>
            <p className="text-[10px] font-semibold text-[#5C665F] uppercase tracking-wide">
              {adminUser?.role || "Superadmin"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

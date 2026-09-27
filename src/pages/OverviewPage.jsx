import React, { useState } from "react";
import { useOutletContext, Link } from "react-router-dom";

export const OverviewPage = () => {
  const { batches, registrations, backendStats } = useOutletContext();
  const [viewingBatch, setViewingBatch] = useState(null);

  const totalRevenue =
    backendStats?.totalRevenue ||
    registrations
      .filter((r) => r.paymentStatus === "completed")
      .reduce((sum, r) => sum + (r.amount || 0), 0);

  const totalSeats = batches.reduce((sum, b) => sum + (b.capacity || 20), 0);
  const totalBookedSeats = registrations.length;
  const overallOccupancy = totalSeats > 0 ? Math.round((totalBookedSeats / totalSeats) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1C3325] to-[#2D4A37] p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold tracking-wider uppercase backdrop-blur-md">
              🪷 Mysuru Sanctuary Lineage
            </span>
            <h2 className="my-2 font-serif text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
              Namaskara, Sushii!
            </h2>
            <p className="text-[13.5px] text-white/80 max-w-xl leading-relaxed">
              Here is the real-time operational status across all daily batches, live Zoom links, and student attendance rosters.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/batches"
              className="rounded-full bg-[#C26D38] hover:bg-[#E0854E] text-white px-5 py-2.5 font-bold text-[13px] shadow-md transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Manage Batches</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="rounded-2xl border border-[#E2DDD2] bg-white p-5 shadow-xs transition-hover hover:shadow-md flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11.5px] font-bold uppercase tracking-wider text-[#5C665F]">
                Total Gross Revenue
              </p>
              <h3 className="my-2 font-serif text-2xl sm:text-3xl font-bold text-[#1C3325] leading-tight">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </h3>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E3F5EE] text-[#0E6848]">
              <span className="material-symbols-outlined text-[24px]">payments</span>
            </span>
          </div>
          <p className="text-[11.5px] text-[#5C665F] pt-2 border-t border-[#E2DDD2]/50">
            UPI, GPay & direct student enrollments
          </p>
        </div>

        {/* Total Enrollments */}
        <div className="rounded-2xl border border-[#E2DDD2] bg-white p-5 shadow-xs transition-hover hover:shadow-md flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11.5px] font-bold uppercase tracking-wider text-[#5C665F]">
                Total Enrollments
              </p>
              <h3 className="my-2 font-serif text-2xl sm:text-3xl font-bold text-[#1C3325] leading-tight">
                {registrations.length} Students
              </h3>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E0F2FE] text-[#0369A1]">
              <span className="material-symbols-outlined text-[24px]">person_check</span>
            </span>
          </div>
          <p className="text-[11.5px] text-[#5C665F] pt-2 border-t border-[#E2DDD2]/50">
            Active across {batches.length} scheduled time slots
          </p>
        </div>

        {/* Overall Occupancy */}
        <div className="rounded-2xl border border-[#E2DDD2] bg-white p-5 shadow-xs transition-hover hover:shadow-md flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-full mr-2">
              <p className="text-[11.5px] font-bold uppercase tracking-wider text-[#5C665F]">
                Capacity Filled
              </p>
              <h3 className="my-2 font-serif text-2xl sm:text-3xl font-bold text-[#1C3325] leading-tight">
                {overallOccupancy}%
              </h3>
              <div className="h-2 w-full rounded-full bg-[#EFECE3] overflow-hidden my-1">
                <div
                  className="h-full rounded-full bg-[#1C3325] transition-all duration-500"
                  style={{ width: `${overallOccupancy}%` }}
                />
              </div>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FEF3D6] text-[#945B09]">
              <span className="material-symbols-outlined text-[24px]">monitoring</span>
            </span>
          </div>
          <p className="text-[11.5px] text-[#5C665F] pt-2 border-t border-[#E2DDD2]/50">
            Based on batch limits
          </p>
        </div>

        {/* Active Batches */}
        <div className="rounded-2xl border border-[#E2DDD2] bg-white p-5 shadow-xs transition-hover hover:shadow-md flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11.5px] font-bold uppercase tracking-wider text-[#5C665F]">
                Live Batches
              </p>
              <h3 className="my-2 font-serif text-2xl sm:text-3xl font-bold text-[#1C3325] leading-tight">
                {batches.filter((b) => b.status === "active").length} Active
              </h3>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EDE8DE] text-[#1C3325]">
              <span className="material-symbols-outlined text-[24px]">spa</span>
            </span>
          </div>
          <p className="text-[11.5px] text-[#5C665F] pt-2 border-t border-[#E2DDD2]/50">
            Kannada + English bilingual instruction
          </p>
        </div>
      </div>

      {/* Time Slots & Occupancy Breakdown Section */}
      <div className="rounded-3xl border border-[#E2DDD2] bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E2DDD2]">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#1C3325]">
              Daily Time Slots & Occupancy (Who is booked where?)
            </h3>
            <p className="text-[12.5px] text-[#5C665F] mt-0.5">
              Click "View Students" on any batch slot to see exact student names, WhatsApp numbers, and health restrictions.
            </p>
          </div>
          <Link
            to="/batches"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#1C3325] bg-[#1C3325] px-4 py-2 text-[12.5px] font-bold text-white hover:bg-[#2D4A37] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
            Manage Schedule
          </Link>
        </div>

        {/* Slot Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
          {batches.map((batch) => {
            const enrolledInSlot = registrations.filter(
              (r) => r.slot === batch.slotTime || r.batchId === batch._id
            );
            const occupancy = Math.round(
              (enrolledInSlot.length / (batch.capacity || 20)) * 100
            );

            return (
              <div
                key={batch._id}
                className="flex flex-col justify-between rounded-2xl border border-[#E2DDD2] bg-[#FAF8F2] p-5 transition-all hover:border-[#1C3325]/40 hover:shadow-md"
              >
                <div>
                  {/* Header tags */}
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-white border border-[#E2DDD2] px-2 py-0.5 font-mono text-[10.5px] font-bold text-[#5C665F]">
                      {batch.batchCode}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase ${
                        batch.status === "active"
                          ? "bg-[#E3F5EE] text-[#0E6848] border border-[#0E6848]/20"
                          : "bg-[#FEF3D6] text-[#945B09] border border-[#945B09]/20"
                      }`}
                    >
                      {batch.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="mt-3 text-[15px] font-bold text-[#1C3325]">
                    {batch.title}
                  </h4>
                  <p className="text-[12px] text-[#5C665F]">
                    {batch.workshopId?.title || "21-Day Challenge"}
                  </p>

                  {/* Slot Time Box */}
                  <div className="mt-3 flex items-center gap-2 rounded-xl bg-white border border-[#E2DDD2] p-2.5">
                    <span className="material-symbols-outlined text-[18px] text-[#C26D38]">
                      alarm
                    </span>
                    <span className="text-[13px] font-bold text-[#131A15]">
                      {batch.slotTime}
                    </span>
                  </div>

                  {/* Occupancy Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-[11.5px] font-semibold text-[#1C3325]">
                      <span>{enrolledInSlot.length} Enrolled</span>
                      <span className="text-[#5C665F]">
                        {Math.max(0, (batch.capacity || 20) - enrolledInSlot.length)} Spots Left
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full rounded-full bg-[#E2DDD2] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          occupancy >= 90 ? "bg-[#C26D38]" : "bg-[#1C3325]"
                        }`}
                        style={{ width: `${Math.min(100, occupancy)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <div className="mt-5 pt-3.5 border-t border-[#E2DDD2] flex items-center gap-2">
                  <button
                    onClick={() => setViewingBatch(batch)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[#E2DDD2] bg-white py-2 text-[12px] font-bold text-[#1C3325] hover:bg-[#FAF8F2] hover:border-[#1C3325] transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#0E6848]">
                      group
                    </span>
                    <span>View Roster ({enrolledInSlot.length})</span>
                  </button>
                  <Link
                    to="/batches"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2DDD2] bg-white text-[#1C3325] hover:bg-[#FAF8F2] hover:border-[#1C3325] transition-colors"
                    title="Edit batch settings"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* VIEW BATCH ROSTER MODAL */}
      {viewingBatch && (
        <div className="modal-overlay" onClick={() => setViewingBatch(null)}>
          <div className="modal-card max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#E2DDD2] p-5">
              <div>
                <span className="badge badge-neutral">{viewingBatch.batchCode}</span>
                <h3 className="font-serif text-xl font-bold text-[#1C3325] mt-1">
                  {viewingBatch.title} • Student Roster
                </h3>
                <p className="text-[12px] text-[#5C665F]">
                  Slot Time: <strong>{viewingBatch.slotTime}</strong> • Instructor: {viewingBatch.instructorName}
                </p>
              </div>
              <button onClick={() => setViewingBatch(null)} className="btn-icon">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-2.5">
              {(() => {
                const roster = registrations.filter(
                  (r) => r.slot === viewingBatch.slotTime || r.batchId === viewingBatch._id
                );

                if (roster.length === 0) {
                  return (
                    <p className="text-center py-8 text-[#5C665F]">
                      No students enrolled in this batch slot yet.
                    </p>
                  );
                }

                return roster.map((s, idx) => (
                  <div
                    key={s.bookingId || idx}
                    className="flex items-center justify-between rounded-xl border border-[#E2DDD2] bg-[#FAF8F2] p-3.5"
                  >
                    <div>
                      <div className="font-bold text-[#1C3325] text-[14px]">
                        {idx + 1}. {s.fullName}
                      </div>
                      <div className="text-[12px] text-[#5C665F] mt-0.5">
                        Booking ID: <strong className="font-mono">{s.bookingId}</strong> • Health: {s.healthNotes || "beginner"}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`badge ${
                          s.paymentStatus === "completed" ? "badge-success" : "badge-warning"
                        }`}
                      >
                        {s.paymentStatus}
                      </span>
                      <a
                        href={`https://wa.me/91${s.whatsapp.slice(-10)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-icon text-[#0E6848]"
                        title="Chat on WhatsApp"
                      >
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                      </a>
                    </div>
                  </div>
                ));
              })()}
            </div>

            <div className="border-t border-[#E2DDD2] p-4 text-right">
              <button onClick={() => setViewingBatch(null)} className="btn-secondary">
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

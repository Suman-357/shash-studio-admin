import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { CustomSelect } from "../components/common/CustomSelect";

export const BookingsPage = () => {
  const {
    registrations,
    rescheduleStudentMutation,
    togglePaymentMutation,
    showToast
  } = useOutletContext();

  const [slotFilter, setSlotFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const [reschedulingStudent, setReschedulingStudent] = useState(null);
  const [rescheduleStudentForm, setRescheduleStudentForm] = useState({
    newSlotTime: "6:30 AM – 7:30 AM IST",
    reason: "Student requested alternative morning slot"
  });

  const filteredRegistrations = registrations.filter((r) => {
    const matchesSlot = slotFilter === "all" || r.slot.includes(slotFilter);
    const matchesPayment = paymentFilter === "all" || r.paymentStatus === paymentFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.fullName.toLowerCase().includes(q) ||
      r.bookingId.toLowerCase().includes(q) ||
      r.whatsapp.includes(q) ||
      r.email.toLowerCase().includes(q);
    return matchesSlot && matchesPayment && matchesSearch;
  });

  const handleTogglePayment = (reg) => {
    const nextStatus = reg.paymentStatus === "completed" ? "pending" : "completed";
    togglePaymentMutation.mutate(
      { bookingId: reg.bookingId, status: nextStatus },
      {
        onSuccess: () => {
          showToast(`Payment status updated to "${nextStatus.toUpperCase()}" for ${reg.bookingId}`);
        }
      }
    );
  };

  const handleExecuteStudentReschedule = (e) => {
    e.preventDefault();
    if (!reschedulingStudent || !rescheduleStudentForm.newSlotTime) return;
    rescheduleStudentMutation.mutate(
      { bookingId: reschedulingStudent.bookingId, payload: rescheduleStudentForm },
      {
        onSuccess: () => {
          setReschedulingStudent(null);
          showToast(`Student ${reschedulingStudent.fullName} moved to "${rescheduleStudentForm.newSlotTime}".`);
        }
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1C3325]">
            Student Bookings & Enrollment Roster
          </h2>
          <p className="text-[13px] text-[#5C665F]">
            Search by student, check who booked which slot, view original vs rescheduled timing, and manage WhatsApp communication.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="rounded-2xl border border-[#E2DDD2] bg-white p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
        {/* Search */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C665F] mb-1">
            Search Students
          </label>
          <input
            type="text"
            placeholder="Name, Phone, Email, Booking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-text"
          />
        </div>

        {/* Filter by Slot */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C665F] mb-1">
            Filter by Time Slot
          </label>
          <CustomSelect
            value={slotFilter}
            onChange={(e) => setSlotFilter(e.target.value)}
            options={[
              { value: "all", label: "All Daily Time Slots", emoji: "🗓️" },
              { value: "5:30 AM", label: "5:30 AM – 6:30 AM (Morning 1)", emoji: "🌅" },
              { value: "6:30 AM", label: "6:30 AM – 7:30 AM (Morning 2)", emoji: "☀️" },
              { value: "11:30 AM", label: "11:30 AM – 12:30 PM (Ladies)", emoji: "🌸" },
              { value: "9:30 PM", label: "9:30 PM – 10:00 PM (Sushii Nights)", emoji: "🌙" }
            ]}
          />
        </div>

        {/* Filter by Payment */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C665F] mb-1">
            Payment Status
          </label>
          <CustomSelect
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            options={[
              { value: "all", label: "All Payment Statuses", emoji: "💳" },
              { value: "completed", label: "Completed (Paid)", emoji: "✅" },
              { value: "pending", label: "Pending Verification", emoji: "⏳" }
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Student Details</th>
              <th>WhatsApp & Contact</th>
              <th>Active Slot</th>
              <th>Timing History</th>
              <th>Amount & Pay</th>
              <th>Consent Audit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-[#5C665F]">
                  No bookings matching current filters.
                </td>
              </tr>
            ) : (
              filteredRegistrations.map((reg) => (
                <tr key={reg._id || reg.bookingId}>
                  <td>
                    <span className="badge badge-neutral font-mono font-bold">
                      {reg.bookingId}
                    </span>
                  </td>
                  <td>
                    <div className="font-bold text-[#1C3325]">{reg.fullName}</div>
                    <div className="flex gap-1 mt-1">
                      <span className="badge badge-neutral text-[10px]">
                        {reg.healthNotes || "beginner"}
                      </span>
                      <span className="badge badge-neutral text-[10px]">
                        {reg.languagePref || "both"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <a
                      href={`https://wa.me/91${reg.whatsapp.replace(/\D/g, "").slice(-10)}?text=Namaskara%20${encodeURIComponent(reg.fullName)}%2C%20greetings%20from%20Shash%20Studios%20Mysuru.`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-[#0E6848] text-[12.5px] hover:underline"
                    >
                      <span className="material-symbols-outlined text-[16px]">chat</span>
                      +91 {reg.whatsapp.slice(-10)}
                    </a>
                    <div className="text-[11px] text-[#5C665F]">{reg.email}</div>
                  </td>
                  <td>
                    <div className="font-bold text-[13px]">{reg.slot}</div>
                    <div className="text-[11px] text-[#5C665F]">{reg.workshopTitle}</div>
                  </td>
                  <td>
                    {reg.rescheduleHistory && reg.rescheduleHistory.length > 0 ? (
                      <div className="text-[11.5px]">
                        <span className="badge badge-warning text-[10px]">
                          Rescheduled
                        </span>
                        <div className="text-[#5C665F] mt-0.5 text-[11px]">
                          Was: {reg.rescheduleHistory[0].fromSlotTime}
                        </div>
                      </div>
                    ) : (
                      <span className="text-[11.5px] text-[#5C665F]">Original Slot</span>
                    )}
                  </td>
                  <td>
                    <div className="font-bold">₹{reg.amount}</div>
                    <button
                      onClick={() => handleTogglePayment(reg)}
                      className={`badge cursor-pointer mt-1 ${
                        reg.paymentStatus === "completed"
                          ? "badge-success"
                          : "badge-warning"
                      }`}
                      title="Click to toggle payment status"
                    >
                      {reg.paymentStatus.toUpperCase()}
                    </button>
                  </td>
                  <td>
                    <div className="flex items-center gap-1 text-[11.5px]">
                      <span
                        className="material-symbols-outlined text-[16px]"
                        style={{ color: reg.consentGiven ? "#0E6848" : "#B42318" }}
                      >
                        {reg.consentGiven ? "check_box" : "check_box_outline_blank"}
                      </span>
                      <span>{reg.consentGiven ? "Granted" : "Pending"}</span>
                    </div>
                    <div className="text-[10px] text-[#5C665F] mt-0.5">
                      {new Date(reg.consentTimestamp || reg.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setReschedulingStudent(reg);
                        setRescheduleStudentForm({
                          newSlotTime: reg.slot,
                          reason: "Student requested slot change"
                        });
                      }}
                      className="btn-secondary text-[11.5px] py-1.5 px-3 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">swap_horiz</span>
                      Change Slot
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* RESCHEDULE INDIVIDUAL STUDENT MODAL */}
      {reschedulingStudent && (
        <div className="modal-overlay" onClick={() => setReschedulingStudent(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleExecuteStudentReschedule}>
              <div className="flex items-center justify-between border-b border-[#E2DDD2] p-5">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1C3325]">
                    Move Student to Another Slot
                  </h3>
                  <p className="text-[12px] text-[#5C665F]">
                    Student: <strong>{reschedulingStudent.fullName}</strong> ({reschedulingStudent.bookingId})
                  </p>
                </div>
                <button type="button" onClick={() => setReschedulingStudent(null)} className="btn-icon">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-[12.5px] font-semibold mb-1">
                    Select New Time Slot *
                  </label>
                  <CustomSelect
                    value={rescheduleStudentForm.newSlotTime}
                    onChange={(e) => setRescheduleStudentForm({ ...rescheduleStudentForm, newSlotTime: e.target.value })}
                    options={[
                      { value: "5:30 AM – 6:30 AM IST", label: "5:30 AM – 6:30 AM IST (Morning 1)", emoji: "🌅" },
                      { value: "6:30 AM – 7:30 AM IST", label: "6:30 AM – 7:30 AM IST (Morning 2)", emoji: "☀️" },
                      { value: "11:30 AM – 12:30 PM IST", label: "11:30 AM – 12:30 PM IST (Ladies Batch)", emoji: "🌸" },
                      { value: "9:30 PM – 10:00 PM IST", label: "9:30 PM – 10:00 PM IST (Sushii Nights)", emoji: "🌙" }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold mb-1">
                    Reason for Slot Transfer *
                  </label>
                  <input
                    type="text"
                    required
                    value={rescheduleStudentForm.reason}
                    onChange={(e) => setRescheduleStudentForm({ ...rescheduleStudentForm, reason: e.target.value })}
                    placeholder="e.g. Student requested later batch due to office shift"
                    className="input-text"
                  />
                </div>
              </div>

              <div className="border-t border-[#E2DDD2] p-4 flex justify-end gap-2.5">
                <button type="button" onClick={() => setReschedulingStudent(null)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Student Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

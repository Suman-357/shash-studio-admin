import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { CustomSelect } from "../components/common/CustomSelect";

export const BatchesPage = () => {
  const {
    batches,
    registrations,
    sections = [],
    createBatchMutation,
    updateBatchMutation,
    rescheduleBatchMutation,
    createSectionMutation,
    showToast
  } = useOutletContext();

  const [viewingBatch, setViewingBatch] = useState(null);
  const [editingBatch, setEditingBatch] = useState(null);
  const [reschedulingBatch, setReschedulingBatch] = useState(null);
  const [isCreatingBatch, setIsCreatingBatch] = useState(false);
  const [isCreatingSection, setIsCreatingSection] = useState(false);
  const [sectionFilter, setSectionFilter] = useState("all");

  const [newBatchForm, setNewBatchForm] = useState({
    title: "",
    section: "yoga",
    slotTime: "5:30 AM – 6:30 AM IST",
    capacity: 20,
    workshopId: "21day",
    instructorName: "Sushii",
    zoomLink: "https://zoom.us/j/shash-live",
    startDate: "2026-08-01",
    endDate: "2026-08-21"
  });

  const [newSectionForm, setNewSectionForm] = useState({
    name: "",
    nameKn: "",
    emoji: "✨",
    tagline: "",
    taglineKn: "",
    badge: "",
    badgeKn: "",
    accentColor: "#1C3325"
  });

  const [rescheduleBatchForm, setRescheduleBatchForm] = useState({
    newSlotTime: "",
    reason: ""
  });

  const handleCreateSection = (e) => {
    e.preventDefault();
    if (!newSectionForm.name || !newSectionForm.nameKn) return;
    createSectionMutation.mutate(newSectionForm, {
      onSuccess: () => {
        setIsCreatingSection(false);
        setNewSectionForm({
          name: "",
          nameKn: "",
          emoji: "✨",
          tagline: "",
          taglineKn: "",
          badge: "",
          badgeKn: "",
          accentColor: "#1C3325"
        });
        showToast(`Section "${newSectionForm.name}" created in MongoDB collection!`);
      },
      onError: (err) => {
        showToast(err.message || "Failed to create section");
      }
    });
  };

  const handleCreateBatch = (e) => {
    e.preventDefault();
    createBatchMutation.mutate(newBatchForm, {
      onSuccess: () => {
        setIsCreatingBatch(false);
        setNewBatchForm({
          title: "",
          section: "yoga",
          slotTime: "5:30 AM – 6:30 AM IST",
          capacity: 20,
          workshopId: "21day",
          instructorName: "Sushii",
          zoomLink: "https://zoom.us/j/shash-live",
          startDate: "2026-08-01",
          endDate: "2026-08-21"
        });
        showToast("New batch slot published to database!");
      }
    });
  };

  const handleSaveBatchEdit = (e) => {
    e.preventDefault();
    if (!editingBatch) return;
    updateBatchMutation.mutate(
      { id: editingBatch._id, data: editingBatch },
      {
        onSuccess: () => {
          setEditingBatch(null);
          showToast(`Batch "${editingBatch.title}" updated successfully!`);
        }
      }
    );
  };

  const handleExecuteBatchReschedule = (e) => {
    e.preventDefault();
    if (!reschedulingBatch || !rescheduleBatchForm.newSlotTime) return;
    rescheduleBatchMutation.mutate(
      { id: reschedulingBatch._id, payload: rescheduleBatchForm },
      {
        onSuccess: () => {
          setReschedulingBatch(null);
          setRescheduleBatchForm({ newSlotTime: "", reason: "" });
          showToast(`Batch rescheduled to "${rescheduleBatchForm.newSlotTime}". Students migrated!`);
        }
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1C3325]">
            Shala Batches & Slot Schedule
          </h2>
          <p className="text-[13px] text-[#5C665F]">
            Create new batches, adjust slot times, or migrate student cohorts with automatic audit tracking.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreatingSection(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#2D4A37]/20 px-4 py-2.5 text-[13px] font-bold text-[#1C3325] hover:bg-[#EDE8DE] transition-all shadow-xs cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#C26D38]">category</span>
            <span>+ Add Section</span>
          </button>
          <button
            onClick={() => setIsCreatingBatch(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#1C3325] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-[#2D4A37] transition-all shadow-sm cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Add New Batch Slot</span>
          </button>
        </div>
      </div>

      {/* Dynamic Section Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setSectionFilter("all")}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-bold transition-all shrink-0 cursor-pointer ${
            sectionFilter === "all"
              ? "bg-[#1C3325] text-white shadow-2xs"
              : "bg-white text-[#5C665F] border border-[#E2DDD2] hover:bg-[#F3F0E8]"
          }`}
        >
          <span>🌿</span>
          <span>All Sections</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            sectionFilter === "all" ? "bg-white/20 text-white" : "bg-[#EDE8DE] text-[#5C665F]"
          }`}>
            {batches.length}
          </span>
        </button>

        {sections.map((sec) => {
          const secKey = sec.slug || sec.id;
          const count = batches.filter(b => (b.section || b.workshopId?.section) === secKey).length;
          const isActive = sectionFilter === secKey;
          return (
            <button
              key={secKey}
              type="button"
              onClick={() => setSectionFilter(secKey)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-[#1C3325] text-white shadow-2xs"
                  : "bg-white text-[#5C665F] border border-[#E2DDD2] hover:bg-[#F3F0E8]"
              }`}
            >
              <span>{sec.emoji || "✨"}</span>
              <span>{sec.name}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                isActive ? "bg-white/20 text-white" : "bg-[#EDE8DE] text-[#5C665F]"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table Container */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Batch Code</th>
              <th>Program & Title</th>
              <th>Current Slot Timing</th>
              <th>Occupancy / Capacity</th>
              <th>Instructor</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches
              .filter((b) => {
                if (sectionFilter === "all") return true;
                const bSec = b.section || b.workshopId?.section || "yoga";
                return bSec === sectionFilter;
              })
              .map((b) => {
              const enrolledCount = registrations.filter(
                (r) => r.slot === b.slotTime || r.batchId === b._id
              ).length;

              return (
                <tr key={b._id}>
                  <td>
                    <span className="badge badge-neutral font-mono font-bold">
                      {b.batchCode}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1C3325]">{b.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE8DE] text-[#1C3325]">
                        {b.section === "music" ? "🎵 Music" : b.section === "other" ? "🍃 Other" : "🧘 Yoga"}
                      </span>
                    </div>
                    <div className="text-[11.5px] text-[#5C665F]">
                      {b.workshopId?.title || "Flagship 21-Day"}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 font-bold text-[#131A15]">
                      <span className="material-symbols-outlined text-[16px] text-[#C26D38]">
                        alarm
                      </span>
                      <span>{b.slotTime}</span>
                    </div>
                    {b.rescheduleReason && (
                      <div className="text-[11px] text-[#C26D38] mt-0.5">
                        * {b.rescheduleReason}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="font-bold text-[13px]">
                      {enrolledCount} / {b.capacity} Students
                    </div>
                    <div className="text-[11px] text-[#5C665F]">
                      {Math.max(0, b.capacity - enrolledCount)} spots left
                    </div>
                  </td>
                  <td>
                    <span className="text-[13px] font-medium">{b.instructorName || "Sushii"}</span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        b.status === "active" ? "badge-success" : "badge-warning"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setViewingBatch(b)}
                        className="btn-icon"
                        title="View enrolled students roster"
                      >
                        <span className="material-symbols-outlined text-[18px]">group</span>
                      </button>
                      <button
                        onClick={() => setEditingBatch(b)}
                        className="btn-icon"
                        title="Edit batch settings"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => {
                          setReschedulingBatch(b);
                          setRescheduleBatchForm({ newSlotTime: b.slotTime, reason: "" });
                        }}
                        className="btn-icon"
                        title="Reschedule slot timing"
                      >
                        <span className="material-symbols-outlined text-[18px]">update</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: VIEW BATCH ROSTER */}
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

      {/* MODAL 2: RESCHEDULE ENTIRE BATCH */}
      {reschedulingBatch && (
        <div className="modal-overlay" onClick={() => setReschedulingBatch(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleExecuteBatchReschedule}>
              <div className="flex items-center justify-between border-b border-[#E2DDD2] p-5">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1C3325]">
                    Reschedule Batch Slot Timing
                  </h3>
                  <p className="text-[12px] text-[#5C665F]">
                    Batch: <strong>{reschedulingBatch.title}</strong> (Currently: {reschedulingBatch.slotTime})
                  </p>
                </div>
                <button type="button" onClick={() => setReschedulingBatch(null)} className="btn-icon">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="rounded-xl bg-[#FEF3D6] p-3 text-[12.5px] text-[#945B09] border border-[#945B09]/20">
                  ⚠️ <strong>Notice:</strong> Changing this slot timing will automatically migrate all enrolled students and append an entry to their <code>rescheduleHistory</code> audit trail.
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold mb-1">
                    New Slot Timing *
                  </label>
                  <input
                    type="text"
                    required
                    value={rescheduleBatchForm.newSlotTime}
                    onChange={(e) => setRescheduleBatchForm({ ...rescheduleBatchForm, newSlotTime: e.target.value })}
                    placeholder="e.g. 6:00 AM – 7:00 AM IST"
                    className="input-text"
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold mb-1">
                    Reason for Reschedule *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={rescheduleBatchForm.reason}
                    onChange={(e) => setRescheduleBatchForm({ ...rescheduleBatchForm, reason: e.target.value })}
                    placeholder="e.g. Studio schedule adjustment for Mysore sunrise..."
                    className="input-text"
                  />
                </div>
              </div>

              <div className="border-t border-[#E2DDD2] p-4 flex justify-end gap-2.5">
                <button type="button" onClick={() => setReschedulingBatch(null)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm & Migrate Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE NEW BATCH SLOT */}
      {isCreatingBatch && (
        <div className="modal-overlay" onClick={() => setIsCreatingBatch(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleCreateBatch}>
              <div className="flex items-center justify-between border-b border-[#E2DDD2] p-5">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1C3325]">
                    Create New Batch Slot
                  </h3>
                  <p className="text-[12px] text-[#5C665F]">
                    Add a new daily class time slot to the shala schedule.
                  </p>
                </div>
                <button type="button" onClick={() => setIsCreatingBatch(false)} className="btn-icon">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-5 space-y-3.5">
                <div>
                  <label className="block text-[12.5px] font-semibold mb-1">
                    Batch Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBatchForm.title}
                    onChange={(e) => setNewBatchForm({ ...newBatchForm, title: e.target.value })}
                    placeholder="e.g. Evening Mysore Wind-Down Batch"
                    className="input-text"
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold mb-1">
                    Section / Discipline *
                  </label>
                  <CustomSelect
                    value={newBatchForm.section}
                    onChange={(e) => setNewBatchForm({ ...newBatchForm, section: e.target.value })}
                    options={sections.map((sec) => ({
                      value: sec.slug || sec.id,
                      label: sec.name,
                      labelKn: sec.nameKn,
                      emoji: sec.emoji || "✨",
                      icon: sec.icon
                    }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12.5px] font-semibold mb-1">
                      Slot Timing *
                    </label>
                    <input
                      type="text"
                      required
                      value={newBatchForm.slotTime}
                      onChange={(e) => setNewBatchForm({ ...newBatchForm, slotTime: e.target.value })}
                      placeholder="e.g. 7:00 PM – 8:00 PM IST"
                      className="input-text"
                    />
                  </div>
                  <div>
                    <label className="block text-[12.5px] font-semibold mb-1">
                      Capacity *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={100}
                      value={newBatchForm.capacity}
                      onChange={(e) => setNewBatchForm({ ...newBatchForm, capacity: e.target.value })}
                      className="input-text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12.5px] font-semibold mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newBatchForm.startDate}
                      onChange={(e) => setNewBatchForm({ ...newBatchForm, startDate: e.target.value })}
                      className="input-text"
                    />
                  </div>
                  <div>
                    <label className="block text-[12.5px] font-semibold mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newBatchForm.endDate}
                      onChange={(e) => setNewBatchForm({ ...newBatchForm, endDate: e.target.value })}
                      className="input-text"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold mb-1">
                    Instructor Name
                  </label>
                  <input
                    type="text"
                    value={newBatchForm.instructorName}
                    onChange={(e) => setNewBatchForm({ ...newBatchForm, instructorName: e.target.value })}
                    className="input-text"
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold mb-1">
                    Live Zoom Meeting Link
                  </label>
                  <input
                    type="url"
                    value={newBatchForm.zoomLink}
                    onChange={(e) => setNewBatchForm({ ...newBatchForm, zoomLink: e.target.value })}
                    className="input-text"
                  />
                </div>
              </div>

              <div className="border-t border-[#E2DDD2] p-4 flex justify-end gap-2.5">
                <button type="button" onClick={() => setIsCreatingBatch(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Publish Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT BATCH SETTINGS */}
      {editingBatch && (
        <div className="modal-overlay" onClick={() => setEditingBatch(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSaveBatchEdit}>
              <div className="flex items-center justify-between border-b border-[#E2DDD2] p-5">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1C3325]">
                    Edit Batch Settings
                  </h3>
                  <p className="text-[12px] text-[#5C665F]">
                    {editingBatch.batchCode}
                  </p>
                </div>
                <button type="button" onClick={() => setEditingBatch(null)} className="btn-icon">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-5 space-y-3.5">
                <div>
                  <label className="block text-[12.5px] font-semibold mb-1">
                    Batch Title
                  </label>
                  <input
                    type="text"
                    value={editingBatch.title}
                    onChange={(e) => setEditingBatch({ ...editingBatch, title: e.target.value })}
                    className="input-text"
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold mb-1">
                    Section / Discipline *
                  </label>
                  <CustomSelect
                    value={editingBatch.section || "yoga"}
                    onChange={(e) => setEditingBatch({ ...editingBatch, section: e.target.value })}
                    options={sections.map((sec) => ({
                      value: sec.slug || sec.id,
                      label: sec.name,
                      labelKn: sec.nameKn,
                      emoji: sec.emoji || "✨",
                      icon: sec.icon
                    }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12.5px] font-semibold mb-1">
                      Slot Timing
                    </label>
                    <input
                      type="text"
                      value={editingBatch.slotTime}
                      onChange={(e) => setEditingBatch({ ...editingBatch, slotTime: e.target.value })}
                      className="input-text"
                    />
                  </div>
                  <div>
                    <label className="block text-[12.5px] font-semibold mb-1">
                      Capacity
                    </label>
                    <input
                      type="number"
                      value={editingBatch.capacity}
                      onChange={(e) => setEditingBatch({ ...editingBatch, capacity: e.target.value })}
                      className="input-text"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold mb-1">
                    Status
                  </label>
                  <select
                    value={editingBatch.status}
                    onChange={(e) => setEditingBatch({ ...editingBatch, status: e.target.value })}
                    className="select-input"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold mb-1">
                    Zoom Link
                  </label>
                  <input
                    type="url"
                    value={editingBatch.zoomLink || ""}
                    onChange={(e) => setEditingBatch({ ...editingBatch, zoomLink: e.target.value })}
                    className="input-text"
                  />
                </div>
              </div>

              <div className="border-t border-[#E2DDD2] p-4 flex justify-end gap-2.5">
                <button type="button" onClick={() => setEditingBatch(null)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD NEW SECTION TO MONGODB COLLECTION */}
      {isCreatingSection && (
        <div className="modal-overlay" onClick={() => setIsCreatingSection(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleCreateSection}>
              <div className="flex items-center justify-between border-b border-[#E2DDD2] p-5">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1C3325]">
                    Add New Section / Discipline
                  </h3>
                  <p className="text-[12px] text-[#5C665F]">
                    Create a new discipline in the MongoDB sections collection.
                  </p>
                </div>
                <button type="button" onClick={() => setIsCreatingSection(false)} className="btn-icon">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-5 space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12.5px] font-semibold mb-1">
                      Section Name (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={newSectionForm.name}
                      onChange={(e) => setNewSectionForm({ ...newSectionForm, name: e.target.value })}
                      placeholder="e.g. Classical Dance"
                      className="input-text"
                    />
                  </div>
                  <div>
                    <label className="block text-[12.5px] font-semibold mb-1">
                      Section Name (Kannada) *
                    </label>
                    <input
                      type="text"
                      required
                      value={newSectionForm.nameKn}
                      onChange={(e) => setNewSectionForm({ ...newSectionForm, nameKn: e.target.value })}
                      placeholder="e.g. ಶಾಸ್ತ್ರೀಯ ನೃತ್ಯ"
                      className="input-text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12.5px] font-semibold mb-1">
                      Emoji Icon
                    </label>
                    <input
                      type="text"
                      value={newSectionForm.emoji}
                      onChange={(e) => setNewSectionForm({ ...newSectionForm, emoji: e.target.value })}
                      placeholder="e.g. 💃"
                      className="input-text"
                    />
                  </div>
                  <div>
                    <label className="block text-[12.5px] font-semibold mb-1">
                      Badge / Tag
                    </label>
                    <input
                      type="text"
                      value={newSectionForm.badge}
                      onChange={(e) => setNewSectionForm({ ...newSectionForm, badge: e.target.value })}
                      placeholder="e.g. Heritage Lineage"
                      className="input-text"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold mb-1">
                    Tagline (English)
                  </label>
                  <input
                    type="text"
                    value={newSectionForm.tagline}
                    onChange={(e) => setNewSectionForm({ ...newSectionForm, tagline: e.target.value })}
                    placeholder="e.g. Bharatanatyam, contemporary flow and temple movement"
                    className="input-text"
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold mb-1">
                    Tagline (Kannada)
                  </label>
                  <input
                    type="text"
                    value={newSectionForm.taglineKn}
                    onChange={(e) => setNewSectionForm({ ...newSectionForm, taglineKn: e.target.value })}
                    placeholder="e.g. ಭರತನಾಟ್ಯ ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ದೇವಾಲಯ ನೃತ್ಯ"
                    className="input-text"
                  />
                </div>
              </div>

              <div className="border-t border-[#E2DDD2] p-4 flex justify-end gap-2.5">
                <button type="button" onClick={() => setIsCreatingSection(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save to Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

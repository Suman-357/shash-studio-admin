import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

const EMPTY_FORM = {
  title: "",
  titleKn: "",
  badge: "SPECIAL BATCH · LIMITED SEATS",
  eventDateLabel: "",
  startDate: "",
  endDate: "",
  duration: "21 Days · 60 Mins Daily",
  ageLimit: "14 years & above",
  accessLabel: "Live Zoom Classes",
  memberPrice: 549,
  memberPriceLabel: "YouTube Members",
  paymentNote: "One-time payment for whole 21 days (Zoom live class + WhatsApp group access)",
  timingSlot: "4:30 – 5:30 AM IST",
  slotsText: "4:30 – 5:30 AM IST",
  price: 699,
  originalPrice: 999,
  capacity: 50,
  instructorName: "Sushii",
  description: "",
  descriptionKn: "",
  highlightsText:
    "21 Days Interactive Zoom Live Sessions\nAge Limit: 14 Years & Above\nBilingual Instruction (Kannada & English)\n24-Hour Class Replays & WhatsApp Community",
  zoomLink: "",
  image: "challenge-21",
  status: "open",
  isFeatured: true,
  isActive: true
};

const POSTER_PRESETS = [
  { value: "challenge-21", label: "21-Day Yoga Challenge Poster" },
  { value: "challenge-batch-2", label: "21-Day Transformation Batch 2" },
  { value: "fit-and-flow", label: "Fit & Flow Poster" },
  { value: "online-classes", label: "Online Classes Poster" },
  { value: "temple-meditation", label: "Temple Meditation Visual" },
  { value: "himalaya-peak", label: "Himalaya Sadhana Visual" }
];

export const SpecialEventsPage = () => {
  const {
    specialEvents = [],
    registrations = [],
    createSpecialEventMutation,
    updateSpecialEventMutation,
    deleteSpecialEventMutation,
    showToast
  } = useOutletContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [viewingRosterEvent, setViewingRosterEvent] = useState(null);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEditModal = (ev) => {
    setEditingId(ev._id);
    setForm({
      title: ev.title || "",
      titleKn: ev.titleKn || "",
      badge: ev.badge || "SPECIAL BATCH · LIMITED SEATS",
      eventDateLabel: ev.eventDateLabel || "",
      startDate: ev.startDate ? new Date(ev.startDate).toISOString().slice(0, 10) : "",
      endDate: ev.endDate ? new Date(ev.endDate).toISOString().slice(0, 10) : "",
      duration: ev.duration || "21 Days · 60 Mins Daily",
      ageLimit: ev.ageLimit || "",
      accessLabel: ev.accessLabel || "Live Zoom Classes",
      memberPrice: ev.memberPrice ?? 0,
      memberPriceLabel: ev.memberPriceLabel || "YouTube Members",
      paymentNote:
        ev.paymentNote ||
        "One-time payment for whole 21 days (Zoom live class + WhatsApp group access)",
      timingSlot: ev.timingSlot || "",
      slotsText: Array.isArray(ev.slots) && ev.slots.length > 0 ? ev.slots.join(", ") : ev.timingSlot || "",
      price: ev.price ?? 699,
      originalPrice: ev.originalPrice ?? 0,
      capacity: ev.capacity ?? 50,
      instructorName: ev.instructorName || "Sushii",
      description: ev.description || "",
      descriptionKn: ev.descriptionKn || "",
      highlightsText: Array.isArray(ev.highlights) ? ev.highlights.join("\n") : "",
      zoomLink: ev.zoomLink || "",
      image: ev.image || "challenge-21",
      status: ev.status || "open",
      isFeatured: Boolean(ev.isFeatured),
      isActive: ev.isActive !== false
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const parsedSlots = form.slotsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: form.title.trim(),
      titleKn: form.titleKn.trim() || form.title.trim(),
      badge: form.badge.trim(),
      eventDateLabel: form.eventDateLabel.trim(),
      startDate: form.startDate || new Date().toISOString().slice(0, 10),
      endDate: form.endDate || undefined,
      duration: form.duration.trim(),
      ageLimit: form.ageLimit.trim(),
      accessLabel: form.accessLabel.trim() || "Live Zoom Classes",
      memberPrice: Math.max(0, Number(form.memberPrice) || 0),
      memberPriceLabel: form.memberPriceLabel.trim() || "YouTube Members",
      paymentNote: form.paymentNote.trim(),
      timingSlot: parsedSlots[0] || form.timingSlot.trim(),
      slots: parsedSlots.length > 0 ? parsedSlots : [form.timingSlot.trim()],
      price: Number(form.price),
      originalPrice: Number(form.originalPrice) || 0,
      capacity: Number(form.capacity) || 50,
      instructorName: form.instructorName.trim() || "Sushii",
      description: form.description.trim(),
      descriptionKn: form.descriptionKn.trim() || form.description.trim(),
      highlights: form.highlightsText
        .split("\n")
        .map((h) => h.trim())
        .filter(Boolean),
      zoomLink: form.zoomLink.trim(),
      image: form.image.trim() || "challenge-21",
      status: form.status,
      isFeatured: Boolean(form.isFeatured),
      isActive: Boolean(form.isActive)
    };

    if (editingId) {
      updateSpecialEventMutation.mutate(
        { id: editingId, data: payload },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            showToast(`Special Event "${payload.title}" updated successfully!`);
          },
          onError: (err) => showToast(err.message || "Failed to update special event")
        }
      );
    } else {
      createSpecialEventMutation.mutate(payload, {
        onSuccess: () => {
          setIsModalOpen(false);
          showToast(`Special Event "${payload.title}" published to storefront!`);
        },
        onError: (err) => showToast(err.message || "Failed to create special event")
      });
    }
  };

  const handleDelete = (ev) => {
    if (!window.confirm(`Delete or deactivate "${ev.title} · ${ev.eventDateLabel}"?`)) return;
    deleteSpecialEventMutation.mutate(ev._id, {
      onSuccess: () => showToast(`Special Event "${ev.title}" removed/deactivated.`),
      onError: (err) => showToast(err.message || "Failed to delete special event")
    });
  };

  const getEventParticipants = (ev) => {
    return registrations.filter(
      (r) =>
        (r.specialEventId && String(r.specialEventId) === String(ev._id)) ||
        (r.registrationType === "special_event" && r.workshopId === ev.slug)
    );
  };

  const isSaving = createSpecialEventMutation.isPending || updateSpecialEventMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1C3325]">
            Special Events &amp; Challenge Batches
          </h2>
          <p className="text-[13px] text-[#5C665F]">
            Launch special batches like &ldquo;21 Days Yoga Challenge · 30th November&rdquo;, set custom fees, and track instant Razorpay registrations.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-[#1C3325] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-[#2D4A37] transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Create Special Event</span>
        </button>
      </div>

      {/* Special Events Grid */}
      {specialEvents.length === 0 ? (
        <div className="rounded-2xl border border-[#E2DDD2] bg-white p-10 text-center space-y-3">
          <span className="material-symbols-outlined text-[40px] text-[#C26D38]">celebration</span>
          <h3 className="text-lg font-bold text-[#1C3325]">No Special Events Yet</h3>
          <p className="text-[13px] text-[#5C665F] max-w-md mx-auto">
            Create your first special event or challenge batch so visitors can register and pay directly on the homepage.
          </p>
          <button
            onClick={openCreateModal}
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-[#1C3325] px-5 py-2.5 text-[13px] font-bold text-white cursor-pointer"
          >
            <span>+ Create Special Event</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {specialEvents.map((ev) => {
            const participants = getEventParticipants(ev);
            const paidParticipants = participants.filter((p) => p.paymentStatus === "completed");
            const paidCount = Math.max(ev.enrolledCount || 0, paidParticipants.length);
            const revenue = paidParticipants.reduce((sum, p) => sum + (p.amount || 0), 0);
            const occupancyPct = Math.min(100, Math.round((paidCount / (ev.capacity || 50)) * 100));

            return (
              <div
                key={ev._id}
                className="rounded-2xl border border-[#E2DDD2] bg-white p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3D6] text-[#9E4E20] text-[10.5px] font-extrabold uppercase tracking-wider">
                          {ev.eventDateLabel}
                        </span>
                        <span
                          className={`badge text-[10.5px] ${
                            ev.isActive && ev.status === "open"
                              ? "badge-success"
                              : ev.status === "full"
                                ? "badge-warning"
                                : "badge-neutral"
                          }`}
                        >
                          {ev.isActive ? ev.status.toUpperCase() : "HIDDEN"}
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold text-[#1C3325] leading-snug">
                        {ev.title}
                      </h3>
                      <p className="text-[12px] text-[#5C665F]">
                        {ev.duration} · Instructor: <strong className="text-[#1C3325]">{ev.instructorName}</strong>
                        {ev.ageLimit && (
                          <>
                            {" "}· Age: <strong className="text-[#1C3325]">{ev.ageLimit}</strong>
                          </>
                        )}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#52796F] block">
                        {ev.accessLabel || "Zoom Live"}
                      </span>
                      <span className="text-2xl font-black text-[#1C3325] tabular-nums block leading-none">
                        ₹{ev.price}
                      </span>
                      {ev.originalPrice > ev.price && (
                        <span className="text-[11px] text-[#5C665F] line-through tabular-nums">
                          ₹{ev.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* YouTube Members Discounted Tier */}
                  {ev.memberPrice > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3D6]/70 border border-[#D48C46]/25 text-[11px] font-bold text-[#9E4E20]">
                        {ev.memberPriceLabel || "YouTube Members"}: ₹{ev.memberPrice}
                      </span>
                    </div>
                  )}

                  {/* Slots */}
                  <div className="flex flex-wrap gap-1.5">
                    {(ev.slots?.length ? ev.slots : [ev.timingSlot]).map((slot) => (
                      <span
                        key={slot}
                        className="px-2.5 py-1 rounded-lg bg-[#F6F4ED] border border-[#E2DDD2] text-[11.5px] font-semibold text-[#1C3325]"
                      >
                        ⏰ {slot}
                      </span>
                    ))}
                  </div>

                  {/* Enrollment Progress */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="font-semibold text-[#5C665F]">
                        Paid Registrations:{" "}
                        <strong className="text-[#1C3325]">
                          {paidCount} / {ev.capacity}
                        </strong>
                      </span>
                      <span className="font-bold text-[#0E6848]">
                        Revenue: ₹{revenue.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#EDE8DE] overflow-hidden">
                      <div
                        className="h-full bg-[#1C3325] rounded-full transition-all"
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="pt-3 border-t border-[#E2DDD2] flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setViewingRosterEvent({ ...ev, participants })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E6F0EB] text-[#1C3325] hover:bg-[#1C3325] hover:text-white text-[12px] font-bold transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">groups</span>
                    <span>View Roster ({participants.length})</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(ev)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E2DDD2] bg-white hover:bg-[#FAF8F2] text-[#1C3325] text-[12px] font-bold cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">edit</span>
                      <span>Edit Fee / Details</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(ev)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-[12px] font-bold cursor-pointer"
                      title="Delete or Deactivate"
                    >
                      <span className="material-symbols-outlined text-[15px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-[#FDFBF7] rounded-3xl border border-[#E2DDD2] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E2DDD2]">
              <div>
                <h3 className="text-lg font-extrabold text-[#1C3325]">
                  {editingId ? "Edit Special Event" : "Create Special Event / Batch"}
                </h3>
                <p className="text-[12px] text-[#5C665F]">
                  Users will see this prominently and pay the exact registration fee set below via Razorpay.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#EDE8DE] text-[#1C3325] flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11.5px] font-bold text-[#1C3325] mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. 21 Days Yoga Challenge"
                    className="input-text"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] font-bold text-[#1C3325] mb-1">
                    Kannada Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.titleKn}
                    onChange={(e) => setForm({ ...form, titleKn: e.target.value })}
                    placeholder="e.g. 21 ದಿನಗಳ ಯೋಗ ಚಾಲೆಂಜ್"
                    className="input-text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[11.5px] font-bold text-[#1C3325] mb-1">
                    Date Label *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.eventDateLabel}
                    onChange={(e) => setForm({ ...form, eventDateLabel: e.target.value })}
                    placeholder="e.g. 30th November"
                    className="input-text"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] font-bold text-[#1C3325] mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="input-text"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] font-bold text-[#1C3325] mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="21 Days · 60 Mins Daily"
                    className="input-text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[11.5px] font-bold text-[#1C3325] mb-1">
                    Zoom Live Fee (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="input-text font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] font-bold text-[#1C3325] mb-1">
                    Original Price (₹, optional)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                    className="input-text"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] font-bold text-[#1C3325] mb-1">
                    Max Seats (Capacity) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    className="input-text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[11.5px] font-bold text-[#1C3325] mb-1">
                    Age Limit
                  </label>
                  <input
                    type="text"
                    value={form.ageLimit}
                    onChange={(e) => setForm({ ...form, ageLimit: e.target.value })}
                    placeholder="e.g. 14 years & above"
                    className="input-text"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] font-bold text-[#1C3325] mb-1">
                    YouTube Members Fee (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.memberPrice}
                    onChange={(e) => setForm({ ...form, memberPrice: e.target.value })}
                    placeholder="549"
                    className="input-text font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] font-bold text-[#1C3325] mb-1">
                    Payment Note
                  </label>
                  <input
                    type="text"
                    value={form.paymentNote}
                    onChange={(e) => setForm({ ...form, paymentNote: e.target.value })}
                    placeholder="One-time payment for whole 21 days..."
                    className="input-text"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11.5px] font-bold text-[#1C3325] mb-1">
                  Timing Slot(s) (comma-separated for multiple choices) *
                </label>
                <input
                  type="text"
                  required
                  value={form.slotsText}
                  onChange={(e) => setForm({ ...form, slotsText: e.target.value })}
                  placeholder="6:00 AM – 7:00 AM IST, 6:30 PM – 7:30 PM IST"
                  className="input-text"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-bold text-[#1C3325] mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the special batch transformation, daily schedule, and who it's for..."
                  className="input-text"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-bold text-[#1C3325] mb-1">
                  Highlights / Perks (one per line)
                </label>
                <textarea
                  rows={3}
                  value={form.highlightsText}
                  onChange={(e) => setForm({ ...form, highlightsText: e.target.value })}
                  className="input-text"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[11.5px] font-bold text-[#1C3325] mb-1">
                    Poster Image Preset
                  </label>
                  <select
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="input-text"
                  >
                    {POSTER_PRESETS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11.5px] font-bold text-[#1C3325] mb-1">
                    Instructor
                  </label>
                  <input
                    type="text"
                    value={form.instructorName}
                    onChange={(e) => setForm({ ...form, instructorName: e.target.value })}
                    className="input-text"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] font-bold text-[#1C3325] mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="input-text"
                  >
                    <option value="open">Open for Registration</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="full">Full / Sold Out</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center">
                <div>
                  <label className="block text-[11.5px] font-bold text-[#1C3325] mb-1">
                    Private Zoom Link (Admin Only)
                  </label>
                  <input
                    type="text"
                    value={form.zoomLink}
                    onChange={(e) => setForm({ ...form, zoomLink: e.target.value })}
                    placeholder="https://zoom.us/j/..."
                    className="input-text"
                  />
                </div>
                <div className="flex items-center gap-5 pt-4">
                  <label className="flex items-center gap-2 text-[12.5px] font-bold text-[#1C3325] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="w-4 h-4 accent-[#1C3325]"
                    />
                    <span>Show on Website</span>
                  </label>
                  <label className="flex items-center gap-2 text-[12.5px] font-bold text-[#1C3325] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                      className="w-4 h-4 accent-[#1C3325]"
                    />
                    <span>Featured</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2DDD2] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-[#EDE8DE] text-[#1C3325] font-bold text-[13px] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-full bg-[#1C3325] hover:bg-[#2D4A37] text-white font-bold text-[13px] shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : editingId ? "Save Changes" : "Publish Special Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Participants Roster Modal */}
      {viewingRosterEvent && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setViewingRosterEvent(null)}
        >
          <div
            className="w-full max-w-3xl bg-[#FDFBF7] rounded-3xl border border-[#E2DDD2] shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E2DDD2]">
              <div>
                <h3 className="text-lg font-extrabold text-[#1C3325]">
                  {viewingRosterEvent.title} · {viewingRosterEvent.eventDateLabel}
                </h3>
                <p className="text-[12px] text-[#5C665F]">
                  Registered participants ({viewingRosterEvent.participants.length})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingRosterEvent(null)}
                className="w-8 h-8 rounded-full bg-[#EDE8DE] text-[#1C3325] flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {viewingRosterEvent.participants.length === 0 ? (
                <p className="text-center py-10 text-[#5C665F] text-[13.5px]">
                  No registrations recorded for this special event yet.
                </p>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Participant</th>
                        <th>WhatsApp</th>
                        <th>Slot</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewingRosterEvent.participants.map((p) => (
                        <tr key={p._id || p.bookingId}>
                          <td className="font-mono font-bold text-[12px]">{p.bookingId}</td>
                          <td>
                            <div className="font-bold text-[#1C3325]">{p.fullName}</div>
                            <div className="text-[11px] text-[#5C665F]">{p.email}</div>
                          </td>
                          <td>
                            <a
                              href={`https://wa.me/91${String(p.whatsapp || "").replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(
                                `Namaskara ${p.fullName}! Welcome to ${viewingRosterEvent.title} (${viewingRosterEvent.eventDateLabel}).`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#0E6848] font-semibold text-[12px] hover:underline"
                            >
                              +91 {String(p.whatsapp || "").slice(-10)}
                            </a>
                          </td>
                          <td className="text-[12px] font-medium">{p.slot}</td>
                          <td className="font-bold">₹{p.amount}</td>
                          <td>
                            <span
                              className={`badge ${
                                p.paymentStatus === "completed" ? "badge-success" : "badge-warning"
                              }`}
                            >
                              {(p.paymentStatus || "pending").toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


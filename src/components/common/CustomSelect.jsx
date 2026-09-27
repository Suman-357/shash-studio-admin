import React, { useState, useRef, useEffect } from "react";

/**
 * Modern CustomSelect Component
 * Replaces generic OS browser selects with a polished, accessible design.
 * Features:
 * - Rich items with emoji/icons & Kannada secondary badges
 * - Smooth chevron animation
 * - Emerald selected indicator with checkmark
 * - Click-outside dismissal
 * - Compatible with standard form event patterns (onChange(value) or onChange({ target: { value } }))
 */
export const CustomSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option...",
  className = "",
  disabled = false,
  id
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Normalize options to { value, label, labelKn, emoji, icon, subtitle }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === "string") {
      return { value: opt, label: opt };
    }
    return {
      value: opt.value ?? opt.slug ?? opt.id,
      label: opt.label ?? opt.name,
      labelKn: opt.labelKn ?? opt.nameKn,
      emoji: opt.emoji,
      icon: opt.icon,
      subtitle: opt.subtitle ?? opt.tagline
    };
  });

  const selectedOption = normalizedOptions.find((opt) => String(opt.value) === String(value));

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  // Handle item selection
  const handleSelect = (optValue) => {
    if (disabled) return;
    setIsOpen(false);
    if (onChange) {
      // Support both event-style (e.target.value) and direct value callbacks
      onChange({ target: { value: optValue, name: id } });
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 bg-white border rounded-xl text-left text-[13.5px] transition-all duration-200 cursor-pointer ${
          isOpen
            ? "border-[#1C3325] ring-3 ring-[#1C3325]/12 shadow-sm"
            : "border-[#D8D2C5] hover:border-[#1C3325] hover:bg-[#FAF8F2]/60"
        } ${disabled ? "opacity-60 cursor-not-allowed bg-neutral-100" : ""}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {selectedOption ? (
            <>
              {selectedOption.emoji && (
                <span className="text-[17px] shrink-0 leading-none">{selectedOption.emoji}</span>
              )}
              {selectedOption.icon && !selectedOption.emoji && (
                <span className="material-symbols-outlined text-[18px] text-[#2D4A37] shrink-0">
                  {selectedOption.icon}
                </span>
              )}
              <div className="truncate flex items-center gap-2">
                <span className="font-semibold text-[#1C3325] truncate">
                  {selectedOption.label}
                </span>
                {selectedOption.labelKn && (
                  <span className="text-[11.5px] font-normal text-[#5C665F] truncate">
                    ({selectedOption.labelKn})
                  </span>
                )}
              </div>
            </>
          ) : (
            <span className="text-[#8E9991] font-normal">{placeholder}</span>
          )}
        </div>

        {/* Custom Chevron Indicator */}
        <span
          className={`material-symbols-outlined text-[20px] text-[#5C665F] shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#1C3325]" : ""
          }`}
        >
          expand_more
        </span>
      </button>

      {/* Modern Floating Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl bg-white/98 backdrop-blur-md border border-[#E2DDD2] shadow-xl shadow-[#1C3325]/12 p-1.5 max-h-64 overflow-y-auto space-y-1 animate-in fade-in zoom-in-95 duration-150">
          {normalizedOptions.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 text-[13px] ${
                  isSelected
                    ? "bg-[#E7F3EC] text-[#1C3325] font-semibold border-l-3 border-[#1C3325]"
                    : "text-[#3D4740] hover:bg-[#F3EFE6] hover:text-[#131A15]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {opt.emoji && (
                    <span className="text-[16px] shrink-0 leading-none">{opt.emoji}</span>
                  )}
                  {opt.icon && !opt.emoji && (
                    <span className={`material-symbols-outlined text-[17px] shrink-0 ${isSelected ? "text-[#1C3325]" : "text-[#5C665F]"}`}>
                      {opt.icon}
                    </span>
                  )}
                  <div className="truncate">
                    <span className="block truncate font-medium">{opt.label}</span>
                    {opt.labelKn && (
                      <span className="block text-[11px] text-[#5C665F] font-normal truncate mt-0.5">
                        {opt.labelKn}
                      </span>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <span className="material-symbols-outlined text-[17px] text-[#0E6848] shrink-0 font-bold">
                    check
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

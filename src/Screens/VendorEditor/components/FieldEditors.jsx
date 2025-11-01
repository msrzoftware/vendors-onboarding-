import React, { memo } from "react";

export const TextArea = memo(
  React.forwardRef(({ value, onChange, rows = 3 }, ref) => (
    <textarea
      ref={ref}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full px-4 py-3 rounded-lg border border-(--border-light-gray) text-[0.95em] leading-relaxed font-inherit resize-y outline-none transition-colors duration-200 focus:border-blue-400"
    />
  ))
);

export const UrlInput = memo(
  React.forwardRef(({ value, onChange, placeholder }, ref) => (
    <div className="relative">
      <input
        ref={ref}
        type="url"
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-3.5 py-3 rounded-lg border border-gray-300 text-[0.95em] transition-colors duration-200 outline-none focus:border-blue-400"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[1.1em] select-none">
        🔗
      </span>
    </div>
  ))
);

export default { TextArea, UrlInput };

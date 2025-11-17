import React, { memo } from "react";

export const TextArea = memo(
  React.forwardRef(({ value, onChange, rows = 3, ...rest }, ref) => (
    <textarea
      ref={ref}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      {...rest}
      className="w-full px-4 py-3 rounded-lg border border-(--border-light-gray) text-xs leading-relaxed font-inherit resize-y outline-none transition-colors duration-200 focus:border-[var(--dark-sapphire)] focus:outline-none"
    />
  ))
);

export const UrlInput = memo(
  React.forwardRef(({ value, onChange, placeholder, ...rest }, ref) => (
    <div className="relative">
      <input
        ref={ref}
        type="url"
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
        className="w-full pl-9 pr-3.5 py-3 mb-3 rounded-lg border border-gray-300 text-xs text-(--dark-gray) transition-colors duration-200 outline-none focus:border-[var(--dark-sapphire)] focus:outline-none"
      />
      <span
        className="absolute left-3 top-1/2 -translate-y-[100%] flex items-center justify-center text-gray-500 text-xs leading-none select-none"
        aria-hidden="true"
      >
        🔗
      </span>
    </div>
  ))
);

export default { TextArea, UrlInput };

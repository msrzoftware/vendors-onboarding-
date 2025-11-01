import { ChevronDown } from "lucide-react";
import React, { memo, useState } from "react";

const CollapsibleSection = memo(
  ({ title, children, defaultExpanded = false, expanded, onToggle }) => {
    const isControlled = typeof expanded === "boolean";
    const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
    const isExpanded = isControlled ? expanded : internalExpanded;

    const toggle = () => {
      if (isControlled) {
        onToggle && onToggle(!expanded);
      } else {
        setInternalExpanded((s) => !s);
      }
    };

    return (
      <div className="mb-5 border border-(--border-light-gray) rounded-xl overflow-hidden bg-white">
        <button
          onClick={toggle}
          className={`w-full text-left px-5 py-4 border-b flex justify-between items-center transition-colors duration-200 cursor-pointer ${
            isExpanded
              ? "bg-gray-50 border-b border-gray-200"
              : "bg-white border-b-0"
          }`}
        >
          <span className="font-semibold text-[1.05em] text-gray-800">
            {title}
          </span>
          <span
            className={`text-gray-500 transform transition-transform duration-200 ${
              isExpanded ? "rotate-180" : "rotate-0"
            }`}
          >
            <ChevronDown className="text-[#575757]" />
          </span>
        </button>

        {isExpanded && <div className="p-4 bg-white">{children}</div>}
      </div>
    );
  }
);

export default CollapsibleSection;

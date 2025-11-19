import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { LS_KEY, FIELD_GROUPS, prettifyKey, SECTIONS } from "./utils";
import { AlertCircle } from "lucide-react";
import Header from "./Header";
import MainEditor from "./MainEditor";

const VendorEditor = ({ setStep }) => {
  // (removed debug useEffect that referenced variables before declaration)
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [origWrapped, setOrigWrapped] = useState(false);
  const [origWasArray, setOrigWasArray] = useState(true);
  const [showEmptyPanel, setShowEmptyPanel] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [expandedSections, setExpandedSections] = useState(() =>
    Object.fromEntries(
      Object.entries(FIELD_GROUPS).map(([k, v]) => [k, v.expanded || false])
    )
  );

  // refs for section containers of the first vendor (used for navigating to empty fields)
  const sectionRefs = useRef({});

  useEffect(() => loadVendors(), []);

  const emptyFieldsCount = useMemo(() => {
    // Recursive counter scoped inside useMemo to avoid changing dependencies
    const count = (val, isRequiredArray = false) => {
      // Handle null/undefined/empty string
      if (val === null || val === undefined || val === "") {
        return 1;
      }

      // Handle arrays
      if (Array.isArray(val)) {
        // Only count empty arrays if they're required to have items
        if (val.length === 0 && isRequiredArray) {
          return 1;
        }
        // For non-empty arrays, check each item
        return val.reduce((s, it) => s + count(it, false), 0);
      }

      // Handle objects
      if (typeof val === "object") {
        const excludes = [
          "id",
          "_id",
          "created_at",
          "updated_at",
          "success",
          "error",
          "meta_keys",
        ];

        // Filter out meta fields and get valid entries
        const entries = Object.entries(val).filter(
          ([k]) => !k.startsWith("_") && !excludes.includes(k)
        );

        // Special handling for specific fields that require array values
        const requiresArray = ["description", "features", "pricing_plans"];
        return entries.reduce((s, [k, v]) => {
          const isRequiredArray = requiresArray.includes(k);
          return s + count(v, isRequiredArray);
        }, 0);
      }

      // Non-empty primitive values are not counted
      return 0;
    };

    if (!vendors || vendors.length === 0) return 0;

    // Only count fields that are actually defined in FIELD_GROUPS
    const allFields = new Set(
      Object.values(FIELD_GROUPS).flatMap((group) => group.fields)
    );

    return vendors.reduce((sum, vendor) => {
      let vendorCount = 0;
      for (const field of allFields) {
        if (Object.prototype.hasOwnProperty.call(vendor, field)) {
          vendorCount += count(
            vendor[field],
            ["description", "features", "pricing_plans"].includes(field)
          );
        }
      }
      return sum + vendorCount;
    }, 0);
  }, [vendors]);

  // Precompute detailed empty fields data for each section
  const emptyFieldsData = useMemo(() => {
    if (!vendors || vendors.length === 0) return {};
    const vendor = vendors[0];

    // collect empty leaf paths for a value
    const excludes = [
      "id",
      "_id",
      "created_at",
      "updated_at",
      "success",
      "error",
      "meta_keys",
    ];

    const collectEmptyLeaves = (val, path = []) => {
      const leaves = [];
      if (val === null || val === undefined || val === "") {
        leaves.push({
          path,
          label: prettifyKey(String(path[path.length - 1] || "")),
        });
        return leaves;
      }
      if (Array.isArray(val)) {
        if (val.length === 0) {
          leaves.push({
            path,
            label: prettifyKey(String(path[path.length - 1] || "")),
          });
          return leaves;
        }
        val.forEach((it, idx) => {
          leaves.push(...collectEmptyLeaves(it, [...path, idx]));
        });
        return leaves;
      }
      if (typeof val === "object") {
        const entries = Object.entries(val).filter(
          ([k]) => !k.startsWith("_") && !excludes.includes(k)
        );
        if (entries.length === 0) {
          leaves.push({
            path,
            label: prettifyKey(String(path[path.length - 1] || "")),
          });
          return leaves;
        }
        entries.forEach(([k, v]) => {
          leaves.push(...collectEmptyLeaves(v, [...path, k]));
        });
        return leaves;
      }
      // non-empty primitive
      return leaves;
    };

    const formatLabelForPath = (path) => {
      if (!Array.isArray(path) || path.length === 0) return "";

      const toFriendly = (segment, idx) => {
        if (typeof segment === "number") {
          const prev = path[idx - 1];
          if (typeof prev === "string") {
            const prevLabel = prettifyKey(prev);
            const singular =
              prevLabel.endsWith("s") && prevLabel.length > 1
                ? prevLabel.slice(0, -1)
                : prevLabel;
            return `${singular} ${segment + 1}`;
          }
          return `Item ${segment + 1}`;
        }
        return prettifyKey(String(segment));
      };

      const last = path[path.length - 1];
      const baseLabel =
        typeof last === "number"
          ? `Item ${Number(last) + 1}`
          : prettifyKey(String(last));

      if (path.length === 1) return baseLabel;

      const context = path
        .slice(0, -1)
        .map((segment, idx) => toFriendly(segment, idx))
        .filter(Boolean)
        .join(" · ");

      return context ? `${baseLabel} · ${context}` : baseLabel;
    };

    const aggregated = {};
    const fieldCapturedSections = {};
    Object.entries(FIELD_GROUPS).forEach(([sectionKey, { fields }]) => {
      fields.forEach((f) => {
        if (!Object.prototype.hasOwnProperty.call(vendor, f)) return;
        const val = vendor[f];
        const leaves = collectEmptyLeaves(val, [f]);
        leaves.forEach((leaf) => {
          if (!fieldCapturedSections[f]) fieldCapturedSections[f] = sectionKey;
          const targetSection = fieldCapturedSections[f] || sectionKey;
          if (!aggregated[targetSection]) aggregated[targetSection] = [];
          aggregated[targetSection].push({
            path: leaf.path,
            label: formatLabelForPath(leaf.path),
          });
        });
      });
    });

    const result = {};
    Object.entries(FIELD_GROUPS).forEach(([sectionKey, { title }]) => {
      const items = aggregated[sectionKey];
      if (items && items.length > 0) {
        result[sectionKey] = { title, fields: items };
      }
    });

    return result;
  }, [vendors]);

  const handleFieldClick = useCallback(
    (sectionKey, path) => {
      // Expand the section
      setExpandedSections((prev) => ({
        ...prev,
        [sectionKey]: true,
      }));

      // Use setTimeout to ensure the section is expanded before scrolling
      setTimeout(() => {
        // if a specific path is provided, try to find an element with matching data-field-id
        let el;
        if (Array.isArray(path) && path.length > 0) {
          const id = path.join("|");
          el = document.querySelector(`[data-field-id="${id}"]`);
        }
        // fallback to section container
        if (!el) el = sectionRefs.current?.[sectionKey];
        if (!el) return;

        // find nearest scrollable ancestor
        let container = el.parentElement;
        while (container && container !== document.body) {
          const style = window.getComputedStyle(container);
          const overflowY = style.overflowY;
          if (overflowY === "auto" || overflowY === "scroll") break;
          container = container.parentElement;
        }

        const headerEl = document.querySelector(".sticky");
        const headerHeight = headerEl
          ? headerEl.getBoundingClientRect().height
          : 80;

        if (container && container !== document.body) {
          // scroll inside the container
          const containerRect = container.getBoundingClientRect();
          const elRect = el.getBoundingClientRect();
          const offset =
            elRect.top - containerRect.top + container.scrollTop - headerHeight;
          container.scrollTo({ top: offset, behavior: "smooth" });
        } else {
          // fallback to window scroll
          const elementPosition =
            window.pageYOffset + el.getBoundingClientRect().top;
          window.scrollTo({
            top: elementPosition - headerHeight,
            behavior: "smooth",
          });
        }

        // Find and highlight the field container and its input
        let fieldContainerEl;
        if (Array.isArray(path) && path.length > 0) {
          const selector = `[data-field-id="${path.join("|")}"]`;
          fieldContainerEl =
            document.querySelector(`${selector}[data-array-wrapper="true"]`) ||
            document.querySelector(selector);
        }

        if (!fieldContainerEl) {
          fieldContainerEl =
            el.querySelector("[data-array-wrapper='true']") ||
            el.querySelector("[data-field-id]") ||
            el
              .querySelector("input, textarea, select")
              ?.closest("[data-field-id]");
        }

        if (fieldContainerEl) {
          try {
            // If the container is itself an input/textarea/select, highlight it directly.
            const isInputElement =
              fieldContainerEl instanceof Element &&
              fieldContainerEl.matches &&
              fieldContainerEl.matches("input, textarea, select");

            let targetEl = null;
            if (isInputElement) {
              targetEl = fieldContainerEl;
            } else {
              // Prefer highlighting the actual input inside the container if present
              targetEl =
                fieldContainerEl.querySelector("input, textarea, select") ||
                fieldContainerEl;
            }

            targetEl.classList.add("highlight-empty-field");
            setTimeout(
              () => targetEl.classList.remove("highlight-empty-field"),
              2000
            );
          } catch {
            // Fallback: add class to the container
            fieldContainerEl.classList.add("highlight-empty-field");
            setTimeout(
              () => fieldContainerEl.classList.remove("highlight-empty-field"),
              2000
            );
          }
        }
      }, 120);
    },
    [setExpandedSections, sectionRefs]
  );

  // Auto-highlight all empty fields in Basic Information on user's first visit (session-based)
  useEffect(() => {
    const seenKey = "vendoreditor_auto_highlight_done";
    if (sessionStorage.getItem(seenKey)) return;
    if (loading) return;
    try {
      const basic = emptyFieldsData?.[SECTIONS.BASIC];
      if (basic && Array.isArray(basic.fields) && basic.fields.length > 0) {
        // Ensure section is expanded so fields are in the DOM
        setExpandedSections((prev) => ({ ...prev, [SECTIONS.BASIC]: true }));

        // Scroll to the first empty field to give context
        const first = basic.fields[0];
        if (first && first.path) {
          handleFieldClick(SECTIONS.BASIC, first.path);
        }

        // After a short delay (allow DOM to render), highlight all empty fields
        setTimeout(() => {
          basic.fields.forEach((item) => {
            const id = Array.isArray(item.path)
              ? item.path.join("|")
              : String(item.path);
            let el = document.querySelector(`[data-field-id="${id}"]`);
            if (!el) {
              const sectionEl = sectionRefs.current?.[SECTIONS.BASIC];
              if (sectionEl) {
                el =
                  sectionEl.querySelector(`[data-field-id="${id}"]`) ||
                  sectionEl;
              }
            }
            if (!el) return;

            const target =
              (el.querySelector &&
                (el.querySelector("input, textarea, select") || el)) ||
              el;
            try {
              target.classList.add("highlight-empty-field");
              setTimeout(
                () => target.classList.remove("highlight-empty-field"),
                2000
              );
            } catch {
              // ignore
            }
          });
          sessionStorage.setItem(seenKey, "1");
        }, 220);
      }
    } catch {
      // ignore
    }
  }, [emptyFieldsData, loading, handleFieldClick, setExpandedSections]);

  function loadVendors() {
    setLoading(true);
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (!stored) {
        setVendors([]);
        setMessage("No vendor data found");
      } else {
        const data = JSON.parse(stored);
        const vendorsData = data && data.success ? data.data : data;
        setOrigWrapped(!!(data && data.success));
        setOrigWasArray(Array.isArray(vendorsData));
        setVendors(Array.isArray(vendorsData) ? vendorsData : [vendorsData]);
        setMessage("");
      }
    } catch (err) {
      setVendors([]);
      setMessage("Failed to load vendor data: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function saveVendors() {
    try {
      const dataToStore = origWasArray ? vendors : vendors[0];
      if (origWrapped) {
        localStorage.setItem(
          LS_KEY,
          JSON.stringify({ success: true, data: dataToStore })
        );
      } else {
        localStorage.setItem(LS_KEY, JSON.stringify(dataToStore));
      }
      setMessage("Saved successfully");
      const timer = setTimeout(() => {
        setMessage("");
        setStep(4);
      }, 3200);
      return () => clearTimeout(timer);
    } catch (err) {
      setMessage("Error saving: " + err.message);
    }
  }

  function updateField(vendorIndex, path, value) {
    setVendors((current) => {
      const updated = JSON.parse(JSON.stringify(current));
      let target = updated[vendorIndex];
      const pathArray = Array.isArray(path) ? path : [path];
      for (let i = 0; i < pathArray.length - 1; i++) {
        const k = pathArray[i];
        if (target[k] === undefined || target[k] === null)
          target[k] = typeof pathArray[i + 1] === "number" ? [] : {};
        target = target[k];
      }
      const last = pathArray[pathArray.length - 1];
      target[last] = value;
      return updated;
    });
  }

  const companyName =
    vendors[0]?.company_name || vendors[0]?.product_name || "Company Profile";
  const productName =
    vendors[0]?.productName || vendors[0]?.product_name || "Product Details";
  const companyDesc =
    vendors[0]?.description || vendors[0]?.product_description_short || "";

  return (
    <div className="min-h-screen backdrop-blur-sm overflow-auto mt-6 pb-10">
      <style>{`
        @keyframes highlightField {
          0%, 100% {
            box-shadow: 0 0 0 2px transparent;
            background-color: transparent;
          }
          50% {
            box-shadow: 0 0 0 2px rgba(248, 113, 113, 1);
            background-color: rgba(248, 113, 113, 0.06);
          }
        }
        /* Apply animation when the class is added to the input itself or to its container */
        .highlight-empty-field,
        .highlight-empty-field input,
        .highlight-empty-field textarea,
        .highlight-empty-field select,
        input.highlight-empty-field,
        textarea.highlight-empty-field,
        select.highlight-empty-field {
          animation: highlightField 2s ease-in-out;
          border-radius: 6px;
        }
        .highlight-empty-cta {
          animation: highlightField 2s ease-in-out;
          border-radius: 6px;
        }
      `}</style>
      {/* Header Section (extracted) */}
      <Header
        message={message}
        setShowLeaveConfirm={setShowLeaveConfirm}
        expandedSections={expandedSections}
        setExpandedSections={setExpandedSections}
        emptyFieldsCount={emptyFieldsCount}
        showEmptyPanel={showEmptyPanel}
        setShowEmptyPanel={setShowEmptyPanel}
        loadVendors={loadVendors}
        onSave={saveVendors}
        productName={productName}
        companyName={companyName}
        companyDesc={companyDesc}
      />

      {/* Main Content and Side Panel (extracted) */}
      <MainEditor
        loading={loading}
        vendors={vendors}
        FIELD_GROUPS={FIELD_GROUPS}
        emptyFieldsData={emptyFieldsData}
        sectionRefs={sectionRefs}
        expandedSections={expandedSections}
        setExpandedSections={setExpandedSections}
        updateField={updateField}
        handleFieldClick={handleFieldClick}
        showEmptyPanel={showEmptyPanel}
        setShowEmptyPanel={setShowEmptyPanel}
        SECTIONS={SECTIONS}
        prettifyKey={prettifyKey}
      />

      {/* Empty fields panel is now rendered inside MainEditor to preserve horizontal layout */}

      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-xl space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-(--dark-blue)">
                Leave editor?
              </h3>
              <p className="mt-2 text-sm text-(--dark-gray)">
                You will lose your progress. Are you sure you want to go back?
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  localStorage.removeItem(LS_KEY);
                  ["currentJobId", "jobStartTime", "jobUrl"].forEach((key) =>
                    localStorage.removeItem(key)
                  );
                  setShowLeaveConfirm(false);
                  setStep(0);
                }}
                className="btn-blue flex-1 text-nowrap"
              >
                Yes, start over
              </button>
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="flex-1 rounded-lg border border-(--border-light-gray) px-4 py-2 text-(--dark-blue) text-nowrap transition hover:bg-gray-50"
              >
                No, keep editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorEditor;

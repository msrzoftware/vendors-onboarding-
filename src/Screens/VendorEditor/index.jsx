import React, { useEffect, useState, useMemo, useRef } from "react";
import CollapsibleSection from "../VendorEditor/components/CollapsibleSection";
import FieldRenderer from "../VendorEditor/components/FieldRenderer";
import { LS_KEY, FIELD_GROUPS, prettifyKey, SECTIONS } from "./utils";
import {
  ArrowLeft,
  Box,
  X,
  AlertCircle,
  ListChecks,
  PanelRightClose,
} from "lucide-react";

const VendorEditor = ({ setStep }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [origWrapped, setOrigWrapped] = useState(false);
  const [origWasArray, setOrigWasArray] = useState(true);
  const [showEmptyPanel, setShowEmptyPanel] = useState(false);
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
      Object.values(FIELD_GROUPS).flatMap(group => group.fields)
    );

    return vendors.reduce((sum, vendor) => {
      let vendorCount = 0;
      for (const field of allFields) {
        if (Object.prototype.hasOwnProperty.call(vendor, field)) {
          vendorCount += count(vendor[field], ["description", "features", "pricing_plans"].includes(field));
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
      // prefer last key as label; if contains numeric indices, show path context
      const last = path[path.length - 1];
      const keyLabel = prettifyKey(String(last));
      if (path.length <= 1) return keyLabel;
      // show parent context for disambiguation (e.g., pricing_plans → Plan 1)
      const parent = path
        .slice(0, -1)
        .map((p) => String(p))
        .join(" › ");
      return `${keyLabel} (${parent})`;
    };

    const result = {};
    Object.entries(FIELD_GROUPS).forEach(([sectionKey, { title, fields }]) => {
      const items = [];
      fields.forEach((f) => {
        if (!Object.prototype.hasOwnProperty.call(vendor, f)) return;
        const val = vendor[f];
        const leaves = collectEmptyLeaves(val, [f]);
        leaves.forEach((leaf) => {
          items.push({ path: leaf.path, label: formatLabelForPath(leaf.path) });
        });
      });
      if (items.length > 0) result[sectionKey] = { title, fields: items };
    });

    return result;
  }, [vendors]);

  const handleFieldClick = (sectionKey, path) => {
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

      // optional: highlight the exact target if available, otherwise the first input inside the section
      const fieldEl =
        Array.isArray(path) && path.length > 0
          ? document.querySelector(`[data-field-id="${path.join("|")}"]`) ||
            el.querySelector("[data-field-id]")
          : el.querySelector("[data-field-id]") ||
            el.querySelector("input, textarea, select");
      if (fieldEl) {
        fieldEl.classList.add("highlight-empty-field");
        setTimeout(
          () => fieldEl.classList.remove("highlight-empty-field"),
          2000
        );
      }
    }, 120);
  };

  const EmptyFieldsPanel = () => {
    // Panel rendered inline as right column; visibility controlled by showEmptyPanel
    const panelClass = showEmptyPanel ? "block" : "hidden";
    return (
      <div
        className={`${panelClass} h-full bg-white rounded-xl border border-(--border-light-gray) overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-(--border-light-gray) flex justify-between items-center bg-white">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Empty Fields
            </h3>
            <button
              onClick={() => setShowEmptyPanel(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4  [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {Object.keys(emptyFieldsData).length === 0 ? (
              <div className="text-sm text-gray-500">No empty fields</div>
            ) : (
              Object.entries(emptyFieldsData).map(
                ([sectionKey, { title, fields }]) => (
                  <div key={sectionKey} className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      {title}
                    </h4>
                    <div className="space-y-2">
                      {fields.map(({ path, label }) => {
                        const id = path.join("|");
                        return (
                          <button
                            key={id}
                            onClick={() => handleFieldClick(sectionKey, path)}
                            className="w-full text-left p-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
                          >
                            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>
    );
  };

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

  // const companyName =
  //   vendors[0]?.company_name || vendors[0]?.product_name || "Company Profile";
  const productName =
    vendors[0]?.productName || vendors[0]?.product_name || "Product Details";
  const companyDesc =
    vendors[0]?.description || vendors[0]?.product_description_short || "";

  return (
    <div className="min-h-screen backdrop-blur-sm overflow-auto mt-6 pb-10">
      <style>{`\n        @keyframes highlightField {\n          0%, 100% { box-shadow: 0 0 0 2px transparent; }\n          50% { box-shadow: 0 0 0 2px rgba(248, 113, 113, 1); }\n        }\n        .highlight-empty-field {\n          animation: highlightField 2s ease-in-out;\n          background-color: rgba(248, 113, 113, 0.06);\n          border-radius: 6px;\n        }\n      `}</style>
      {/* Header Section */}
      <div className="text-[var-(--dark-gray)] sticky top-0 left-0 z-50 bg-white/95 backdrop-blur-sm py-3">
        {/* Animated Message */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            message
              ? "opacity-100 max-h-20 translate-y-0"
              : "opacity-0 max-h-0 -translate-y-3"
          }`}
        >
          {message && (
            <div
              className={`px-5 py-3 mb-6 rounded-lg border shadow-sm ${
                message.includes("Error")
                  ? "bg-red-100 border-red-300 text-red-700"
                  : "bg-green-100 border-green-300 text-green-700"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        <div className="max-w-[1200px] mx-auto justify-between items-start gap-5">
          <div className="w-full ml-auto mb-2.5 flex items-center justify-start gap-5">
            {/* three buttons - left */}
            <div className="w-fit mr-auto flex items-center gap-4">
              {/* Go Back */}
              <button
                onClick={() => setStep(1)}
                className="group text-sm inline-flex items-center gap-1 text-(--dark-blue) hover:font-medium hover:underline cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                Go Back
              </button>

              {/* Expand All */}
              <button
                onClick={() =>
                  setExpandedSections(
                    Object.fromEntries(
                      Object.keys(expandedSections).map((k) => [k, true])
                    )
                  )
                }
                className="text-sm font-light text-(--deep-blue) hover:underline transition-colors"
              >
                Expand All
              </button>

              {/* Collapse All */}
              <button
                onClick={() =>
                  setExpandedSections(
                    Object.fromEntries(
                      Object.keys(expandedSections).map((k) => [k, false])
                    )
                  )
                }
                className="text-sm font-light text-(--deep-blue) hover:underline transition-colors"
              >
                Collapse All
              </button>
            </div>
            {/* Empty fields count badge (click to navigate through empty sections) */}
            <button
              onClick={() => setShowEmptyPanel((prev) => !prev)}
              className={`ml-2 text-nowrap flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors
    ${
      showEmptyPanel
        ? "border-gray-200 text-gray-700 hover:bg-gray-50"
        : "border-yellow-200 text-yellow-700 hover:bg-yellow-50"
    }`}
              aria-label={
                showEmptyPanel ? "Hide empty fields" : "Show empty fields"
              }
              title={
                emptyFieldsCount > 0
                  ? `${emptyFieldsCount} empty field(s) — click to view details`
                  : "No empty fields"
              }
            >
              {!showEmptyPanel ? (
                <>
                  <ListChecks className="w-4 h-4 text-yellow-600" />
                  <span>
                    {emptyFieldsCount} empty{" "}
                    {emptyFieldsCount === 1 ? "field" : "fields"}
                  </span>
                </>
              ) : (
                <>
                  <PanelRightClose className="w-4 h-4 text-gray-600" />
                  <span>Hide empty fields</span>
                </>
              )}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="flex items-center gap-2 my-1.5 text-2xl text-(--dark-gray) font-semibold">
                <Box className="w-6 h-6" /> {productName}
              </h1>
              {companyDesc && (
                <p className="max-w-2xl mb-2.5 text-sm leading-relaxed">
                  {companyDesc}
                </p>
              )}
            </div>
            <div className="flex gap-3 self-center">
              {/* <button
                className="px-4 py-2 border border-white/20 bg-transparent cursor-pointer hover:bg-gray-100/65 rounded-lg transition"
                onClick={() => setStep(1)}
              >
                Back
              </button> */}
              <button
                onClick={loadVendors}
                className="px-5 py-2 border border-white/20 bg-transparent cursor-pointer hover:bg-gray-100/65 rounded-lg transition"
              >
                Reset All
              </button>
              <button
                onClick={() => emptyFieldsCount === 0 && saveVendors()}
                disabled={emptyFieldsCount > 0}
                className={`cta btn-blue ${
                  emptyFieldsCount > 0
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                title={
                  emptyFieldsCount > 0
                    ? `${emptyFieldsCount} empty field(s) must be filled before continuing`
                    : "Save and continue"
                }
              >
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content and Side Panel */}
      <div className="max-w-[1200px] mx-auto flex gap-6">
        <div className="flex-1 h-fit overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Loading vendor data...
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No vendors found.
            </div>
          ) : (
            vendors.map((vendor, vendorIndex) => (
              <React.Fragment key={vendorIndex}>
                {/* Vendor Card */}
                <div className="h-[calc(100dvh-260px)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {Object.entries(FIELD_GROUPS).map(
                    ([sectionKey, { title, fields }]) => {
                      const sectionFields = fields.filter((f) =>
                        Object.prototype.hasOwnProperty.call(vendor, f)
                      );
                      if (sectionFields.length === 0) return null;

                      return (
                        <div
                          key={sectionKey}
                          ref={(el) => {
                            if (vendorIndex === 0)
                              sectionRefs.current[sectionKey] = el;
                          }}
                        >
                          <CollapsibleSection
                            title={title}
                            expanded={expandedSections[sectionKey]}
                            onToggle={(next) =>
                              setExpandedSections((prev) => ({
                                ...prev,
                                [sectionKey]: next,
                              }))
                            }
                          >
                            {sectionKey === SECTIONS.BASIC ? (
                              // BASIC SECTION
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {sectionFields.map((field) => (
                                  <div
                                    key={field}
                                    data-field-id={field}
                                    className="flex flex-col gap-1.5"
                                  >
                                    <label className="text-[13px] text-(--dark-blue)">
                                      {prettifyKey(field)}
                                    </label>
                                    <FieldRenderer
                                      field={field}
                                      value={vendor[field]}
                                      path={[field]}
                                      onChange={(val) =>
                                        updateField(vendorIndex, [field], val)
                                      }
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : sectionKey === SECTIONS.REVIEWS ? (
                              // REVIEWS SECTION
                              <div className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Strengths */}
                                  <div className="flex flex-col gap-2">
                                    <label className="block text-[13px] text-(--dark-blue) mb-2">
                                      Strengths
                                    </label>
                                    <div className="flex flex-col gap-2">
                                      <button
                                        onClick={() => {
                                          // Initialize reviews object if it doesn't exist
                                          if (!vendor.reviews) {
                                            updateField(vendorIndex, ["reviews"], {
                                              strengths: [],
                                              weaknesses: [],
                                              overall_rating: null,
                                              review_sources: []
                                            });
                                          }
                                          const current = vendor.reviews?.strengths || [];
                                          updateField(
                                            vendorIndex,
                                            ["reviews", "strengths"],
                                            [...current, ""]
                                          );
                                        }}
                                        className="w-full px-3 py-2 rounded border border-dashed text-sm text-gray-700"
                                      >
                                        + Add reviews.strengths
                                      </button>
                                      {vendor.reviews?.strengths?.map((strength, idx) => (
                                        <div key={idx} className="flex gap-2">
                                          <input
                                            type="text"
                                            value={strength}
                                            onChange={(e) => {
                                              const newStrengths = [...(vendor.reviews?.strengths || [])];
                                              newStrengths[idx] = e.target.value;
                                              updateField(
                                                vendorIndex,
                                                ["reviews", "strengths"],
                                                newStrengths
                                              );
                                            }}
                                            className="flex-1 px-3 py-2 border rounded"
                                          />
                                          <button
                                            onClick={() => {
                                              const newStrengths = vendor.reviews.strengths.filter((_, i) => i !== idx);
                                              updateField(
                                                vendorIndex,
                                                ["reviews", "strengths"],
                                                newStrengths
                                              );
                                            }}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                                          >
                                            <X className="w-5 h-5" />
                                          </button>
                                        </div>
                                      ))}
                                      <button
                                        onClick={() => {
                                          const current = vendor.reviews_strengths || [];
                                          updateField(
                                            vendorIndex,
                                            ["reviews_strengths"],
                                            [...current, ""]
                                          );
                                        }}
                                        className="w-full px-3 py-2 rounded border border-dashed text-sm text-gray-700"
                                      >
                                        + Add reviews_strengths
                                      </button>
                                      {vendor.reviews_strengths?.map((strength, idx) => (
                                        <div key={idx} className="flex gap-2">
                                          <input
                                            type="text"
                                            value={strength}
                                            onChange={(e) => {
                                              const newStrengths = [...(vendor.reviews_strengths || [])];
                                              newStrengths[idx] = e.target.value;
                                              updateField(
                                                vendorIndex,
                                                ["reviews_strengths"],
                                                newStrengths
                                              );
                                            }}
                                            className="flex-1 px-3 py-2 border rounded"
                                          />
                                          <button
                                            onClick={() => {
                                              const newStrengths = vendor.reviews_strengths.filter((_, i) => i !== idx);
                                              updateField(
                                                vendorIndex,
                                                ["reviews_strengths"],
                                                newStrengths
                                              );
                                            }}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                                          >
                                            <X className="w-5 h-5" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Weaknesses */}
                                  <div className="flex flex-col gap-2">
                                    <label className="block text-[13px] text-(--dark-blue) mb-2">
                                      Weaknesses
                                    </label>
                                    <div className="flex flex-col gap-2">
                                      <button
                                        onClick={() => {
                                          // Initialize reviews object if it doesn't exist
                                          if (!vendor.reviews) {
                                            updateField(vendorIndex, ["reviews"], {
                                              strengths: [],
                                              weaknesses: [],
                                              overall_rating: null,
                                              review_sources: []
                                            });
                                          }
                                          const current = vendor.reviews?.weaknesses || [];
                                          updateField(
                                            vendorIndex,
                                            ["reviews", "weaknesses"],
                                            [...current, ""]
                                          );
                                        }}
                                        className="w-full px-3 py-2 rounded border border-dashed text-sm text-gray-700"
                                      >
                                        + Add reviews.weaknesses
                                      </button>
                                      {vendor.reviews?.weaknesses?.map((weakness, idx) => (
                                        <div key={idx} className="flex gap-2">
                                          <input
                                            type="text"
                                            value={weakness}
                                            onChange={(e) => {
                                              const newWeaknesses = [...(vendor.reviews?.weaknesses || [])];
                                              newWeaknesses[idx] = e.target.value;
                                              updateField(
                                                vendorIndex,
                                                ["reviews", "weaknesses"],
                                                newWeaknesses
                                              );
                                            }}
                                            className="flex-1 px-3 py-2 border rounded"
                                          />
                                          <button
                                            onClick={() => {
                                              const newWeaknesses = vendor.reviews.weaknesses.filter((_, i) => i !== idx);
                                              updateField(
                                                vendorIndex,
                                                ["reviews", "weaknesses"],
                                                newWeaknesses
                                              );
                                            }}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                                          >
                                            <X className="w-5 h-5" />
                                          </button>
                                        </div>
                                      ))}
                                      <button
                                        onClick={() => {
                                          const current = vendor.reviews_weakness || [];
                                          updateField(
                                            vendorIndex,
                                            ["reviews_weakness"],
                                            [...current, ""]
                                          );
                                        }}
                                        className="w-full px-3 py-2 rounded border border-dashed text-sm text-gray-700"
                                      >
                                        + Add reviews_weakness
                                      </button>
                                      {vendor.reviews_weakness?.map((weakness, idx) => (
                                        <div key={idx} className="flex gap-2">
                                          <input
                                            type="text"
                                            value={weakness}
                                            onChange={(e) => {
                                              const newWeaknesses = [...(vendor.reviews_weakness || [])];
                                              newWeaknesses[idx] = e.target.value;
                                              updateField(
                                                vendorIndex,
                                                ["reviews_weakness"],
                                                newWeaknesses
                                              );
                                            }}
                                            className="flex-1 px-3 py-2 border rounded"
                                          />
                                          <button
                                            onClick={() => {
                                              const newWeaknesses = vendor.reviews_weakness.filter((_, i) => i !== idx);
                                              updateField(
                                                vendorIndex,
                                                ["reviews_weakness"],
                                                newWeaknesses
                                              );
                                            }}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                                          >
                                            <X className="w-5 h-5" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* Rating */}
                                <div>
                                  <label className="block text-[13px] text-(--dark-blue) mb-2">
                                    Overall Rating
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    value={vendor.reviews?.overall_rating || ""}
                                    onChange={(e) => {
                                      // Initialize reviews object if it doesn't exist
                                      if (!vendor.reviews) {
                                        updateField(vendorIndex, ["reviews"], {
                                          strengths: [],
                                          weaknesses: [],
                                          overall_rating: null,
                                          review_sources: []
                                        });
                                      }
                                      const val = e.target.value === "" ? null : Number(e.target.value);
                                      updateField(
                                        vendorIndex,
                                        ["reviews", "overall_rating"],
                                        val
                                      );
                                    }}
                                    className="px-3 py-2 border rounded w-32"
                                    placeholder="Rating (0-5)"
                                  />
                                </div>

                                {/* Review Sources */}
                                <div className="flex flex-col gap-2">
                                  <label className="block text-[13px] text-(--dark-blue) mb-2">
                                    Review Sources
                                  </label>
                                  <div className="flex flex-col gap-2">
                                    <button
                                      onClick={() => {
                                        // Initialize reviews object if it doesn't exist
                                        if (!vendor.reviews) {
                                          updateField(vendorIndex, ["reviews"], {
                                            strengths: [],
                                            weaknesses: [],
                                            overall_rating: null,
                                            review_sources: []
                                          });
                                        }
                                        const current = vendor.reviews?.review_sources || [];
                                        updateField(
                                          vendorIndex,
                                          ["reviews", "review_sources"],
                                          [...current, ""]
                                        );
                                      }}
                                      className="w-full px-3 py-2 rounded border border-dashed text-sm text-gray-700"
                                    >
                                      + Add review source
                                    </button>
                                    {vendor.reviews?.review_sources?.map((source, idx) => (
                                      <div key={idx} className="flex gap-2">
                                        <input
                                          type="text"
                                          value={source}
                                          onChange={(e) => {
                                            const newSources = [...(vendor.reviews?.review_sources || [])];
                                            newSources[idx] = e.target.value;
                                            updateField(
                                              vendorIndex,
                                              ["reviews", "review_sources"],
                                              newSources
                                            );
                                          }}
                                          className="flex-1 px-3 py-2 border rounded"
                                        />
                                        <button
                                          onClick={() => {
                                            const newSources = vendor.reviews.review_sources.filter((_, i) => i !== idx);
                                            updateField(
                                              vendorIndex,
                                              ["reviews", "review_sources"],
                                              newSources
                                            );
                                          }}
                                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                                        >
                                          <X className="w-5 h-5" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ) : sectionKey === SECTIONS.PRICING ? (
                              // PRICING SECTION
                              <div className="flex flex-col gap-6">
                                {/* Normal Pricing Fields */}
                                {sectionFields
                                  .filter(
                                    (f) =>
                                      !(
                                        vendor[f] &&
                                        typeof vendor[f] === "object" &&
                                        Array.isArray(vendor[f].pricing_plans)
                                      )
                                  )
                                  .map((field) => (
                                    <div key={field} data-field-id={field}>
                                      <label className="block text-[13px] text-(--dark-blue) mb-2">
                                        {prettifyKey(field)}
                                      </label>
                                      <FieldRenderer
                                        field={field}
                                        value={vendor[field]}
                                        path={[field]}
                                        onChange={(val2) =>
                                          updateField(
                                            vendorIndex,
                                            [field],
                                            val2
                                          )
                                        }
                                      />
                                    </div>
                                  ))}

                                {/* Pricing Plans Grid */}
                                {sectionFields.map((field) => {
                                  const val = vendor[field];
                                  if (
                                    val &&
                                    typeof val === "object" &&
                                    Array.isArray(val.pricing_plans)
                                  ) {
                                    const plans = val.pricing_plans;
                                    return (
                                      <div key={field}>
                                        <label className="block text-[13px] text-(--dark-blue) mb-2">
                                          {prettifyKey(field)}
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          {plans.map((plan, pIdx) => (
                                            <div
                                              key={pIdx}
                                              data-field-id={[
                                                field,
                                                "pricing_plans",
                                                pIdx,
                                              ].join("|")}
                                              className="p-4 rounded-md border-2 border-(--border-light-gray) bg-white"
                                            >
                                              <div className="flex justify-between items-start mb-3">
                                                <strong className="text-sm">
                                                  {plan.plan ||
                                                    plan.name ||
                                                    `Plan ${pIdx + 1}`}
                                                </strong>
                                                <button
                                                  onClick={() =>
                                                    updateField(
                                                      vendorIndex,
                                                      [field, "pricing_plans"],
                                                      plans.filter(
                                                        (_, i) => i !== pIdx
                                                      )
                                                    )
                                                  }
                                                  title="Remove plan"
                                                  className="cursor-pointer"
                                                >
                                                  <X className="min-w-[18px] text-(--ruby-red)" />
                                                </button>
                                              </div>

                                              <div className="flex flex-col gap-2">
                                                {Object.entries(plan).map(
                                                  ([k, v]) => (
                                                    <div
                                                      key={k}
                                                      data-field-id={[
                                                        field,
                                                        "pricing_plans",
                                                        pIdx,
                                                        k,
                                                      ].join("|")}
                                                    >
                                                      <label className="block text-[12px] text-(--dark-blue) mb-1">
                                                        {prettifyKey(k)}
                                                      </label>
                                                      <FieldRenderer
                                                        field={k}
                                                        value={v}
                                                        path={[
                                                          field,
                                                          "pricing_plans",
                                                          pIdx,
                                                          k,
                                                        ]}
                                                        onChange={(childVal) =>
                                                          updateField(
                                                            vendorIndex,
                                                            [
                                                              field,
                                                              "pricing_plans",
                                                              pIdx,
                                                              k,
                                                            ],
                                                            childVal
                                                          )
                                                        }
                                                      />
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          ))}
                                        </div>

                                        <div className="flex items-center mt-4">
                                          <button
                                            onClick={() =>
                                              updateField(
                                                vendorIndex,
                                                [field, "pricing_plans"],
                                                [
                                                  ...plans,
                                                  {
                                                    plan: "",
                                                    entity: "",
                                                    amount: "",
                                                    currency: "",
                                                    period: "",
                                                    description: [],
                                                    is_free: false,
                                                  },
                                                ]
                                              )
                                            }
                                            className="w-full px-3 py-2 rounded border border-dashed text-sm text-gray-700"
                                          >
                                            + Add plan
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            ) : sectionKey === SECTIONS.COMPANY ? (
                              // COMPANY INFORMATION SECTION
                              <div className="flex flex-col gap-4">
                                {sectionFields.map((field) => (
                                  <div key={field} data-field-id={field}>
                                    <label
                                      className={`block text-[13px] mb-1.5 ${
                                        field === "company_info" ||
                                        field === "social_links" ||
                                        field === "social_profiles"
                                          ? "text-(--dark-blue)"
                                          : "text-(--dark-gray)"
                                      }`}
                                    >
                                      {prettifyKey(field)}
                                    </label>
                                    <FieldRenderer
                                      field={field}
                                      value={vendor[field]}
                                      path={[field]}
                                      onChange={(val2) =>
                                        updateField(vendorIndex, [field], val2)
                                      }
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              // OTHER SECTIONS
                              <div className="flex flex-col gap-4">
                                {sectionFields.map((field) => (
                                  <div key={field} data-field-id={field}>
                                    <label className="block text-[13px] text-(--dark-blue) mb-1.5">
                                      {prettifyKey(field)}
                                    </label>
                                    <FieldRenderer
                                      field={field}
                                      value={vendor[field]}
                                      path={[field]}
                                      onChange={(val2) =>
                                        updateField(vendorIndex, [field], val2)
                                      }
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </CollapsibleSection>
                        </div>
                      );
                    }
                  )}
                </div>
              </React.Fragment>
            ))
          )}
        </div>

        {showEmptyPanel && (
          <div className="w-72 min-w-[220px] h-[calc(100dvh-245px)] sticky top-24 self-start">
            <EmptyFieldsPanel />
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorEditor;

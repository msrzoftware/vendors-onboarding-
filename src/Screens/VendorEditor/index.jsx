import React, { useEffect, useState } from "react";
import CollapsibleSection from "../VendorEditor/components/CollapsibleSection";
import FieldRenderer from "../VendorEditor/components/FieldRenderer";
import { LS_KEY, FIELD_GROUPS, prettifyKey, SECTIONS } from "./utils";
import { ArrowLeft, Box, X } from "lucide-react";

const VendorEditor = ({ setStep }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [origWrapped, setOrigWrapped] = useState(false);
  const [origWasArray, setOrigWasArray] = useState(true);
  const [expandedSections, setExpandedSections] = useState(() =>
    Object.fromEntries(
      Object.entries(FIELD_GROUPS).map(([k, v]) => [k, v.expanded || false])
    )
  );

  useEffect(() => loadVendors(), []);

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
    <div className="min-h-screen backdrop-blur-sm overflow-auto mx-auto max-w-[1200px] mt-6 pb-10">
      {/* Header Section */}
      <div className="text-[var-(--dark-gray)] my-3">
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

        <div className="max-w-[1200px] mx-auto flex justify-between items-start gap-5">
          <div>
            <div className="w-fit ml-auto mb-2.5 inline-flex items-center justify-start gap-5">
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

            <h1 className="flex items-center gap-2 my-1.5 text-2xl font-semibold">
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
              onClick={saveVendors}
              className="cta btn-blue cursor-pointer"
            >
              Save & Continue
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-fit overflow-auto max-w-[1200px] mx-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
              {/* <div className="max-h-[calc(100dvh-295px)] group bg-white rounded-lg border border-gray-200 py-6 px-4 mb-6 z-10 flex flex-col"> */}
              <div className="h-[calc(100dvh-260px)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {Object.entries(FIELD_GROUPS).map(
                  ([sectionKey, { title, fields }]) => {
                    const sectionFields = fields.filter((f) =>
                      Object.prototype.hasOwnProperty.call(vendor, f)
                    );
                    if (sectionFields.length === 0) return null;

                    return (
                      <CollapsibleSection
                        key={sectionKey}
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
                                className="flex flex-col gap-1.5"
                              >
                                <label className="text-[13px] text-(--dark-gray)">
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
                                <div key={field}>
                                  <label className="block text-[13px] text-gray-700 mb-2">
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
                                    <label className="block text-[13px] text-gray-700 mb-2">
                                      {prettifyKey(field)}
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {plans.map((plan, pIdx) => (
                                        <div
                                          key={pIdx}
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
                                                <div key={k}>
                                                  <label className="block text-[12px] text-gray-600 mb-1">
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

                                      <div className="flex items-center">
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
                                          className="px-3 py-2 rounded border border-dashed text-sm text-gray-700"
                                        >
                                          + Add plan
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        ) : (
                          // OTHER SECTIONS
                          <div className="flex flex-col gap-4">
                            {sectionFields.map((field) => (
                              <div key={field}>
                                <label className="block text-[13px] text-gray-700 mb-1.5">
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
                    );
                  }
                )}
              </div>
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};

export default VendorEditor;

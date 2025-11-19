import React from "react";
import CollapsibleSection from "./components/CollapsibleSection";
import FieldRenderer from "./components/FieldRenderer";
import { X } from "lucide-react";
import EmptyFieldsPanel from "./EmptyFieldsPanel";

export default function MainEditor({
  loading,
  vendors,
  FIELD_GROUPS,
  emptyFieldsData,
  sectionRefs,
  expandedSections,
  setExpandedSections,
  updateField,
  handleFieldClick,
  showEmptyPanel,
  setShowEmptyPanel,
  SECTIONS,
  prettifyKey,
}) {
  return (
    <div className="max-w-[1200px] mx-auto flex gap-6">
      <div className="flex-1 h-fit overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading vendor data...</div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No vendors found.</div>
        ) : (
          vendors.map((vendor, vendorIndex) => (
            <React.Fragment key={vendorIndex}>
              <div className="h-[calc(100dvh-185px)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {Object.entries(FIELD_GROUPS).map(
                  ([sectionKey, { title: sectionTitle, fields }]) => {
                    const sectionFields = fields.filter((f) =>
                      Object.prototype.hasOwnProperty.call(vendor, f)
                    );
                    if (sectionFields.length === 0) return null;

                    const emptyCount =
                      emptyFieldsData[sectionKey]?.fields?.length ?? 0;
                    const badgeText = `${emptyCount} empty ${
                      emptyCount === 1 ? "field" : "fields"
                    }`;
                    const badgeTone =
                      emptyCount === 0
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : emptyCount <= 5
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-red-50 text-red-700 border border-red-200";

                    return (
                      <div
                        key={sectionKey}
                        ref={(el) => {
                          if (vendorIndex === 0)
                            sectionRefs.current[sectionKey] = el;
                        }}
                      >
                        <CollapsibleSection
                          title={
                            <span className="flex items-center gap-3">
                              <span>{sectionTitle}</span>
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${badgeTone}`}
                              >
                                {badgeText}
                              </span>
                            </span>
                          }
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
                                  <label className="text-[14px] text-(--dark-gray) font-semibold">
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
                                  <label className="block text-[14px] text-(--dark-gray) font-semibold mb-2">
                                    Strengths
                                  </label>
                                  <div className="flex flex-col gap-2">
                                    <button
                                      onClick={() => {
                                        if (!vendor.reviews) {
                                          updateField(
                                            vendorIndex,
                                            ["reviews"],
                                            {
                                              strengths: [],
                                              weaknesses: [],
                                              overall_rating: null,
                                              review_sources: [],
                                            }
                                          );
                                        }
                                        const current = vendor.reviews?.strengths || [];
                                        updateField(
                                          vendorIndex,
                                          ["reviews", "strengths"],
                                          [...current, ""]
                                        );
                                      }}
                                      className="w-full px-3 py-2 rounded border text-sm text-gray-700"
                                    >
                                      + Add reviews.strengths
                                    </button>
                                    {vendor.reviews?.strengths?.map((strength, idx) => (
                                      <div key={idx} className="flex gap-2">
                                        <input
                                          type="text"
                                          value={strength}
                                          onChange={(e) => {
                                            const newStrengths = [
                                              ...(vendor.reviews?.strengths || []),
                                            ];
                                            newStrengths[idx] = e.target.value;
                                            updateField(vendorIndex, ["reviews", "strengths"], newStrengths);
                                          }}
                                          className="flex-1 px-3 py-2 border rounded"
                                        />
                                        <button
                                          onClick={() => {
                                            const newStrengths = vendor.reviews.strengths.filter((_, i) => i !== idx);
                                            updateField(vendorIndex, ["reviews", "strengths"], newStrengths);
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
                                        updateField(vendorIndex, ["reviews_strengths"], [...current, ""]);
                                      }}
                                      className="w-full px-3 py-2 rounded border text-sm text-gray-700"
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
                                            updateField(vendorIndex, ["reviews_strengths"], newStrengths);
                                          }}
                                          className="flex-1 px-3 py-2 border rounded"
                                        />
                                        <button
                                          onClick={() => {
                                            const newStrengths = vendor.reviews_strengths.filter((_, i) => i !== idx);
                                            updateField(vendorIndex, ["reviews_strengths"], newStrengths);
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
                                  <label className="block text-[14px] text-(--dark-gray) font-semibold mb-2">Weaknesses</label>
                                  <div className="flex flex-col gap-2">
                                    <button
                                      onClick={() => {
                                        if (!vendor.reviews) {
                                          updateField(vendorIndex, ["reviews"], {
                                            strengths: [],
                                            weaknesses: [],
                                            overall_rating: null,
                                            review_sources: [],
                                          });
                                        }
                                        const current = vendor.reviews?.weaknesses || [];
                                        updateField(vendorIndex, ["reviews", "weaknesses"], [...current, ""]);
                                      }}
                                      className="w-full px-3 py-2 rounded border text-sm text-gray-700"
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
                                            updateField(vendorIndex, ["reviews", "weaknesses"], newWeaknesses);
                                          }}
                                          className="flex-1 px-3 py-2 border rounded"
                                        />
                                        <button
                                          onClick={() => {
                                            const newWeaknesses = vendor.reviews.weaknesses.filter((_, i) => i !== idx);
                                            updateField(vendorIndex, ["reviews", "weaknesses"], newWeaknesses);
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
                                        updateField(vendorIndex, ["reviews_weakness"], [...current, ""]);
                                      }}
                                      className="w-full px-3 py-2 rounded border text-sm text-gray-700"
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
                                            updateField(vendorIndex, ["reviews_weakness"], newWeaknesses);
                                          }}
                                          className="flex-1 px-3 py-2 border rounded"
                                        />
                                        <button
                                          onClick={() => {
                                            const newWeaknesses = vendor.reviews_weakness.filter((_, i) => i !== idx);
                                            updateField(vendorIndex, ["reviews_weakness"], newWeaknesses);
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
                                <label className="block text-[14px] text-(--dark-gray) font-semibold mb-2">Overall Rating</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="5"
                                  step="0.1"
                                  value={vendor.reviews?.overall_rating || ""}
                                  onChange={(e) => {
                                    if (!vendor.reviews) {
                                      updateField(vendorIndex, ["reviews"], { strengths: [], weaknesses: [], overall_rating: null, review_sources: [] });
                                    }
                                    const val = e.target.value === "" ? null : Number(e.target.value);
                                    updateField(vendorIndex, ["reviews", "overall_rating"], val);
                                  }}
                                  className="px-3 py-2 border rounded w-32"
                                  placeholder="Rating (0-5)"
                                />
                              </div>

                              {/* Review Sources */}
                              <div className="flex flex-col gap-2">
                                <label className="block text-[14px] text-(--dark-gray) font-semibold mb-2">Review Sources</label>
                                <div className="flex flex-col gap-2">
                                  <button
                                    onClick={() => {
                                      if (!vendor.reviews) {
                                        updateField(vendorIndex, ["reviews"], { strengths: [], weaknesses: [], overall_rating: null, review_sources: [] });
                                      }
                                      const current = vendor.reviews?.review_sources || [];
                                      updateField(vendorIndex, ["reviews", "review_sources"], [...current, ""]);
                                    }}
                                    className="w-full px-3 py-2 rounded border text-sm text-gray-700"
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
                                          updateField(vendorIndex, ["reviews", "review_sources"], newSources);
                                        }}
                                        className="flex-1 px-3 py-2 border rounded"
                                      />
                                      <button
                                        onClick={() => {
                                          const newSources = vendor.reviews.review_sources.filter((_, i) => i !== idx);
                                          updateField(vendorIndex, ["reviews", "review_sources"], newSources);
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
                                .filter((f) => !(vendor[f] && typeof vendor[f] === "object" && Array.isArray(vendor[f].pricing_plans)))
                                .map((field) => (
                                  <div key={field} data-field-id={field}>
                                    <label className="block text-[14px] text-(--dark-gray) font-semibold mb-2">{prettifyKey(field)}</label>
                                    <FieldRenderer field={field} value={vendor[field]} path={[field]} onChange={(val2) => updateField(vendorIndex, [field], val2)} />
                                  </div>
                                ))}

                              {/* Pricing Plans Grid */}
                              {sectionFields.map((field) => {
                                const val = vendor[field];
                                if (val && typeof val === "object" && Array.isArray(val.pricing_plans)) {
                                  const plans = val.pricing_plans;
                                  return (
                                    <div key={field}>
                                      <label className="block text-[14px] text-(--dark-gray) font-semibold mb-2">{prettifyKey(field)}</label>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {plans.map((plan, pIdx) => (
                                          <div key={pIdx} data-field-id={[field, "pricing_plans", pIdx].join("|")} className="p-4 rounded-md border-2 border-(--border-light-gray) bg-white">
                                            <div className="flex justify-between items-start mb-3">
                                              <strong className="text-[16px]">{plan.plan || plan.name || `Plan ${pIdx + 1}`}</strong>
                                              <button onClick={() => updateField(vendorIndex, [field, "pricing_plans"], plans.filter((_, i) => i !== pIdx))} title="Remove plan" className="cursor-pointer">
                                                <X className="min-w-[18px] text-(--ruby-red)" />
                                              </button>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                              {Object.entries(plan).map(([k, v]) => (
                                                <div key={k} data-field-id={[field, "pricing_plans", pIdx, k].join("|")}>
                                                  <label className="block text-sm text-(--dark-gray) font-semibold mb-1">{prettifyKey(k)}</label>
                                                  <FieldRenderer field={k} value={v} path={[field, "pricing_plans", pIdx, k]} onChange={(childVal) => updateField(vendorIndex, [field, "pricing_plans", pIdx, k], childVal)} />
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        ))}
                                      </div>

                                      <div className="flex items-center mt-4">
                                        <button onClick={() => updateField(vendorIndex, [field, "pricing_plans"], [...plans, { plan: "", entity: "", amount: "", currency: "", period: "", description: [], is_free: false }])} className="w-full cta btn-blue">
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
                                  <label className={`block text-sm font-semibold mb-1.5 ${field === "company_info" || field === "social_links" || field === "social_profiles" ? "text-(--dark-gray)" : "text-(--dark-gray)"}`}>
                                    {prettifyKey(field)}
                                  </label>
                                  <FieldRenderer field={field} value={vendor[field]} path={[field]} onChange={(val2) => updateField(vendorIndex, [field], val2)} />
                                </div>
                              ))}
                            </div>
                          ) : (
                            // OTHER SECTIONS
                            <div className="flex flex-col gap-4">
                              {sectionFields.map((field) => (
                                <div key={field} data-field-id={field}>
                                  <label className="block text-[16px] text-(--dark-gray) font-semibold mb-1.5">{prettifyKey(field)}</label>
                                  <FieldRenderer field={field} value={vendor[field]} path={[field]} onChange={(val2) => updateField(vendorIndex, [field], val2)} />
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
        <div className="w-72 min-w-[220px] h-[calc(100dvh-189px)] sticky top-24 self-start">
          <EmptyFieldsPanel emptyFieldsData={emptyFieldsData} handleFieldClick={handleFieldClick} onClose={() => setShowEmptyPanel(false)} />
        </div>
      )}
    </div>
  );
}

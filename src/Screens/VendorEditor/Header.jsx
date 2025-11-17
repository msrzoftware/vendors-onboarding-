import React from "react";
import {
  ArrowLeft,
  Box,
  Building2,
  ListChecks,
  PanelRightClose,
} from "lucide-react";

export default function Header({
  message,
  setShowLeaveConfirm,
  expandedSections,
  setExpandedSections,
  emptyFieldsCount,
  showEmptyPanel,
  setShowEmptyPanel,
  loadVendors,
  onSave,
  productName,
  companyName,
  companyDesc,
}) {
  return (
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
              onClick={() => setShowLeaveConfirm(true)}
              className="group text-sm inline-flex items-center gap-1 text-(--dark-blue) hover:font-medium hover:underline cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Go Back
            </button>
          </div>
          {/* Expand All */}
          <button
            onClick={() =>
              setExpandedSections(
                Object.fromEntries(
                  Object.keys(expandedSections).map((k) => [k, true])
                )
              )
            }
            className="text-sm font-medium text-(--deep-blue) hover:underline transition-colors"
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
            className="text-sm font-medium text-(--deep-blue) hover:underline transition-colors"
          >
            Collapse All
          </button>

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
            <h2 className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {companyName && (
                <p className="max-w-2xl text-sm leading-relaxed">
                  {companyName}
                </p>
              )}
            </h2>
            {companyDesc && (
              <p className="max-w-2xl mb-2.5 text-sm leading-relaxed">
                {companyDesc}
              </p>
            )}
          </div>
          <div className="flex gap-3 self-center">
            <button
              onClick={loadVendors}
              className="px-5 py-2 border border-white/20 bg-transparent cursor-pointer hover:bg-gray-100/65 rounded-lg transition text-nowrap"
            >
              Reset All
            </button>
            <button
              onClick={onSave}
              disabled={emptyFieldsCount > 0}
              className={`cta btn-blue ${
                emptyFieldsCount > 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title={
                emptyFieldsCount > 0
                  ? `Please fill ${emptyFieldsCount} empty field(s) before saving`
                  : "Save and continue"
              }
            >
              Save & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

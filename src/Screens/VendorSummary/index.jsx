import { Box, Pencil, Check } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import {
  formatTitle,
  isValidObject,
  shouldRenderSection,
  SECTION_LAYOUTS,
  SECTION_PRIORITY,
} from "../../utils/dataRenderers";
import { Card, SectionHeader } from "./ui/SectionRenderers";

// Configuration for special sections and their rendering
const SECTION_CONFIG = {
  features: {
    title: "Key Features",
    icon: Box,
    layout: "grid",
    render: (features) => (
      <div className="grid md:grid-cols-2 gap-3">
        {features.map((feature, i) => (
          <div
            key={i}
            className="group p-3 border border-(--border-light-gray) bg-white rounded-lg transition-all"
          >
            <h4 className="font-semibold text-(--dark-gray) mb-1 group-hover:text-[#1920BA] transition-colors text-sm">
              {feature.name}
            </h4>
            <p className="text-[#3f3f3f] text-xs leading-snug">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    ),
  },
  pricing: {
    title: "Pricing Plans",
    icon: Box,
    layout: "grid",
    render: (pricing) => (
      <>
        {pricing.overview && (
          <p className="text-[#3f3f3f] mb-4 leading-snug text-xs">
            {pricing.overview}
          </p>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {pricing.pricing_plans?.map((plan, i) => (
            <div
              key={i}
              className={`relative shadow rounded-xl py-4 px-3 transition-all ${
                plan.is_free
                  ? "bg-linear-to-br from-[#38c016]/10 to-[#38c016]/5 border-2 border-[#38c016]"
                  : "bg-white border-[#E8EBEB]"
              }`}
            >
              {plan.is_free && (
                <div className="absolute -top-3 right-4 bg-[#38c016] text-white px-3 py-1 rounded-full text-xs font-bold">
                  FREE
                </div>
              )}
              <div className="flex justify-center">
                <h3 className="gradient-text text-lg mb-2 font-semibold">
                  {plan.plan}
                </h3>
              </div>
              <div className="mb-3 flex items-center flex-col gap-1">
                {plan.amount ? (
                  <div>
                    <span className="max-w-full text-3xl text-center font-semibold leading-tight text-[var(--dark-gray)] block break-all whitespace-normal overflow-hidden">
                      ${plan.amount}
                    </span>
                    <span className="text-[#3f3f3f] text-sm">
                      /{plan.entity}
                    </span>
                  </div>
                ) : (
                  <span className="text-lg font-semibold text-[#3f3f3f]">
                    Contact Sales
                  </span>
                )}
              </div>
              {plan.period && (
                <p className="text-xs text-center text-[#3f3f3f] mb-3 pb-3 border-b border-[#E8EBEB]">
                  {plan.period}
                </p>
              )}
              <ul className="space-y-2">
                {plan.description?.map((desc, j) => (
                  <li
                    key={j}
                    className="text-xs text-[#3f3f3f] flex items-start gap-2"
                  >
                    <Check className="w-3.5 h-3.5 text-[#38c016] shrink-0 mt-0.5" />
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </>
    ),
  },
  industry: {
    title: "Industries",
    icon: Box,
    layout: "tags",
    render: (industry) => (
      <div className="flex flex-wrap gap-2">
        {(Array.isArray(industry) ? industry : [industry]).map((ind, i) => (
          <span key={i} className="badge-purple">
            {ind}
          </span>
        ))}
      </div>
    ),
  },
  faq: {
    title: "FAQ",
    icon: Box,
    layout: "list",
  },
};

// Small placeholder component for empty or missing values
const Placeholder = ({ text = "--" }) => (
  <span className="text-sm text-[#9aa0b4]">{text}</span>
);

// Recursively render values: primitives, arrays, and objects
const renderValue = (val) => {
  if (val === null || val === undefined || val === "") return <Placeholder />;

  if (Array.isArray(val)) {
    if (val.length === 0) return <Placeholder />;
    // array of primitives
    if (val.every((it) => typeof it !== "object")) {
      return val.join(", ");
    }

    // array of objects or mixed -> render cards
    return (
      <div className="grid md:grid-cols-2 gap-3">
        {val.map((item, i) => (
          <div
            key={i}
            className="p-3 border border-(--border-light-gray) rounded-lg bg-white"
          >
            {isValidObject(item) ? (
              <div className="space-y-1">
                {Object.entries(item).map(([k, v]) => (
                  <div key={k} className="text-sm">
                    <span className="font-semibold text-[#3f3f3f] mr-2">
                      {formatTitle(k)}:
                    </span>
                    <span className="text-xs text-(--dark-gray) font-light">{renderValue(v)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm">{renderValue(item)}</div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (isValidObject(val)) {
    return (
      <div className="grid gap-3">
        {Object.entries(val).map(([k, v]) => (
          <div key={k} className="flex gap-3 items-start">
            <div className="w-32 md:w-44 text-sm font-semibold text-[#3f3f3f]">
              {formatTitle(k)}
            </div>
            <div className="text-xs text-(--dark-gray) font-light">{renderValue(v)}</div>
          </div>
        ))}
      </div>
    );
  }

  if (typeof val === "boolean") return val ? "Yes" : "No";
  return String(val);
};

// Use shared shouldRenderSection and formatTitle from utils. Render a dynamic section
const renderDynamicSection = (key, value, overrideConfig = {}) => {
  if (!shouldRenderSection(key, value)) return null;

  const config = {
    ...(SECTION_CONFIG[key] || {}),
    ...overrideConfig,
    title:
      overrideConfig.title || SECTION_CONFIG[key]?.title || formatTitle(key),
    layout:
      overrideConfig.layout ||
      SECTION_CONFIG[key]?.layout ||
      SECTION_LAYOUTS.DEFAULT,
  };

  return (
    <Card key={key} className="mb-4">
      <SectionHeader title={config.title} icon={config.icon} />
      {config.render ? (
        config.render(value)
      ) : isValidObject(value) ? (
        // Filter out empty subkeys first (but include keys for contact and social_profiles so we can show placeholders)
        (() => {
          const entries = Object.entries(value).filter(([k, v]) => {
            // always skip internal/meta keys
            if (k.startsWith("_") || k === "success" || k === "error")
              return false;

            // For contact and social_profiles, show all keys (even if null) so we can render placeholders
            if (key === "contact" || key === "social_profiles") return true;

            return shouldRenderSection(k, v);
          });

          if (entries.length === 0) return <Placeholder />;

          // If entries are all primitives (not objects/arrays) and few, render compact horizontal cards
          const allPrimitives = entries.every(
            ([, v]) => !(Array.isArray(v) || isValidObject(v))
          );

          if (allPrimitives && entries.length <= 6) {
            return (
              <div className="flex flex-wrap gap-2">
                {entries.map(([k, v]) => (
                  <div
                    key={k}
                    className="px-3 py-2 bg-white border border-(--border-light-gray) rounded-lg min-w-40 flex-1"
                  >
                    <div className="text-sm text-(--dark-gray) font-semibold">
                      {formatTitle(k)}
                    </div>
                    <div className="text-xs text-(--dark-gray) mt-0.5">
                      {renderValue(v)}
                    </div>
                  </div>
                ))}
              </div>
            );
          }

          // Default: render detailed rows
          return (
            <div className="grid md:grid-cols-2 gap-4">
              {entries.map(([subKey, subValue]) => (
                <div key={subKey}>
                  <h3 className="text-sm font-semibold text-[#3f3f3f] mb-1">
                    {formatTitle(subKey)}
                  </h3>
                  <div className="text-(--dark-gray) text-xs text-justify">{renderValue(subValue)}</div>
                </div>
              ))}
            </div>
          );
        })()
      ) : (
        <div className="text-[#3f3f3f] leading-relaxed text-xs">
          {renderValue(value)}
        </div>
      )}
    </Card>
  );
};

export default function VendorSummary({ setStep }) {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getVendorData = () => {
      try {
        const data = localStorage.getItem("__onboarding-Vendors-SDN");
        if (data) {
          const parsed = JSON.parse(data);
          return parsed.success ? parsed.data : null;
        }
      } catch (error) {
        console.error("Error reading from localStorage:", error);
      }
      return null;
    };

    setVendor(getVendorData());
    setLoading(false);
  }, []);

  // Process and sort sections for rendering (hooks must be called unconditionally)
  const sections = useMemo(() => {
    if (!vendor) return [];

    // Exclude keys we render separately at the top or are meta
    const excludedTop = new Set([
      "meta_keys",
      "product_name",
      "company_name",
      "company_website",
      "website",
      "weburl",
      "hq_location",
      "parent_category",
      "sub_category",
    ]);

    const configuredSections = Object.keys(vendor)
      .filter(
        (key) => !excludedTop.has(key) && shouldRenderSection(key, vendor[key])
      )
      .map((key) => ({
        key,
        value: vendor[key],
        config: SECTION_CONFIG[key] || {
          title: formatTitle(key),
          icon: Box,
          layout: SECTION_LAYOUTS.DEFAULT,
          priority: SECTION_PRIORITY.NORMAL,
        },
      }))
      .sort((a, b) => {
        // Sort by priority first, then by title
        const priorityDiff =
          (SECTION_PRIORITY[b.config.priority] || 0) -
          (SECTION_PRIORITY[a.config.priority] || 0);
        return priorityDiff !== 0
          ? priorityDiff
          : a.config.title.localeCompare(b.config.title);
      });

    return configuredSections;
  }, [vendor]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFAFB] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-[#BE7AEF] rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-[#51B8E6] rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-[#1920BA] rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-[#FFFAFB] flex items-center justify-center p-6">
        <Card className="max-w-md">
          <div className="w-16 h-16 bg-[#BE7AEF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Box className="w-8 h-8 text-[#BE7AEF]" />
          </div>
          <h2 className="text-2xl font-bold text-[#051d53] mb-3 text-center">
            No Data Found
          </h2>
          <p className="text-[#3f3f3f] text-center">
            Unable to load vendor data from localStorage.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Hero Header Section */}
      <div className="max-w-[1200px] mx-auto mt-4">
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="flex-1">
            <h1 className="flex items-center gap-2 mb-2 text-2xl text-[#051d53] font-semibold">
              <Box className="w-6 h-6 text-(--dark-gray)" />
              {vendor.product_name || vendor.company_name || "Product"}
            </h1>
            {vendor.description && (
              <p className="text-[#3f3f3f] text-sm leading-snug max-w-2xl">
                {vendor.description}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {setStep && (
              <button
                onClick={() => setStep(3)}
                className="flex items-center border-dashed gap-1.5 px-4 py-2 border border-[#3F3F3F]/15 bg-transparent cursor-pointer hover:bg-gray-100/65 rounded-lg transition text-sm"
              >
                <Pencil className="w-4 h-4 text-[#0066f0]" /> Edit
              </button>
            )}
            <button className="cta btn-blue font-medium text-sm px-4 py-2">Submit</button>
          </div>
        </div>

        {/* Dynamic Sections */}
        <div className="my-4 h-[calc(100dvh-235px)] overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Top cards: Product & Company name (two-column) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <div className="p-3 bg-white border border-(--border-light-gray) rounded-lg">
                <div className="text-sm text-(--dark-gray) font-semibold">
                  Product Name
                </div>
                <div className="text-xs text-(--dark-gray) mt-0.5">
                  {vendor.product_name || <Placeholder />}
                </div>
              </div>
            </div>
            <div>
              <div className="p-3 bg-white border border-(--border-light-gray) rounded-lg">
                <div className="text-sm text-(--dark-gray) font-semibold">
                  Company Name
                </div>
                <div className="text-xs text-(--dark-gray) mt-0.5">
                  {vendor.company_name || <Placeholder />}
                </div>
              </div>
            </div>
          </div>

          {/* Second row: Company Website & HQ Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <div className="p-3 bg-white border border-(--border-light-gray) rounded-lg">
                <div className="text-sm text-(--dark-gray) font-semibold">
                  Website
                </div>
                <div className="text-xs text-(--dark-gray) mt-0.5">
                  {vendor.company_website || vendor.website || vendor.weburl ? (
                    <a
                      href={
                        vendor.company_website ||
                        vendor.website ||
                        vendor.weburl
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      {vendor.company_website ||
                        vendor.website ||
                        vendor.weburl}
                    </a>
                  ) : (
                    <Placeholder />
                  )}
                </div>
              </div>
            </div>
            <div>
              <div className="p-3 bg-white border border-(--border-light-gray) rounded-lg">
                <div className="text-sm text-(--dark-gray) font-semibold">
                  HQ Location
                </div>
                <div className="text-xs text-(--dark-gray) mt-0.5">
                  {vendor.hq_location || <Placeholder />}
                </div>
              </div>
            </div>
          </div>

          {/* Company Info section explicitly */}
          {vendor.company_info &&
            renderDynamicSection(
              "company_info",
              vendor.company_info,
              SECTION_CONFIG.company_info
            )}

          {/* Parent / Sub category row (two columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
            <div className="p-3 bg-white border border-(--border-light-gray) rounded-lg">
              <div className="text-sm text-(--dark-gray) font-semibold">
                Parent Category
              </div>
              <div className="text-xs text-(--dark-gray) mt-0.5">
                {vendor.parent_category || <Placeholder />}
              </div>
            </div>
            <div className="p-3 bg-white border border-(--border-light-gray) rounded-lg">
              <div className="text-sm text-(--dark-gray) font-semibold">
                Sub Category
              </div>
              <div className="text-xs text-(--dark-gray) mt-0.5">
                {vendor.sub_category || <Placeholder />}
              </div>
            </div>
          </div>

          {/* Remaining dynamic sections */}
          {sections
            .filter((s) => s.key !== "company_info")
            .map(({ key, value, config }) =>
              renderDynamicSection(key, value, config)
            )}
        </div>
      </div>
    </>
  );
}

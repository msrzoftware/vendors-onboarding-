export const LS_KEY = "__onboarding-Vendors-SDN";

export const SECTIONS = {
  BASIC: "basic",
  DESCRIPTION: "description",
  BUSINESS: "business",
  FEATURES: "features",
  PRICING: "pricing",
  SUPPORT: "support",
  COMPANY: "company",
  TECHNICAL: "technical",
};

export const FIELD_GROUPS = {
  [SECTIONS.BASIC]: {
    title: "Basic Information",
    fields: [
      "product_name",
      "company_name",
      "website",
      "company_website",
      "weburl",
    ],
    expanded: true,
  },
  [SECTIONS.DESCRIPTION]: {
    title: "Product Description",
    fields: [
      "description",
      "product_description_short",
      "overview",
      "elevator_pitch",
      "usp",
      "competitive_advantage",
      "feature_overview",
    ],
    type: "longtext",
  },
  [SECTIONS.BUSINESS]: {
    title: "Business Information",
    fields: [
      "industry",
      "market_size",
      "industry_size",
      "parent_category",
      "sub_category",
      "hq_location",
    ],
  },
  [SECTIONS.FEATURES]: {
    title: "Features & Capabilities",
    fields: ["features", "other_features", "ai_capabilities"],
  },
  [SECTIONS.PRICING]: {
    title: "Pricing & Plans",
    fields: ["pricing_overview", "pricing_details_web_url", "pricing"],
  },
  [SECTIONS.SUPPORT]: {
    title: "Support & Contact",
    fields: ["contact", "support_options", "deployment_options"],
  },
  [SECTIONS.COMPANY]: {
    title: "Company Information",
    fields: [
      "company_info",
      "founding_year",
      "year_founded",
      "social_links",
      "social_profiles",
    ],
  },
  [SECTIONS.TECHNICAL]: {
    title: "Technical Details",
    fields: ["integrations", "languages_supported", "faq"],
  },
};

export function prettifyKey(key) {
  if (!key || typeof key !== "string") return String(key);
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

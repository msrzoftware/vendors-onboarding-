// Utility functions for dynamic data rendering
export const isValidArray = (arr) => Array.isArray(arr) && arr.length > 0;

export const isValidObject = (obj) =>
  obj && typeof obj === "object" && !Array.isArray(obj);

export const formatFieldName = (fieldName) => {
  return fieldName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const renderValue = (value) => {
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (value === null || value === undefined) {
    return "-";
  }
  return value.toString();
};

export const getSectionConfig = (key) => {
  // Configuration for special sections
  const sectionConfigs = {
    features: {
      title: "Key Features",
      cardFields: ["name", "description"],
      layout: "grid",
      gridCols: "md:grid-cols-2",
    },
    pricing_plans: {
      title: "Pricing Plans",
      cardFields: ["plan", "amount", "period", "description"],
      layout: "grid",
      gridCols: "md:grid-cols-2 lg:grid-cols-4",
    },
    industry: {
      title: "Industries",
      layout: "tags",
    },
    social_links: {
      title: "Social Links",
      layout: "links",
      fields: ["platform", "url"],
    },
  };

  return (
    sectionConfigs[key] || {
      title: formatFieldName(key),
      layout: "default",
    }
  );
};

export const shouldRenderSection = (key, value) => {
  // Define keys that should not be rendered directly
  const excludedKeys = [
    "success",
    "id",
    "_id",
    "created_at",
    "updated_at",
    "meta_keys",
  ];

  return (
    !excludedKeys.includes(key) &&
    value !== null &&
    value !== undefined &&
    (typeof value === "string" ? value.trim() !== "" : true)
  );
};

import PrimitiveRenderer from "./Primitives";
import ArrayRenderer from "./ArrayRenderer";
import ObjectRenderer from "./ObjectRenderer";
import SocialProfilesRenderer from "./SocialProfilesRenderer";

const FieldRenderer = ({ field, value, path = [], onChange }) => {
  // Special handling for social_profiles object
  if (field === "social_profiles") {
    return (
      <SocialProfilesRenderer
        value={value}
        path={path}
        onChange={onChange}
      />
    );
  }

  const forceArrayFields = new Set(["social_links"]);
  if (forceArrayFields.has(field)) {
    const normalizedValue = Array.isArray(value)
      ? value
      : value && typeof value === "object"
      ? [value]
      : [];
    return (
      <ArrayRenderer
        field={field}
        value={normalizedValue}
        path={path}
        onChange={onChange}
      />
    );
  }

  // primitives
  if (typeof value === "string") {
    return (
      <PrimitiveRenderer field={field} value={value} onChange={onChange} path={path} />
    );
  }

  // arrays
  if (Array.isArray(value)) {
    return (
      <ArrayRenderer
        field={field}
        value={value}
        path={path}
        onChange={onChange}
      />
    );
  }

  // objects
  if (value && typeof value === "object") {
    return (
      <ObjectRenderer
        field={field}
        value={value}
        path={path}
        onChange={onChange}
      />
    );
  }

  // fallback: treat null/undefined as primitive string to keep input focus stable
  return (
    <PrimitiveRenderer
      field={field}
      value={String(value ?? "")}
      onChange={onChange}
      path={path}
    />
  );
};

export default FieldRenderer;

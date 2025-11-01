import PrimitiveRenderer from "./Primitives";
import ArrayRenderer from "./ArrayRenderer";
import ObjectRenderer from "./ObjectRenderer";

const FieldRenderer = ({ field, value, path = [], onChange }) => {
  // primitives
  if (typeof value === "string") {
    return (
      <PrimitiveRenderer field={field} value={value} onChange={onChange} />
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

  // fallback
  return (
    <input
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-(--border-light-gray) rounded-lg px-4 py-3"
    />
  );
};

export default FieldRenderer;

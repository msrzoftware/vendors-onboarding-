import { TextArea, UrlInput } from "../FieldEditors";

export default function PrimitiveRenderer({ field, value, onChange, path = [] }) {
  if (typeof value !== "string") return null;

  const fieldId = path.join('|');

  if (
    field &&
    (field.includes("description") ||
      field.includes("overview") ||
      field === "elevator_pitch")
  ) {
    return <TextArea data-field-id={fieldId} value={value} onChange={(v) => onChange(v)} rows={5} />;
  }

  if (field && (field.includes("url") || field.includes("website"))) {
    return <UrlInput data-field-id={fieldId} value={value} onChange={(v) => onChange(v)} />;
  }

  return (
    <input
      data-field-id={fieldId}
      value={value || ""}
      className="w-full text-xs text-(--dark-gray) border border-(--border-light-gray) rounded-xl px-4 py-3 focus:border-(--dark-sapphire) focus:outline-none"
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

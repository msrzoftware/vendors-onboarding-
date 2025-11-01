import { TextArea, UrlInput } from "../FieldEditors";

export default function PrimitiveRenderer({ field, value, onChange }) {
  if (typeof value !== "string") return null;

  if (
    field &&
    (field.includes("description") ||
      field.includes("overview") ||
      field === "elevator_pitch")
  ) {
    return <TextArea value={value} onChange={(v) => onChange(v)} rows={5} />;
  }

  if (field && (field.includes("url") || field.includes("website"))) {
    return <UrlInput value={value} onChange={(v) => onChange(v)} />;
  }

  return (
    <input
      value={value || ""}
      className="w-full border border-(--border-light-gray) rounded-xl px-4 py-3"
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

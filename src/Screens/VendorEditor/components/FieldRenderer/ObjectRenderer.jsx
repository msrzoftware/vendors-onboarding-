import FieldRenderer from "../FieldRenderer";
import { prettifyKey } from "../../utils";

export default function ObjectRenderer({ field, value, path = [], onChange }) {
  if (!value || typeof value !== "object") return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {Object.entries(value).map(([k, v]) => (
        <div key={k}>
          <label
            style={{
              display: "block",
              fontSize: 13,
              color: "#444",
              marginBottom: 6,
            }}
          >
            {prettifyKey(k)}
          </label>
          <FieldRenderer
            field={k}
            value={v}
            path={[...path, k]}
            onChange={(childVal) =>
              onChange({ ...(value || {}), [k]: childVal })
            }
          />
        </div>
      ))}

      {/* Don't allow adding arbitrary fields to contact/support sections */}
      {!(
        field === "contact" ||
        field === "support" ||
        field === "support_contact" ||
        field === "support_and_contact"
      ) && (
        <div>
          <button
            onClick={() => {
              let base = "new_field";
              let i = 1;
              while (Object.prototype.hasOwnProperty.call(value || {}, base)) {
                base = `new_field_${i++}`;
              }
              onChange({ ...(value || {}), [base]: "" });
            }}
            style={{
              padding: "8px",
              borderRadius: 6,
              border: "1px dashed #cbd5e0",
              background: "#f7fafc",
              cursor: "pointer",
            }}
          >
            + Add field
          </button>
        </div>
      )}
    </div>
  );
}

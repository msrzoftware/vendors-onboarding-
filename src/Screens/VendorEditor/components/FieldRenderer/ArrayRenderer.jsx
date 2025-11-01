import { TextArea, UrlInput } from "../FieldEditors";
import { X } from "lucide-react";
import { prettifyKey } from "../../utils";

export default function ArrayRenderer({ field, value, path = [], onChange }) {
  if (!Array.isArray(value)) return null;

  // Special-case: support_options and deployment_options arrays
  if (field === "support_options" || field === "deployment_options") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {value.map((item, idx) => {
          const itemValue = typeof item === "string" ? item : item?.type || "";
          return (
            <div
              key={idx}
              style={{ display: "flex", gap: 8, alignItems: "start" }}
            >
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    color: "#666",
                    marginBottom: 6,
                  }}
                >
                  Type
                </label>
                <input
                  value={itemValue}
                  onChange={(e) => {
                    const newArray = [...value];
                    newArray[idx] = { type: e.target.value };
                    onChange(newArray);
                  }}
                  className="w-full border border-(--border-light-gray) rounded-lg px-4 py-3"
                  placeholder="Enter type..."
                />
              </div>
              <button
                className="cursor-pointer"
                onClick={() => onChange(value.filter((_, i) => i !== idx))}
                style={{ marginTop: "24px" }}
              >
                <X className="min-w-[18px] text-(--ruby-red)" />
              </button>
            </div>
          );
        })}
        <button
          onClick={() => onChange([...value, { type: "" }])}
          className="w-fit px-3 py-2 border border-dashed border-(--border-light-gray) rounded-lg hover:bg-gray-50 transition-colors"
        >
          + Add {field.replace(/_/g, " ")}
        </button>
      </div>
    );
  }

  // Special-case: features array of objects -> render card list (Name + Description)
  if (
    field === "features" &&
    value.every((it) => it && typeof it === "object")
  ) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 12,
          }}
        >
          {value.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #e6eef8",
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: 8,
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      color: "#666",
                      marginBottom: 6,
                    }}
                  >
                    Name
                  </label>
                  <input
                    value={item.name || ""}
                    onChange={(e) => {
                      const newArray = [...value];
                      newArray[idx] = {
                        ...newArray[idx],
                        name: e.target.value,
                      };
                      onChange(newArray);
                    }}
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 6,
                      border: "1px solid #cbd5e0",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      color: "#666",
                      marginBottom: 6,
                    }}
                  >
                    Description
                  </label>
                  <TextArea
                    value={item.description || item.desc || ""}
                    onChange={(v) => {
                      const newArray = [...value];
                      newArray[idx] = { ...newArray[idx], description: v };
                      onChange(newArray);
                    }}
                    rows={3}
                  />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "start" }}>
                <button
                  onClick={() => onChange(value.filter((_, i) => i !== idx))}
                  title="Remove feature"
                  className="cursor-pointer"
                >
                  <X className="min-w-[18px] text-(--ruby-red)" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <button
            onClick={() => onChange([...value, { name: "", description: "" }])}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px dashed #cbd5e0",
              background: "#f7fafc",
              cursor: "pointer",
            }}
          >
            + Add feature
          </button>
        </div>
      </div>
    );
  }

  // Handle integrations in 2 columns
  if (field === "integrations") {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {value.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-white border border-(--border-light-gray) rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <label className="block text-[12px] text-gray-600 mb-1">
                    Name
                  </label>
                  <input
                    value={item.name ?? ""}
                    placeholder="Enter integration name"
                    onChange={(e) => {
                      const newArray = [...value];
                      newArray[idx] = {
                        ...newArray[idx],
                        name: e.target.value || null,
                      };
                      onChange(newArray);
                    }}
                    className="w-full p-2.5 border border-(--border-light-gray) rounded-lg mb-3"
                  />

                  <label className="block text-[12px] text-gray-600 mb-1">
                    Website
                  </label>
                  <UrlInput
                    value={item.website ?? ""}
                    placeholder="https://..."
                    onChange={(val) => {
                      const newArray = [...value];
                      newArray[idx] = {
                        ...newArray[idx],
                        website: val || null,
                      };
                      onChange(newArray);
                    }}
                    className="mb-3"
                  />

                  <label className="block text-[12px] text-gray-600 mb-1">
                    Logo URL
                  </label>
                  <UrlInput
                    value={item.logo ?? ""}
                    placeholder="https://..."
                    onChange={(val) => {
                      const newArray = [...value];
                      newArray[idx] = { ...newArray[idx], logo: val || null };
                      onChange(newArray);
                    }}
                  />
                </div>
                <button
                  className="cursor-pointer ml-2"
                  onClick={() => onChange(value.filter((_, i) => i !== idx))}
                >
                  <X className="min-w-[18px] text-(--ruby-red)" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() =>
            onChange([...value, { name: null, website: null, logo: null }])
          }
          className="w-fit px-3 py-2 border border-dashed border-(--border-light-gray) rounded-lg hover:bg-gray-50 transition-colors"
        >
          + Add Integration
        </button>
      </div>
    );
  }

  // generic array renderer (other_features + default)
  if (field === "other_features") {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 8,
        }}
      >
        {value.map((item, idx) => (
          <div
            key={idx}
            style={{ display: "flex", gap: 8, alignItems: "center" }}
          >
            <input
              value={item}
              onChange={(e) => {
                const newArray = [...value];
                newArray[idx] = e.target.value;
                onChange(newArray);
              }}
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
            <button
              className="cursor-pointer"
              onClick={() => onChange(value.filter((_, i) => i !== idx))}
            >
              <X className="min-w-[18px] text-(--ruby-red)" />
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange([...value, ""])}
          style={{
            padding: 8,
            background: "#f8f9fa",
            border: "1px dashed #ccc",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          + Add other feature
        </button>
      </div>
    );
  }

  // default generic array renderer
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {value.map((item, idx) => (
        <div key={idx} style={{ display: "flex", gap: 8 }}>
          {typeof item === "string" ? (
            <input
              value={item}
              onChange={(e) => {
                const newArray = [...value];
                newArray[idx] = e.target.value;
                onChange(newArray);
              }}
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
          ) : (
            <div style={{ flex: 1 }}>
              {Object.entries(item).map(([k, v]) => (
                <div key={k} style={{ marginBottom: 8 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      color: "#666",
                      marginBottom: 4,
                    }}
                  >
                    {prettifyKey(k)}
                  </label>
                  <input
                    value={v || ""}
                    onChange={(e) => {
                      const newArray = [...value];
                      newArray[idx] = { ...newArray[idx], [k]: e.target.value };
                      onChange(newArray);
                    }}
                    style={{
                      width: "100%",
                      padding: 8,
                      borderRadius: 4,
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
          <button
            className="cursor-pointer flex items-center justify-center"
            onClick={() => onChange(value.filter((_, i) => i !== idx))}
          >
            <X className="min-w-[18px] text-(--ruby-red)" />
          </button>
        </div>
      ))}

      <button
        onClick={() =>
          onChange([...value, typeof value[0] === "string" ? "" : {}])
        }
        style={{
          padding: "8px",
          background: "#f8f9fa",
          border: "1px dashed #ccc",
          borderRadius: 4,
          cursor: "pointer",
          marginTop: 8,
        }}
      >
        + Add {field ? field.replace(/_/g, " ") : "item"}
      </button>
    </div>
  );
}

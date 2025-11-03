import { TextArea, UrlInput } from "../FieldEditors";
import { X } from "lucide-react";
import { prettifyKey } from "../../utils";

export default function ArrayRenderer({ field, value, path = [], onChange }) {
  if (!Array.isArray(value)) return null;

  // Special-case: pricing plan descriptions
  if (field === "description" && path.includes("pricing_plans")) {
    return (
      <div className="flex flex-col gap-3">
        {value.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <div className="flex-1">
              <input
                value={item}
                onChange={(e) => {
                  const newArray = [...value];
                  newArray[idx] = e.target.value;
                  onChange(newArray);
                }}
                className="w-full border border-(--border-light-gray) rounded-lg px-4 py-2 focus:border-(--dark-sapphire) focus:outline-none"
                placeholder="Enter description item..."
              />
            </div>
            <button
              onClick={() => onChange(value.filter((_, i) => i !== idx))}
              className="cursor-pointer mt-1"
              title="Remove description"
            >
              <X className="min-w-[18px] text-(--ruby-red)" />
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange([...value, ""])}
          className="w-full bg-[#F2F7FF] px-3 py-2 border border-dashed border-(--border-dark-gray) rounded-lg hover:bg-gray-50 transition-colors"
        >
          + Add description
        </button>
      </div>
    );
  }

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
                <label className="block text-[12px] text-(--dark-gray) mb-1.5">
                  Type
                </label>
                <input
                  value={itemValue}
                  onChange={(e) => {
                    const newArray = [...value];
                    newArray[idx] = { type: e.target.value };
                    onChange(newArray);
                  }}
                  className="w-full border border-(--border-light-gray) focus:border-(--dark-sapphire) focus:outline-none rounded-lg px-4 py-3"
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
          className="w-full bg-[#F2F7FF] px-3 py-2 border border-dashed border-(--border-dark-gray) rounded-lg transition-colors"
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
              className="flex gap-3 items-start p-3 rounded-lg border border-(--border-light-gray)"
            >
              <div className="flex-1 grid grid-cols-1 gap-2">
                <div>
                  <label className="block text-[12px] text-(--dark-gray) mb-1.5">
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
                    className="w-full p-2.5 rounded-md border border-(--border-light-gray) focus:border-(--dark-sapphire) focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] text-(--dark-gray) mb-1.5">
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
            className="w-full bg-[#F2F7FF] cursor-pointer px-3 py-2 rounded-md border border-dashed border-(--dark-gray)"
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
                    className="w-full p-2.5 border border-(--border-light-gray) focus:border-(--dark-sapphire) focus:outline-none rounded-lg mb-3"
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
      <>
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
                className="flex-1 p-2 rounded border border-(--border-light-gray) focus:border-(--dark-sapphire) focus:outline-none"
                onChange={(e) => {
                  const newArray = [...value];
                  newArray[idx] = e.target.value;
                  onChange(newArray);
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
        </div>
        <button
          onClick={() => onChange([...value, ""])}
          className="w-full bg-[#F2F7FF] p-2 border border-dashed border-(--dark-gray) rounded cursor-pointer mt-4"
        >
          + Add other feature
        </button>
      </>
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
              className="flex-1 p-2 rounded-md border border-(--border-light-gray) focus:border-(--dark-sapphire) focus:outline-none"
            />
          ) : (
            <div style={{ flex: 1 }}>
              {Object.entries(item).map(([k, v]) => (
                <div key={k} style={{ marginBottom: 8 }}>
                  <label className="block text-[12px] text-(--dark-gray) mb-1">
                    {prettifyKey(k)}
                  </label>
                  <input
                    value={v || ""}
                    onChange={(e) => {
                      const newArray = [...value];
                      newArray[idx] = { ...newArray[idx], [k]: e.target.value };
                      onChange(newArray);
                    }}
                    className="w-full p-2 rounded border border-(--border-light-gray) focus:border-(--dark-sapphire) focus:outline-none"
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
        className="bg-[#F2F7FF] border border-dashed border-(--dark-gray) rounded cursor-pointer mt-2 p-2"
      >
        + Add {field ? field.replace(/_/g, " ") : "item"}
      </button>
    </div>
  );
}

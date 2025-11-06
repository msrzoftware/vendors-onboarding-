import React, { useState } from "react";
import FieldRenderer from "../FieldRenderer";
import { prettifyKey } from "../../utils";
import { X } from "lucide-react";

export default function ObjectRenderer({ field, value, path = [], onChange }) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");

  if (!value || typeof value !== "object") return null;

  const handleAddField = () => {
    if (newFieldName.trim()) {
      // Convert the field name to snake_case for consistency
      const fieldKey = newFieldName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "");
      
      onChange({ 
        ...(value || {}), 
        [fieldKey]: newFieldValue 
      });
      
      // Reset the form
      setNewFieldName("");
      setNewFieldValue("");
      setShowAddDialog(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {Object.entries(value).map(([k, v]) => (
        <div key={k}>
          <label className="block text-[13px] mb-1.5 text-(--dark-gray)">
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
          {showAddDialog ? (
            <div className="border border-(--border-light-gray) rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium">Add New Field</h3>
                <button
                  onClick={() => setShowAddDialog(false)}
                  className="text-(--ruby-red)"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-[13px] mb-1.5 text-(--dark-gray)">
                    Field Label
                  </label>
                  <input
                    type="text"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    placeholder="Enter field label"
                    className="w-full border border-(--border-light-gray) rounded-lg px-4 py-2 focus:border-(--dark-sapphire) focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[13px] mb-1.5 text-(--dark-gray)">
                    Field Value
                  </label>
                  <input
                    type="text"
                    value={newFieldValue}
                    onChange={(e) => setNewFieldValue(e.target.value)}
                    placeholder="Enter field value"
                    className="w-full border border-(--border-light-gray) rounded-lg px-4 py-2 focus:border-(--dark-sapphire) focus:outline-none"
                  />
                </div>
                <div className="flex gap-2 justify-end mt-2">
                  <button
                    onClick={() => setShowAddDialog(false)}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddField}
                    className="cta btn-blue"
                    disabled={!newFieldName.trim()}
                  >
                    Add Field
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddDialog(true)}
              className="w-full p-2 rounded-md border border-(--dark-gray) bg-[#F2F7FF] cursor-pointer transition-colors"
            >
              + Add field
            </button>
          )}
        </div>
      )}
    </div>
  );
}

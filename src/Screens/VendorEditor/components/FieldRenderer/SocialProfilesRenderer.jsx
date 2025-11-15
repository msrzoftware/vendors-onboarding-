import React from "react";
import { X } from "lucide-react";

const UrlInput = ({ value, onChange, placeholder, ...rest }) => (
  <input
    type="url"
    value={value || ""}
    onChange={(e) => onChange(e.target.value || null)}
    placeholder={placeholder || "https://..."}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    {...rest}
  />
);

export default function SocialProfilesRenderer({ value = {}, path = [], onChange }) {
  const profiles = value || {};
  const knownPlatforms = ["linkedin", "twitter", "facebook"];

  // Extract any extra platforms beyond the known ones
  const extraPlatforms = Object.keys(profiles).filter(
    (key) => !knownPlatforms.includes(key)
  );

  const handleChange = (platform, url) => {
    const updated = { ...profiles, [platform]: url || null };
    onChange(updated);
  };

  const handleRemoveExtra = (platform) => {
    const updated = { ...profiles };
    delete updated[platform];
    onChange(updated);
  };

  const [newPlatform, setNewPlatform] = React.useState("");
  const [newUrl, setNewUrl] = React.useState("");

  const handleAddPlatform = () => {
    if (newPlatform.trim() && newUrl.trim()) {
      const updated = { ...profiles, [newPlatform.trim()]: newUrl.trim() };
      onChange(updated);
      setNewPlatform("");
      setNewUrl("");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Known platforms */}
      {knownPlatforms.map((platform) => {
        const fieldId = [...path, platform].join("|");
        return (
          <div key={platform} className="flex flex-col gap-1.5">
            <label className="text-[12px] text-(--dark-blue) capitalize">
              {platform}
            </label>
            <UrlInput
              value={profiles[platform]}
              onChange={(val) => handleChange(platform, val)}
              placeholder={`https://www.${platform}.com/...`}
              data-field-id={fieldId}
            />
          </div>
        );
      })}

      {/* Extra platforms */}
      {extraPlatforms.map((platform) => {
        const fieldId = [...path, platform].join("|");
        return (
          <div key={platform} className="flex gap-2 items-end">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[12px] text-(--dark-blue) capitalize">
                {platform}
              </label>
              <UrlInput
                value={profiles[platform]}
                onChange={(val) => handleChange(platform, val)}
                placeholder="https://..."
                data-field-id={fieldId}
              />
            </div>
            <button
              onClick={() => handleRemoveExtra(platform)}
              className="p-2 text-red-500 hover:bg-red-50 rounded mb-0.5"
              title={`Remove ${platform}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        );
      })}

      {/* Add new platform */}
      <div className="mt-2 p-3 border border-dashed border-gray-300 rounded-md bg-gray-50">
        <div className="text-xs text-gray-600 mb-2">Add another social profile</div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)}
            placeholder="Platform name (e.g., Instagram)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleAddPlatform}
            disabled={!newPlatform.trim() || !newUrl.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

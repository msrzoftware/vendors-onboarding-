import React from "react";

export default function EmptyFieldsPanel({ emptyFieldsData = {}, handleFieldClick, onClose }) {
  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-(--border-light-gray) overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="p-4 border-b border-(--border-light-gray) flex justify-between items-center bg-white">
        <h3 className="text-lg font-semibold flex items-center gap-2">Empty Fields</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4  [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {Object.keys(emptyFieldsData).length === 0 ? (
          <div className="text-sm text-gray-500">No empty fields</div>
        ) : (
          Object.entries(emptyFieldsData).map(([sectionKey, { title, fields }]) => (
            <div key={sectionKey} className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
              <div className="space-y-2">
                {fields.map(({ path, label }) => {
                  const id = path.join("|");
                  return (
                    <button
                      key={id}
                      onClick={() => handleFieldClick(sectionKey, path)}
                      className="w-full text-left p-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
                    >
                      <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

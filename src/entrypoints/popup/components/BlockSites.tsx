import { Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";

const DEFAULT_BLOCKS = {
  "Social Media": ["facebook.com", "instagram.com", "x.com"],
  Messaging: ["discord.com", "slack.com", "telegram.org"],
};

// Utility to normalize user input into domain format
function normalizeDomain(input: string): string {
  try {
    const url = new URL(input.startsWith("http") ? input : `https://${input}`);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return input.trim().replace(/^www\./, "");
  }
}

export default function BlockSites() {
  const [customUrls, setCustomUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [enabledDefaults, setEnabledDefaults] = useState<string[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("blocked_sites") || "[]");
    const defaults = JSON.parse(localStorage.getItem("enabled_defaults") || "[]");
    setCustomUrls(stored);
    setEnabledDefaults(defaults);
  }, []);

  useEffect(() => {
    localStorage.setItem("blocked_sites", JSON.stringify(customUrls));
    localStorage.setItem("enabled_defaults", JSON.stringify(enabledDefaults));
  }, [customUrls, enabledDefaults]);

  const handleAdd = () => {
    const normalized = normalizeDomain(urlInput);
    if (normalized && !customUrls.includes(normalized)) {
      setCustomUrls((prev) => [...prev, normalized]);
      setUrlInput("");
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  const toggleDefault = (site: string) => {
    setEnabledDefaults((prev) =>
      prev.includes(site) ? prev.filter((s) => s !== site) : [...prev, site]
    );
  };

  const handleRemove = (url: string) => {
    setCustomUrls((prev) => prev.filter((u) => u !== url));
  };

  const activeDefaultSites = Object.entries(DEFAULT_BLOCKS)
    .flatMap(([_, sites]) => sites)
    .filter((site) => enabledDefaults.includes(site));

  const allBlocked = [...new Set([...customUrls, ...activeDefaultSites])];

  useEffect(() => {
    chrome.storage.local.set({ blocked_sites: allBlocked });
  }, [allBlocked]);

  return (
    <div className="p-4 text-sm">
      <h2 className="text-xl font-semibold mb-4">Blocked Sites</h2>

      {/* Input */}
      <div className="flex gap-2 mb-3">
        <input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Enter URL (e.g., https://facebook.com)"
          className="flex-1 rounded px-3 py-2 bg-pink-100 focus:outline-none"
        />
        <button
          onClick={handleAdd}
          className="bg-[#EC7FA9] text-white px-4 py-1 rounded hover:bg-pink-600"
        >
          Add
        </button>
      </div>

      {/* Quick Toggles */}
      <div className="mb-2 py-4">
        <h4 className="font-semibold mb-2 text-[#8e5773]">Quick Block</h4>
        {Object.entries(DEFAULT_BLOCKS).map(([label, sites]) => (
          <div key={label} className="mb-4">
            <p className="font-medium text-gray-700">{label}</p>
            <div className="flex gap-2 flex-wrap mt-1">
              {sites.map((site) => (
                <label key={site} className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={enabledDefaults.includes(site)}
                    onChange={() => toggleDefault(site)}
                  />
                  {site}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Scrollable List */}
      <div className="max-h-48 overflow-y-auto border-t pt-2 mt-3">
        {allBlocked.length > 0 ? (
          allBlocked.map((site) => (
            <div
              key={site}
              className="flex justify-between items-center px-2 py-1"
            >
              <span>{site}</span>
              {!enabledDefaults.includes(site) && (
                <button onClick={() => handleRemove(site)}>
                  <Trash2
                    size={18}
                    className="text-[#F98E90] hover:scale-110 transition-transform"
                  />
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400">No blocked sites</p>
        )}
      </div>
    </div>
  );
}

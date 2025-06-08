export const getBlockedSites = async (): Promise<string[]> => {
  const res = await chrome.storage.local.get("blocked_sites");
  return res.blocked_sites || [];
};

export const saveBlockedSites = async (sites: string[]): Promise<void> => {
  await chrome.storage.local.set({ blocked_sites: sites });
};

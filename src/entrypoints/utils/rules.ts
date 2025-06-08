export const RULE_ID_START = 1_000_000;

export const generateBlockRules = (sites: string[]): chrome.declarativeNetRequest.Rule[] => {
  const usedIds = new Set<number>();

  return sites.map((domain, index) => {
    let id = 1_000_000 + index;
    while (usedIds.has(id)) id++;
    usedIds.add(id);

    return {
      id,
      priority: 1,
      action: { type: "block" },
      condition: {
        urlFilter: `||${domain}^`,  
        resourceTypes: ["main_frame", "sub_frame", "script"],  
      },
    };
  });
};


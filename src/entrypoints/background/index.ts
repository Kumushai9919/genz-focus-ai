 
 

import { getBlockedSites } from "@utils/storage";
import { generateBlockRules } from "@utils/rules";

export default defineBackground(() => {
  let activeRuleIds: Set<number> = new Set();

  async function updateRules(sites: string[]) {
    const rules = generateBlockRules(sites);
    const newRuleIds = new Set(rules.map((rule) => rule.id));

    const ruleIdsToRemove = Array.from(activeRuleIds).filter(
      (id) => !newRuleIds.has(id)
    );
    const rulesToAdd = rules.filter((rule) => !activeRuleIds.has(rule.id));

    try {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ruleIdsToRemove,
        addRules: rulesToAdd,
      });

      activeRuleIds = newRuleIds;
    } catch (err) {
      console.error("Failed to update rules", err);
    }
  }

  chrome.runtime.onInstalled.addListener(async () => {
    const sites = await getBlockedSites();
    await updateRules(sites);
  });

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.blocked_sites) {
      const sites: string[] = changes.blocked_sites.newValue || [];
      updateRules(sites);
    }
  });

  chrome.runtime.onSuspend.addListener(async () => {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: Array.from(activeRuleIds),
    });
    activeRuleIds.clear();
  });
});

export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_idle",
  main() {
    console.log("GenZ Focus AI content script loaded");
  },
});

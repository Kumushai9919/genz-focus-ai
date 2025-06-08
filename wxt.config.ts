import { defineConfig } from "wxt";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// See https://wxt.dev/api/config.html
export default defineConfig({
  outDir: "dist",
  modules: ["@wxt-dev/module-react"],
  entrypointsDir: "entrypoints",
  srcDir: "src",
  vite: () => ({
    plugins: [tsconfigPaths()],
    resolve: {
      alias: {
        "@utils": path.resolve(__dirname, "src/entrypoints/utils"),
        "@components": path.resolve(__dirname, "src/entrypoints/popup/components"),
        "@popup": path.resolve(__dirname, "src/entrypoints/popup"),
      },
    },
  }),

  manifest: {
    manifest_version: 3,
    name: "GenZ Focus AI",
    version: "1.0.0",
    description: "A productivity extension with AI-powered focus tools",
    icons: {
      "16": "icon/16.png",
      "32": "icon/32.png",
      "48": "icon/48.png",
      "96": "icon/96.png",
      "128": "icon/128.png",
    },
    action: {
      default_popup: "popup.html",
      default_title: "GenZ Focus AI",
      default_icon: {
        "16": "icon/16.png",
        "32": "icon/32.png",
        "48": "icon/48.png",
        "96": "icon/96.png",
        "128": "icon/128.png",
      },
    },
    permissions: [
      "storage",
      "activeTab",
      "scripting",
      "declarativeNetRequest",
      "tabs",
    ],
    host_permissions: [
      "<all_urls>",
      "https://www.googleapis.com/*",
      "*://*/*",
      "*://*.google.com/*",
    ],
    background: {
      service_worker: "background.js",
      type: "module",
    },
    declarative_net_request: {
      rule_resources: [],
    },
    web_accessible_resources: [
      {
        resources: ["icon/*", "sounds/*"],
        matches: ["<all_urls>"],
      },
    ],
  },
});

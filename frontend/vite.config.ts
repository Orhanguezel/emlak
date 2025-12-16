// vite.config.ts
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import fs from "node:fs";
import type { PluginContext } from "rollup";

/** paket@versiyon → paket (örn: "sonner@2.0.3" ⇒ "sonner") */
function stripVersionInImports(): Plugin {
  const re = /^(@[^/]+\/[^@/]+|[^@/]+)@\d+\.\d+\.\d+(\/.*)?$/;
  return {
    name: "strip-version-in-imports",
    enforce: "pre",
    async resolveId(this: PluginContext, source, importer, opts) {
      if (re.test(source)) {
        const cleaned = source.replace(/@\d+\.\d+\.\d+(?=\/|$)/, "");
        return this.resolve(cleaned, importer, { ...(opts ?? {}), skipSelf: true });
      }
      return null;
    },
  };
}

/** figma:asset/... → src/assets/figma/...  (yoksa placeholder dön) */
function figmaAssetResolver(
  figmaDir = path.resolve(process.cwd(), "src/assets/figma"),
): Plugin {
  const placeholder =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/axlJb0AAAAASUVORK5CYII=";

  return {
    name: "figma-asset-resolver",
    enforce: "pre",
    resolveId(source) {
      if (source.startsWith("figma:asset/")) {
        const rel = source.slice("figma:asset/".length);
        return path.resolve(figmaDir, rel);
      }
      return null;
    },
    load(id) {
      if (id.startsWith(figmaDir)) {
        if (!fs.existsSync(id)) {
          return `export default "${placeholder}";`;
        }
      }
      return null;
    },
  };
}

export default defineConfig(({ mode }) => {
  // .env yükle (VITE_ prefix’li değerler)
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const API_ORIGIN = (env.VITE_PUBLIC_API_ORIGIN || "http://127.0.0.1:808").replace(/\/$/, "");

  return {
    plugins: [react(), stripVersionInImports(), figmaAssetResolver()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "sonner@2.0.3": "sonner",
        "lucide-react@0.487.0": "lucide-react",
        "@radix-ui/react-slot@1.1.2": "@radix-ui/react-slot",
        "@radix-ui/react-dialog@1.1.6": "@radix-ui/react-dialog",
        "@radix-ui/react-label@2.1.2": "@radix-ui/react-label",
        "@radix-ui/react-select@2.1.6": "@radix-ui/react-select",
        "@radix-ui/react-accordion@1.2.3": "@radix-ui/react-accordion",
        "embla-carousel-react@8.6.0": "embla-carousel-react",
      },
      // Tek kopya React ve Radix
      dedupe: [
        "react",
        "react-dom",
        "@radix-ui/react-dialog",
        "@radix-ui/react-primitive",
        "@radix-ui/react-slot",
        "@radix-ui/react-portal",
        "@radix-ui/react-use-escape-keydown",
      ],
    },
    server: {
      host: true,
      port: 3000,
      hmr: { overlay: false },
      cors: true,
      proxy: {
        // Public asset serve → BE
        "^/storage": {
          target: API_ORIGIN,
          changeOrigin: true,
        },
        // FE’de doğrudan /api kullanıyorsan yorumdan çıkar
        "^/api": {
          target: API_ORIGIN,
          changeOrigin: true,
        },
        // functions kullanan istekler için (varsa):
        "^/functions": {
          target: API_ORIGIN,
          changeOrigin: true,
        },
      },
    },
    preview: { host: true, port: 4173, cors: true },
  };
});

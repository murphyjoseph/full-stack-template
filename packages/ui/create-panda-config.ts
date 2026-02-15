import { defineConfig } from "@pandacss/dev";
import { uiPreset } from "./preset";

interface AppConfigOptions {
  /** Glob patterns for your app's source files. Defaults to ['./app/**\/*.{ts,tsx}', './src/**\/*.{ts,tsx}'] */
  include?: string[];
}

export function createAppConfig(options?: AppConfigOptions) {
  const appIncludes = options?.include ?? [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ];

  return defineConfig({
    preflight: true,
    presets: ["@pandacss/preset-base", uiPreset],
    importMap: "@repo/ui",
    include: [
      ...appIncludes,
      "../../packages/ui/src/**/*.{ts,tsx}",
    ],
    jsxFramework: "react",
    outdir: "styled-system",
  });
}

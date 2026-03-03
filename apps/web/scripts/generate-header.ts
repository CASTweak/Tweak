/**
 * Reads the Vite single-file build output (dist/index.html)
 * and generates an Objective-C header with the HTML as a string literal.
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";

const distHtml = readFileSync(
  resolve(import.meta.dirname!, "../dist/index.html"),
  "utf-8"
);

// Escape for Objective-C string literal
const escaped = distHtml
  .replace(/\\/g, "\\\\")
  .replace(/"/g, '\\"')
  .replace(/\n/g, "\\n");

const header = `// Auto-generated — do not edit
// Built from apps/web via: bun run build
#ifndef CASTWEAK_WEB_HTML_H
#define CASTWEAK_WEB_HTML_H

static NSString *const kCASTweakWebHTML = @"${escaped}";

#endif
`;

const outPath = resolve(
  import.meta.dirname!,
  "../../../apps/tweak/generated/WebHTML.h"
);
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, header);
console.log(`Generated ${outPath}`);

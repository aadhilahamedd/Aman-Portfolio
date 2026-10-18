import { existsSync, rmSync } from "node:fs";

const copies = ["out/Details", "out/details"];

for (const target of copies) {
  if (!existsSync(target)) continue;
  rmSync(target, { recursive: true, force: true });
  console.log(`Removed original media from the export: ${target}`);
}

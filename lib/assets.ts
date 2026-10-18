import fs from "node:fs";
import path from "node:path";

export function assertPublicFile(urlPath: string | undefined) {
  if (!urlPath) return;
  if (/^https?:\/\//i.test(urlPath)) return;

  if (!urlPath.startsWith("/") || urlPath.includes("..")) {
    throw new Error(`Unsafe asset path: ${urlPath}`);
  }

  const relative = decodeURIComponent(urlPath).replace(/^\/+/, "");
  const filePath = path.join(process.cwd(), "public", relative);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing asset: ${urlPath}`);
  }
}

export function assertPublicFiles(paths: Array<string | undefined>) {
  for (const urlPath of paths) {
    assertPublicFile(urlPath);
  }
}

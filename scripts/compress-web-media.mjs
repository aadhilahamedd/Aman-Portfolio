// Shrinks the web copies in public/media so the site can be pushed to GitHub.
// Originals in public/Details are not read or modified.
import { spawnSync } from "node:child_process";
import { readdirSync, renameSync, statSync, unlinkSync } from "node:fs";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";

const videoFilter = [
  "scale=w=1280:h=1280:force_original_aspect_ratio=decrease:flags=lanczos",
  "scale=trunc(iw/2)*2:trunc(ih/2)*2",
  "fps=30",
].join(",");

const imageFilter =
  "scale=w=1600:h=1600:force_original_aspect_ratio=decrease:flags=lanczos";

function run(args) {
  const result = spawnSync(ffmpegPath, args, { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`ffmpeg exited ${result.status}`);
  }
}

function mb(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function replaceIfSmaller(source, target) {
  const before = statSync(source).size;
  const after = statSync(target).size;
  if (after < before) {
    unlinkSync(source);
    renameSync(target, source);
    console.log(`  ${mb(before)} -> ${mb(after)}`);
    return after;
  }
  unlinkSync(target);
  console.log(`  kept ${mb(before)}; new file was ${mb(after)}`);
  return before;
}

function compressVideos() {
  let total = 0;
  for (const folder of ["cinematic", "portrait"]) {
    const dir = path.join("public", "media", folder);
    for (const name of readdirSync(dir).filter((file) => file.endsWith(".mp4"))) {
      const source = path.join(dir, name);
      const target = path.join(dir, name.replace(/\.mp4$/, ".next.mp4"));
      console.log(`video ${source}`);
      run([
        "-y",
        "-hide_banner",
        "-loglevel",
        "error",
        "-i",
        source,
        "-map",
        "0:v:0",
        "-map",
        "0:a:0?",
        "-vf",
        videoFilter,
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "28",
        "-maxrate",
        "1600k",
        "-bufsize",
        "3200k",
        "-profile:v",
        "high",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        "96k",
        "-ac",
        "2",
        "-movflags",
        "+faststart",
        target,
      ]);
      total += replaceIfSmaller(source, target);
    }
  }
  return total;
}

function compressImages() {
  let total = 0;
  const folders = ["cinematic", "portrait", "photos"];
  for (const folder of folders) {
    const dir = path.join("public", "media", folder);
    for (const name of readdirSync(dir).filter((file) => file.endsWith(".jpg"))) {
      const source = path.join(dir, name);
      const target = path.join(dir, name.replace(/\.jpg$/, ".next.jpg"));
      console.log(`image ${source}`);
      run([
        "-y",
        "-hide_banner",
        "-loglevel",
        "error",
        "-i",
        source,
        "-vf",
        imageFilter,
        "-q:v",
        "4",
        target,
      ]);
      total += replaceIfSmaller(source, target);
    }
  }
  return total;
}

const videos = compressVideos();
const images = compressImages();
console.log(`web video ${mb(videos)}`);
console.log(`web images ${mb(images)}`);

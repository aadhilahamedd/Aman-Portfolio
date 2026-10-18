// Creates browser-ready copies in public/media.
// Originals in public/Details are read only and are not modified.
// Requires ffmpeg-static and heic-convert to be installed locally.
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ffmpegPath from "ffmpeg-static";

const require = createRequire(import.meta.url);
const convert = require("heic-convert");

const root = process.cwd();

const photos = [
  {
    input: "public/Details/Personal Photo/AMAN 1",
    output: "public/media/photos/aman-1.jpg",
  },
  {
    input: "public/Details/Personal Photo/AMAN 2",
    output: "public/media/photos/aman-2.jpg",
  },
];

const videos = [
  ["public/Details/Cinematic/Work 1", "public/media/cinematic/work-1"],
  ["public/Details/Cinematic/Work 2", "public/media/cinematic/work-2"],
  ["public/Details/Cinematic/Work 3", "public/media/cinematic/work-3"],
  ["public/Details/Cinematic/Work 4.MP4", "public/media/cinematic/work-4"],
  ["public/Details/Cinematic/Work 5.MP4", "public/media/cinematic/work-5"],
  ["public/Details/Portrait/Work 1", "public/media/portrait/work-1"],
  ["public/Details/Portrait/Work 2", "public/media/portrait/work-2"],
  ["public/Details/Portrait/Work 3", "public/media/portrait/work-3"],
].map(([input, base]) => ({
  input,
  output: `${base}.mp4`,
  poster: `${base}.jpg`,
}));

const fit =
  "scale=w=1920:h=1920:force_original_aspect_ratio=decrease:flags=lanczos,scale=trunc(iw/2)*2:trunc(ih/2)*2";

const sdrFilter = `${fit},format=yuv420p,fps=30`;
const hdrFilter = [
  "zscale=t=linear:npl=100",
  "format=gbrpf32le",
  "zscale=p=bt709",
  "tonemap=tonemap=hable:desat=0",
  "zscale=t=bt709:m=bt709:r=tv",
  "format=yuv420p",
  fit,
  "fps=30",
].join(",");

function abs(file) {
  return path.join(root, file);
}

function run(args) {
  const result = spawnSync(ffmpegPath, args, { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`ffmpeg exited ${result.status}: ${args.join(" ")}`);
  }
}

function probe(file) {
  const result = spawnSync(ffmpegPath, ["-hide_banner", "-i", abs(file)], {
    encoding: "utf8",
  });
  const text = result.stderr ?? "";
  const match = text.match(/Duration:\s+(\d+):(\d+):(\d+(?:\.\d+)?)/);
  const seconds = match
    ? Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3])
    : 2;
  const hdr = /bt2020|arib-std-b67|smpte2084/i.test(text);
  return { seconds, hdr };
}

async function writePhotos() {
  for (const photo of photos) {
    mkdirSync(path.dirname(abs(photo.output)), { recursive: true });
    console.log(`photo ${photo.output}`);
    const buffer = readFileSync(abs(photo.input));
    const jpeg = await convert({
      buffer,
      format: "JPEG",
      quality: 0.92,
    });
    writeFileSync(abs(photo.output), Buffer.from(jpeg));
  }
}

function writePoster(video, info) {
  mkdirSync(path.dirname(abs(video.poster)), { recursive: true });
  const ss = Math.min(Math.max(info.seconds * 0.35, 0.8), Math.max(info.seconds - 0.25, 0.4));
  console.log(`poster ${video.poster} @ ${ss.toFixed(2)}s hdr=${info.hdr}`);
  run([
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-ss",
    ss.toFixed(2),
    "-i",
    abs(video.input),
    "-frames:v",
    "1",
    "-vf",
    info.hdr ? hdrFilter : sdrFilter,
    "-q:v",
    "2",
    abs(video.poster),
  ]);
}

function writeVideo(video, info) {
  mkdirSync(path.dirname(abs(video.output)), { recursive: true });
  console.log(`video ${video.output} hdr=${info.hdr}`);
  const args = [
    "-y",
    "-hide_banner",
    "-i",
    abs(video.input),
    "-map",
    "0:v:0",
    "-map",
    "0:a:0?",
    "-vf",
    info.hdr ? hdrFilter : sdrFilter,
    "-c:v",
    "libx264",
    "-preset",
    "fast",
    "-crf",
    "21",
    "-maxrate",
    "10M",
    "-bufsize",
    "20M",
    "-profile:v",
    "high",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "160k",
    "-movflags",
    "+faststart",
  ];

  if (info.hdr) {
    args.push(
      "-color_primaries",
      "bt709",
      "-color_trc",
      "bt709",
      "-colorspace",
      "bt709",
    );
  }

  args.push(abs(video.output));
  run(args);
}

const photosOnly = process.argv.includes("--photos");
const postersOnly = process.argv.includes("--posters");
const videosOnly = process.argv.includes("--videos");
const all = !photosOnly && !postersOnly && !videosOnly;

const info = new Map(videos.map((video) => [video.output, probe(video.input)]));

if (all || photosOnly) {
  await writePhotos();
}

if (all || postersOnly) {
  for (const video of videos) {
    writePoster(video, info.get(video.output));
  }
}

if (all || videosOnly) {
  for (const video of videos) {
    writeVideo(video, info.get(video.output));
  }
}

console.log("media ready");

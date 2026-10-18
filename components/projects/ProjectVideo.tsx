"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { allowedEmbedUrl } from "@/lib/links";

type ProjectVideoProps = {
  src?: string;
  embedUrl?: string;
  poster: string;
  title: string;
  orientation: "landscape" | "portrait";
  playLabel?: string;
  iconOnly?: boolean;
};

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function ProjectVideo({
  src,
  embedUrl,
  poster,
  title,
  orientation,
  playLabel = "Play",
  iconOnly = false,
}: ProjectVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const embed = allowedEmbedUrl(embedUrl);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTime = () => setTime(video.currentTime);
    const onMeta = () => setDuration(video.duration || 0);
    const onPlay = () => {
      setStarted(true);
      setPlaying(true);
    };
    const onPause = () => setPlaying(false);

    video.addEventListener("timeupdate", onTime);
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [src]);

  function play() {
    const video = videoRef.current;
    if (!video) return;
    void video.play().catch(() => setFailed(true));
  }

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) play();
    else video.pause();
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  function toggleFullscreen() {
    const node = frameRef.current;
    const video = videoRef.current as
      | (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
      | null;

    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }

    if (node?.requestFullscreen) {
      void node.requestFullscreen().catch(() => {
        video?.webkitEnterFullscreen?.();
      });
      return;
    }

    video?.webkitEnterFullscreen?.();
  }

  if (!src && embed) {
    return (
      <div className="film-fit" data-orientation={orientation}>
      <div ref={frameRef} className="film-stage" data-orientation={orientation}>
        <iframe
          src={embed}
          title={title}
          allow="fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      </div>
    );
  }

  if (!src) {
    return (
      <div className="film-fit" data-orientation={orientation}>
        <div className="film-stage" data-orientation={orientation}>
          <Image src={poster} alt={`Still from ${title}`} fill sizes="100vw" className="object-contain" />
        </div>
      </div>
    );
  }

  return (
    <div ref={frameRef} className="film-player w-full max-w-full">
      <div className="film-fit" data-orientation={orientation}>
      <div className="film-stage" data-orientation={orientation}>
        <video
          ref={videoRef}
          poster={poster}
          playsInline
          preload="none"
          aria-label={title}
          onError={() => setFailed(true)}
        >
          <source src={src} type="video/mp4" />
        </video>

        {started ? null : (
          <button
            type="button"
            className="absolute inset-0 flex items-center justify-center gap-3 bg-background/20 px-4 sm:gap-4"
            aria-label={`${playLabel} ${title}`}
            onClick={play}
          >
            <motion.span
              className={`flex shrink-0 items-center justify-center rounded-full ${
                iconOnly
                  ? "h-14 w-14 bg-white text-black sm:h-16 sm:w-16"
                  : "h-14 w-14 border border-ink/80 text-ink sm:h-20 sm:w-20"
              }`}
              whileHover={reduce ? undefined : { scale: 1.06 }}
            >
              <svg viewBox="0 0 24 24" className="ml-1 h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5-11-6.5z" fill="currentColor" />
              </svg>
            </motion.span>
            {iconOnly ? null : (
              <span className="text-[0.68rem] uppercase tracking-[0.16em] text-ink sm:text-[0.72rem] sm:tracking-[0.18em]">
                {playLabel}
              </span>
            )}
          </button>
        )}

        {failed ? (
          <p className="absolute inset-x-0 bottom-0 bg-background/92 px-4 py-3 text-sm text-ink" role="alert">
            This video could not be played in the browser.
          </p>
        ) : null}
      </div>
      </div>

      {started ? (
        <div className="mt-3 flex w-full max-w-full items-center gap-1 sm:gap-2">
          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-ink"
            onClick={togglePlay}
            aria-label={playing ? `Pause ${title}` : `Play ${title}`}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path d="M7 5h3.5v14H7V5zm6.5 0H17v14h-3.5V5z" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5-11-6.5z" fill="currentColor" />
              </svg>
            )}
          </button>
          <span className="w-16 shrink-0 text-[0.68rem] tabular-nums text-muted sm:w-[4.5rem]">
            {formatTime(time)}
          </span>
          <input
            className="video-range h-11 min-w-0 flex-1 cursor-pointer"
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(time, duration || 0)}
            aria-label="Playback position"
            onChange={(event) => {
              const next = Number(event.target.value);
              const video = videoRef.current;
              if (video) video.currentTime = next;
              setTime(next);
            }}
          />
          <span className="hidden w-12 shrink-0 text-right text-[0.68rem] tabular-nums text-muted sm:inline">
            {formatTime(duration)}
          </span>
          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-ink"
            onClick={toggleMute}
            aria-pressed={muted}
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path
                  d="M4 9v6h4l5 4V5L8 9H4zm12.2 3 2.4-2.4 1.4 1.4L17.6 13.4l2.4 2.4-1.4 1.4-2.4-2.4-2.4 2.4-1.4-1.4 2.4-2.4-2.4-2.4 1.4-1.4 2.4 2.4z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path d="M4 9v6h4l5 4V5L8 9H4zm11.5 3a3.5 3.5 0 0 0-1.5-2.9v5.8a3.5 3.5 0 0 0 1.5-2.9z" fill="currentColor" />
              </svg>
            )}
          </button>
          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-ink"
            onClick={toggleFullscreen}
            aria-label="Full screen"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                d="M5 9V5h4v2H7v2H5zm10-4h4v4h-2V7h-2V5zM7 17v-2h2v4H5v-2h2zm12-2h2v4h-4v-2h2v-2z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}

"use client";

import * as React from "react";

const DEFAULT_DURATION = 280;
const DEFAULT_STAGGER = 70;
const EASING = "cubic-bezier(0.45, 0, 0.20, 1)";
const EASING_WITH_BOUNCE = "cubic-bezier(0.34, 1.08, 0.64, 1)";

function easeOdometer(t: number) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return 1 - Math.pow(1 - t, 3);
}
function easeWithBounce(t: number) {
  const c1 = 1.15;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

type DigitDirection = "up" | "down";

function getDigitDelta(from: number, to: number, direction: DigitDirection, radix = 10) {
  const fromBase = 19 - from;
  const toBase = 19 - to;
  let delta = toBase - fromBase;
  if (direction === "down") {
    if (delta < 0) delta += radix;
  } else {
    if (delta > 0) delta -= radix;
  }
  return delta;
}

type OdometerDigitProps = {
  digit: number;
  prevDigit: number;
  direction?: DigitDirection;
  duration?: number;
  delay?: number;
  digitHeight?: number;
  digitWidth?: number;
  fontSize?: string;
  withBounce?: boolean;
  frame?: number;
  fps?: number;
  radix?: number;
  isFirstChange?: boolean;
};

function OdometerDigit({
  digit,
  prevDigit,
  direction = "down",
  duration = DEFAULT_DURATION,
  delay = 0,
  digitHeight = 54,
  digitWidth = 36,
  fontSize = "28px",
  withBounce = false,
  frame,
  fps = 30,
  radix = 10,
  isFirstChange = true,
}: OdometerDigitProps) {
  const [virtual, setVirtual] = React.useState(() => 19 - prevDigit);
  const [target, setTarget] = React.useState(() => 19 - digit);
  const [animating, setAnimating] = React.useState(false);
  const [internalSuppress, setInternalSuppress] = React.useState(false);
  const [startFrame, setStartFrame] = React.useState<number | null>(null);
  const virtualRef = React.useRef(virtual);

  React.useEffect(() => {
    virtualRef.current = virtual;
  }, [virtual]);

  const suppress = isFirstChange || internalSuppress;

  // React to digit change — schedule reel animation
  React.useEffect(() => {
    if (prevDigit === digit) return;

    const delta = getDigitDelta(prevDigit, digit, direction, radix);
    const newTarget = virtualRef.current + delta;

    setTarget(newTarget);
    setAnimating(true);
    setInternalSuppress(false);
    if (typeof frame === "number") {
      setStartFrame(frame);
    }

    const timer = window.setTimeout(() => {
      const normalized = 19 - digit;
      setVirtual(normalized);
      setTarget(normalized);
      setAnimating(false);
      setInternalSuppress(true);
      window.setTimeout(() => setInternalSuppress(false), 30);
    }, duration + delay + 20);

    return () => clearTimeout(timer);
  }, [digit, prevDigit, direction, radix, duration, delay, frame]);

  const isFrameDriven = typeof frame === "number" && typeof fps === "number";

  let transform = `translateY(${-target * digitHeight}px)`;
  let transition = suppress ? "none" : `transform ${duration}ms ${withBounce ? EASING_WITH_BOUNCE : EASING} ${delay}ms`;
  let willChange: "transform" | undefined = suppress ? undefined : animating ? "transform" : undefined;

  if (isFrameDriven && startFrame !== null && animating) {
    const elapsed = (frame as number) - startFrame;
    const delayFrames = (delay / 1000) * (fps as number);
    const durationFrames = (duration / 1000) * (fps as number);
    let t = 0;
    if (elapsed < delayFrames) t = 0;
    else if (elapsed < delayFrames + durationFrames) {
      t = (elapsed - delayFrames) / durationFrames;
      t = withBounce ? easeWithBounce(t) : easeOdometer(t);
    } else {
      t = 1;
    }
    const current = virtual + t * (target - virtual);
    transform = `translateY(${-current * digitHeight}px)`;
    transition = "none";
    willChange = undefined;
  }

  const strip = React.useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < 30; i++) arr.push((9 - (i % 10) + 10) % 10);
    return arr;
  }, []);

  return (
    <div
      className="relative overflow-hidden select-none"
      style={{
        width: digitWidth,
        height: digitHeight,
        borderRadius: 10,
        background: "linear-gradient(180deg, #0f0f12 0%, #1a1a1e 12%, #1e1e22 50%, #1a1a1e 88%, #0f0f12 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.7), 0 6px 14px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.6)",
        perspective: "700px",
      }}
      aria-hidden="true"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10"
        style={{
          height: digitHeight * 0.28,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.68), rgba(0,0,0,0.22) 55%, transparent)",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
        style={{
          height: digitHeight * 0.28,
          background: "linear-gradient(to top, rgba(0,0,0,0.68), rgba(0,0,0,0.22) 55%, transparent)",
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-[10px]"
        style={{ boxShadow: "inset 0 1px 1.5px rgba(255,255,255,0.08), inset 0 -1px 1px rgba(0,0,0,0.5)" }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-px opacity-[0.07]"
        style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)" }}
      />
      <div style={{ transform, transition, willChange, display: "flex", flexDirection: "column" }}>
        {strip.map((n, i) => (
          <div
            key={i}
            style={{
              width: digitWidth,
              height: digitHeight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize,
              fontWeight: 800,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              fontFamily: "var(--font-display), ui-monospace, SFMono-Regular, Menlo, monospace",
              color: "#f4f4f5",
              textShadow: "0 1px 0 rgba(0,0,0,0.8), 0 0 12px rgba(255,255,255,0.06)",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          >
            {n}
          </div>
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-[10px]"
        style={{ background: "linear-gradient(to bottom, rgba(9,9,11,0.18), transparent 18%, transparent 82%, rgba(9,9,11,0.18))" }}
      />
    </div>
  );
}

export interface OdometerCountdownProps {
  value: number | string;
  prevValue?: number | string;
  duration?: number;
  stagger?: number;
  digitCount?: number;
  gap?: number | string;
  digitWidth?: number;
  digitHeight?: number;
  fontSize?: string;
  withBounce?: boolean;
  direction?: DigitDirection;
  frame?: number;
  fps?: number;
  className?: string;
  style?: React.CSSProperties;
  radixMap?: Record<number, number>;
}

function normalizeValueToString(value: number | string, digitCount?: number) {
  let s = String(value);
  if (typeof value === "number" && digitCount) s = String(value).padStart(digitCount, "0");
  else if (typeof value === "string" && digitCount) {
    const digits = s.replace(/[^0-9]/g, "").length;
    if (digits < digitCount) s = "0".repeat(digitCount - digits) + s;
  }
  return s;
}

export function OdometerCountdown({
  value,
  prevValue,
  duration = DEFAULT_DURATION,
  stagger = DEFAULT_STAGGER,
  digitCount,
  gap = 6,
  digitWidth = 36,
  digitHeight = 54,
  fontSize = "28px",
  withBounce = false,
  direction,
  frame,
  fps = 30,
  className,
  style,
  radixMap,
}: OdometerCountdownProps) {
  const currStr = React.useMemo(() => normalizeValueToString(value, digitCount), [value, digitCount]);
  const prevStrRaw = React.useMemo(
    () => (prevValue !== undefined ? normalizeValueToString(prevValue, digitCount) : currStr),
    [prevValue, digitCount, currStr]
  );

  // Backward compatibility: if prevValue not provided, treat as no previous (no animation on first mount)
  // We track whether this is the very first render for this value
  const [isFirst, setIsFirst] = React.useState(true);
  const prevCurrRef = React.useRef(currStr);
  React.useEffect(() => {
    if (prevCurrRef.current !== currStr) {
      prevCurrRef.current = currStr;
      setIsFirst(false);
    }
  }, [currStr]);

  const displayCurr = currStr;
  const displayPrev = prevValue !== undefined ? prevStrRaw : isFirst ? currStr : prevStrRaw;

  const inferredDirection: DigitDirection = React.useMemo(() => {
    if (direction) return direction;
    const a = displayPrev.replace(/[^0-9]/g, "");
    const b = displayCurr.replace(/[^0-9]/g, "");
    if (a && b) {
      const na = parseInt(a, 10);
      const nb = parseInt(b, 10);
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return nb < na ? "down" : "up";
    }
    return "down";
  }, [displayPrev, displayCurr, direction]);

  const currChars = displayCurr.split("");
  const prevChars = displayPrev.split("");
  while (prevChars.length < currChars.length) prevChars.unshift("0");
  while (currChars.length < prevChars.length) currChars.unshift("0");

  const gapValue = typeof gap === "number" ? `${gap}px` : gap;

  return (
    <div
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: gapValue, perspective: "900px", ...style }}
      role="timer"
      aria-live="off"
      aria-label={displayCurr}
      suppressHydrationWarning
    >
      {currChars.map((ch, i) => {
        if (ch === ":" || ch === " " || ch === "-" || ch === ".") {
          return (
            <div
              key={`sep-${i}`}
              style={{
                width: 8,
                height: digitHeight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: `calc(${fontSize} * 0.85)`,
                fontWeight: 800,
                color: "rgba(244,244,245,0.95)",
                fontVariantNumeric: "tabular-nums",
                textShadow: "0 1px 0 rgba(0,0,0,0.8)",
                fontFamily: "var(--font-display), monospace",
                userSelect: "none",
              }}
              aria-hidden="true"
            >
              {ch}
            </div>
          );
        }
        const digit = parseInt(ch, 10);
        const prevDigit = parseInt(prevChars[i] ?? ch, 10);
        const isDigit = !Number.isNaN(digit) && !Number.isNaN(prevDigit);
        if (!isDigit) {
          return (
            <div
              key={`char-${i}-${ch}`}
              style={{ width: digitWidth, height: digitHeight, display: "flex", alignItems: "center", justifyContent: "center", fontSize, fontWeight: 800 }}
            >
              {ch}
            </div>
          );
        }
        const digitCountOnly = currChars.filter((c) => /[0-9]/.test(c)).length;
        const digitIndexAmongDigits = currChars.slice(0, i).filter((c) => /[0-9]/.test(c)).length;
        const delay = (digitCountOnly - 1 - digitIndexAmongDigits) * stagger;
        const radix = radixMap?.[i] ?? 10;
        return (
          <OdometerDigit
            key={`digit-${i}`}
            digit={digit}
            prevDigit={Number.isNaN(prevDigit) ? digit : prevDigit}
            direction={inferredDirection}
            duration={duration}
            delay={isFirst ? 0 : delay}
            digitHeight={digitHeight}
            digitWidth={digitWidth}
            fontSize={fontSize}
            withBounce={withBounce}
            frame={frame}
            fps={fps}
            radix={radix}
            isFirstChange={isFirst}
          />
        );
      })}
    </div>
  );
}

export function formatTime(totalSeconds: number, opts?: { showHours?: boolean; padHours?: boolean }) {
  const showHours = opts?.showHours ?? true;
  const padHours = opts?.padHours ?? true;
  const s = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  const hh = padHours ? String(hrs).padStart(2, "0") : String(hrs);
  const mm = String(mins).padStart(2, "0");
  const ss = String(secs).padStart(2, "0");
  if (showHours) return `${hh}:${mm}:${ss}`;
  return `${mm}:${ss}`;
}

export function OdometerTime({
  seconds,
  prevSeconds,
  duration,
  stagger,
  digitWidth,
  digitHeight,
  fontSize,
  gap,
  withBounce,
  direction,
  frame,
  fps,
  showHours = true,
}: {
  seconds: number;
  prevSeconds?: number;
  duration?: number;
  stagger?: number;
  digitWidth?: number;
  digitHeight?: number;
  fontSize?: string;
  gap?: number | string;
  withBounce?: boolean;
  direction?: DigitDirection;
  frame?: number;
  fps?: number;
  showHours?: boolean;
}) {
  const str = formatTime(seconds, { showHours });
  const prevStr = prevSeconds !== undefined ? formatTime(prevSeconds, { showHours }) : undefined;
  const radixMap: Record<number, number> = {};
  if (str.length === 8) {
    radixMap[3] = 6;
    radixMap[6] = 6;
  } else if (str.length === 5) {
    radixMap[0] = 6;
    radixMap[3] = 6;
  }
  return (
    <OdometerCountdown
      value={str}
      prevValue={prevStr}
      duration={duration}
      stagger={stagger}
      gap={gap}
      digitWidth={digitWidth}
      digitHeight={digitHeight}
      fontSize={fontSize}
      withBounce={withBounce}
      direction={direction}
      frame={frame}
      fps={fps}
      radixMap={radixMap}
    />
  );
}

export function useOdometerCountdown({
  start,
  target = 0,
  durationMs = 1000,
  autoPlay = true,
  onComplete,
}: {
  start: number;
  target?: number;
  durationMs?: number;
  autoPlay?: boolean;
  onComplete?: () => void;
}) {
  const [value, setValue] = React.useState(start);
  const [prev, setPrev] = React.useState(start);
  const [running, setRunning] = React.useState(autoPlay);

  const tick = React.useCallback(() => {
    setValue((v) => {
      const next = v > target ? v - 1 : v < target ? v + 1 : v;
      if (next !== v) setPrev(v);
      if (next === target) {
        setRunning(false);
        onComplete?.();
      }
      return next;
    });
  }, [target, onComplete]);

  React.useEffect(() => {
    if (!running) return;
    if (value === target) return;
    const id = window.setInterval(tick, durationMs);
    return () => clearInterval(id);
  }, [running, value, target, durationMs, tick]);

  const pause = React.useCallback(() => setRunning(false), []);
  const resume = React.useCallback(() => {
    if (value !== target) setRunning(true);
  }, [value, target]);
  const reset = React.useCallback(
    (newStart?: number) => {
      const s = newStart ?? start;
      setPrev(s);
      setValue(s);
      setRunning(autoPlay);
    },
    [start, autoPlay]
  );

  return { value, prev, running, pause, resume, reset, setValue };
}

export default OdometerCountdown;

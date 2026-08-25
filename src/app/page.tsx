"use client";

import { useState, useEffect, useRef } from "react";
import { WaitlistForm } from "@/components/WaitlistForm";
import CursorRingField from "@/components/ui/cursor-ring-field";
import { OdometerCountdown } from "@/components/ui/odometer-countdown";

const LAUNCH_DATE = new Date("2026-09-10T12:00:00").getTime();

function formatLaunchRemaining(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  const dd = String(days).padStart(2, "0");
  const hh = String(hours).padStart(2, "0");
  const mm = String(mins).padStart(2, "0");
  const ss = String(secs).padStart(2, "0");
  return `${dd}:${hh}:${mm}:${ss}`;
}

export default function Home() {
  const [timeStr, setTimeStr] = useState("00:00:00:00");
  const [prevTimeStr, setPrevTimeStr] = useState("00:00:00:00");
  const [mounted, setMounted] = useState(false);

  const timeStrRef = useRef(timeStr);
  useEffect(() => {
    timeStrRef.current = timeStr;
  }, [timeStr]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration: must set mounted after client mount
    setMounted(true);
    const tick = () => {
      const next = formatLaunchRemaining(LAUNCH_DATE - Date.now());
      const prev = timeStrRef.current;
      if (next !== prev) {
        setPrevTimeStr(prev);
        setTimeStr(next);
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#09090b] text-zinc-100 overflow-hidden">
      <CursorRingField
        density={240}
        dotSize={90}
        speed={13}
        cameraDistance={120}
        colors={["#00FFDA", "#FFF500"]}
        style={{ position: "fixed", inset: 0, opacity: 0.5 }}
      />

      <main className="relative z-10 flex flex-1 items-center justify-center">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:py-14 flex flex-col items-center text-center">
          {/* logo + title — increased */}
          <div className="flex items-center justify-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Uphook%20logo.png"
              alt="Uphook logo"
              className="h-12 w-12 object-contain rounded-lg"
              width={48}
              height={48}
            />
            <span className="font-semibold tracking-tight text-white text-2xl">Uphook</span>
          </div>

          {/* heading — one colour #F6F7ED, bigger */}
          <h1 className="mt-8 font-[var(--font-display)] text-6xl sm:text-7xl lg:text-[84px] xl:text-[96px] font-bold tracking-[-0.04em] leading-[0.92] text-[#F6F7ED]">
            Jobs That Fit
          </h1>

          {/* launch timer — bigger */}
          <div className="mt-10 flex flex-col items-center" suppressHydrationWarning>
            <span className="text-xs tracking-[0.18em] uppercase font-semibold text-zinc-400">Launch in</span>
            <div className="mt-4" suppressHydrationWarning>
              {mounted ? (
                <OdometerCountdown
                  value={timeStr}
                  prevValue={prevTimeStr}
                  duration={320}
                  gap={8}
                  digitWidth={44}
                  digitHeight={64}
                  fontSize="30px"
                />
              ) : (
                <OdometerCountdown
                  value="00:00:00:00"
                  prevValue="00:00:00:00"
                  duration={320}
                  gap={8}
                  digitWidth={44}
                  digitHeight={64}
                  fontSize="30px"
                />
              )}
            </div>
          </div>

          {/* fields — same as popup, now inline centered */}
          <div className="mt-10 w-full max-w-[440px]">
            <WaitlistForm />
          </div>
        </div>
      </main>

      <footer className="relative z-10">
        <div className="mx-auto max-w-6xl px-6 py-8 flex items-center justify-center text-center text-xs text-zinc-500">
          <span>© {new Date().getFullYear()} Uphook. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

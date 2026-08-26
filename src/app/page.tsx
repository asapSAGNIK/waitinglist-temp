"use client";

import { useState, useEffect, useRef } from "react";
import { WaitlistForm } from "@/components/WaitlistForm";
import { ParticleWave } from "@/components/ui/particle-wave";
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
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Responsive odometer sizing
  const timerConfig = isMobile
    ? { digitWidth: 26, digitHeight: 38, fontSize: "16px", gap: 4 }
    : { digitWidth: 44, digitHeight: 64, fontSize: "30px", gap: 8 };

  return (
    <div className="flex min-h-[100dvh] min-h-screen flex-col bg-[#09090b] text-zinc-100 overflow-x-hidden">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ opacity: isMobile ? 0.9 : 0.5 }}
        aria-hidden="true"
      >
        <ParticleWave />
      </div>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 sm:px-6">
        <div className="mx-auto w-full max-w-6xl py-6 sm:py-10 lg:py-14 flex flex-col items-center text-center">
          {/* logo + title */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Uphook%20logo.png"
              alt="Uphook logo"
              className="h-9 w-9 sm:h-12 sm:w-12 object-contain rounded-lg"
              width={48}
              height={48}
            />
            <span className="font-semibold tracking-tight text-white text-xl sm:text-2xl">Uphook</span>
          </div>

          {/* heading — matched to timer/field width (440px) */}
          <h1 className="mt-6 sm:mt-8 font-['Satoshi',sans-serif] w-full max-w-[440px] text-center text-[2.92rem] leading-[0.95] sm:text-[3.45rem] md:text-[4.05rem] lg:text-[4.42rem] xl:text-[4.72rem] font-bold tracking-[-0.03em] text-[#F6F7ED] whitespace-nowrap">
            Jobs That Fit
          </h1>

          {/* launch timer — matched to field width (440px) */}
          <div className="mt-6 sm:mt-10 flex flex-col items-center w-full max-w-[440px]" suppressHydrationWarning>
            <span className="text-[10px] sm:text-xs tracking-[0.18em] uppercase font-semibold text-zinc-400">Launch in</span>
            <div className="mt-3 sm:mt-4 w-full flex justify-center overflow-hidden" suppressHydrationWarning>
              <div className="w-full flex justify-center">
                {mounted ? (
                  <OdometerCountdown
                    value={timeStr}
                    prevValue={prevTimeStr}
                    duration={320}
                    gap={timerConfig.gap}
                    digitWidth={timerConfig.digitWidth}
                    digitHeight={timerConfig.digitHeight}
                    fontSize={timerConfig.fontSize}
                    className="w-full justify-between"
                    style={{ width: "100%" }}
                  />
                ) : (
                  <OdometerCountdown
                    value="00:00:00:00"
                    prevValue="00:00:00:00"
                    duration={320}
                    gap={timerConfig.gap}
                    digitWidth={timerConfig.digitWidth}
                    digitHeight={timerConfig.digitHeight}
                    fontSize={timerConfig.fontSize}
                    className="w-full justify-between"
                    style={{ width: "100%" }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* fields — same as popup, now inline centered */}
          <div className="mt-6 sm:mt-10 w-full max-w-[440px] px-2 sm:px-0">
            <WaitlistForm />
          </div>
        </div>
      </main>

      <footer className="relative z-10">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-6 sm:py-8 flex items-center justify-center text-center text-[11px] sm:text-xs text-zinc-500">
          <span>© {new Date().getFullYear()} Uphook. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

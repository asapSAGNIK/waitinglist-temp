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
  const [open, setOpen] = useState(false);
  // Hydration-safe: server and client initially render same placeholder, real time set after mount
  const [timeStr, setTimeStr] = useState("00:00:00:00");
  const [prevTimeStr, setPrevTimeStr] = useState("00:00:00:00");
  const [mounted, setMounted] = useState(false);

  // Keep latest timeStr in ref to avoid stale closure in interval
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="flex min-h-screen flex-col bg-[#09090b] text-zinc-100 overflow-hidden">
      {/* originkit cursor-ring-field background */}
      <CursorRingField
        density={240}
        dotSize={90}
        speed={13}
        cameraDistance={120}
        colors={["#00FFDA", "#FFF500"]}
        style={{ position: "fixed", inset: 0, opacity: 0.5 }}
      />

      <main className="relative z-10 flex flex-1 items-center">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* left — text till center */}
            <div className="flex flex-col items-start text-left">
              {/* Uphook branding — moved up */}
              <div className="flex items-center gap-3 mb-40 -mt-8 sm:-mt-12">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/Uphook%20logo.png"
                  alt="Uphook logo"
                  className="h-9 w-9 object-contain rounded-lg"
                  width={36}
                  height={36}
                />
                <span className="font-semibold tracking-tight text-white text-lg">Uphook</span>
              </div>

              <h1 className="font-[var(--font-display)] text-5xl sm:text-6xl lg:text-[72px] xl:text-[82px] font-bold tracking-[-0.04em] leading-[0.92] text-white">
                Something
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent"> amazing</span>
                <br />
                is coming.
              </h1>

              {/* Wait List button — Uiverse.io by mrhyddenn */}
              <button onClick={() => setOpen(true)} className="waitlist-uiverse mt-10">
                Wait List
              </button>
            </div>

            {/* right — Launch timer */}
            <div className="flex flex-col items-start lg:items-start lg:pl-12" suppressHydrationWarning>
              <span className="text-[10px] tracking-[0.18em] uppercase font-semibold text-zinc-500">Launch in</span>
              <div className="mt-3" suppressHydrationWarning>
                {mounted ? (
                  <OdometerCountdown
                    value={timeStr}
                    prevValue={prevTimeStr}
                    duration={320}
                    gap={6}
                    digitWidth={36}
                    digitHeight={52}
                    fontSize="24px"
                  />
                ) : (
                  <OdometerCountdown
                    value="00:00:00:00"
                    prevValue="00:00:00:00"
                    duration={320}
                    gap={6}
                    digitWidth={36}
                    digitHeight={52}
                    fontSize="24px"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* centered popup */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xl"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-[440px]">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute -top-10 right-0 text-zinc-400 hover:text-white transition text-xl leading-none p-1"
            >
              ✕
            </button>
            <WaitlistForm />
          </div>
        </div>
      )}

      <footer className="relative z-10 ">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-zinc-500">
          <span>© {new Date().getFullYear()} Uphook. All rights reserved.</span>
        </div>
      </footer>

      <style>{`
        .waitlist-uiverse {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 20px;
          border-radius: 7px;
          border: 1px solid rgb(61, 106, 255);
          font-size: 14px;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 2px;
          background: transparent;
          color: #fff;
          overflow: hidden;
          box-shadow: 0 0 0 0 transparent;
          -webkit-transition: all 0.2s ease-in;
          -moz-transition: all 0.2s ease-in;
          transition: all 0.2s ease-in;
          cursor: pointer;
          text-decoration: none;
        }
        .waitlist-uiverse:hover {
          background: rgb(61, 106, 255);
          box-shadow: 0 0 30px 5px rgba(0, 142, 236, 0.815);
          -webkit-transition: all 0.2s ease-out;
          -moz-transition: all 0.2s ease-out;
          transition: all 0.2s ease-out;
          color: #fff;
        }
        .waitlist-uiverse:hover::before {
          -webkit-animation: sh02 0.5s 0s linear;
          -moz-animation: sh02 0.5s 0s linear;
          animation: sh02 0.5s 0s linear;
        }
        .waitlist-uiverse::before {
          content: '';
          display: block;
          width: 0px;
          height: 86%;
          position: absolute;
          top: 7%;
          left: 0%;
          opacity: 0;
          background: #fff;
          box-shadow: 0 0 50px 30px #fff;
          -webkit-transform: skewX(-20deg);
          -moz-transform: skewX(-20deg);
          -ms-transform: skewX(-20deg);
          -o-transform: skewX(-20deg);
          transform: skewX(-20deg);
          pointer-events: none;
        }
        @keyframes sh02 {
          from {
            opacity: 0;
            left: 0%;
          }
          50% {
            opacity: 1;
          }
          to {
            opacity: 0;
            left: 100%;
          }
        }
        .waitlist-uiverse:active {
          box-shadow: 0 0 0 0 transparent;
          -webkit-transition: box-shadow 0.2s ease-in;
          -moz-transition: box-shadow 0.2s ease-in;
          transition: box-shadow 0.2s ease-in;
        }
      `}</style>
    </div>
  );
}

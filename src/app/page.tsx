"use client";

import { useState, useEffect } from "react";
import { WaitlistForm } from "@/components/WaitlistForm";
import CursorRingField from "@/components/ui/cursor-ring-field";

export default function Home() {
  const [open, setOpen] = useState(false);

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

            {/* right — empty for later use */}
            <div className="hidden lg:block" aria-hidden="true" />
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

import { WaitlistForm } from "@/components/WaitlistForm";
import CursorRingField from "@/components/ui/cursor-ring-field";
import Link from "next/link";

export default function Home() {
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

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-12 sm:py-16">
        <div className="w-full max-w-[480px]">
          {/* Uphook branding - replaces placeholder logo */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex items-center gap-3">
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
          </div>

          <h1 className="text-center font-[var(--font-display)] text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-[-0.03em] leading-[0.95] text-white">
            Something
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent"> amazing</span>
            <br />
            is coming.
          </h1>

          <div id="waitlist" className="mt-8 scroll-mt-24">
            <WaitlistForm />
          </div>
        </div>
      </main>

      <footer className="relative z-10 ">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <span>© {new Date().getFullYear()} Uphook. All rights reserved.</span>


        </div>
      </footer>
    </div>
  );
}

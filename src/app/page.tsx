import { WaitlistForm } from "@/components/WaitlistForm";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#09090b] text-zinc-100 overflow-hidden">
      {/* bg gradients */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,90,255,0.25),transparent),radial-gradient(ellipse_80%_80%_at_80%_80%,rgba(6,182,212,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* nav */}
      <header className="relative z-10 sticky top-0 backdrop-blur-xl bg-zinc-950/40 border-b border-zinc-800/50">
        <div className="mx-auto max-w-6xl px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-400 flex items-center justify-center font-bold text-white text-sm">◆</div>
            <span className="font-semibold tracking-tight text-white">waitlist</span>
            <span className="hidden sm:inline-flex ml-2 rounded-full bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-400">Beta</span>
          </div>
          <nav className="flex items-center gap-2">
            <span className="hidden md:inline text-xs text-zinc-500 mr-2">12,483+ already joined</span>
            <Link href="/admin" className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition">
              Admin →
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-12 sm:py-16">
        <div className="w-full max-w-[480px]">
          <h1 className="text-center font-[var(--font-display)] text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-[-0.03em] leading-[0.95] text-white">
            Something
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent"> amazing</span>
            <br />
            is coming.
          </h1>

          <div id="waitlist" className="mt-8 scroll-mt-24">
            <WaitlistForm />
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Encrypted & secure. Supabase + Resend.
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-zinc-900">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <span>© {new Date().getFullYear()} Waitlist. All rights reserved. Built with Next.js + Supabase.</span>
          <span className="flex gap-4">
            <Link href="/admin" className="hover:text-zinc-300">Admin</Link>
            <a href="https://supabase.com" target="_blank" className="hover:text-zinc-300">Supabase</a>
            <a href="https://resend.com" target="_blank" className="hover:text-zinc-300">Resend</a>
          </span>
        </div>
      </footer>
    </div>
  );
}

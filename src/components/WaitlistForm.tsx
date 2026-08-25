"use client";

import { useState } from "react";

type SuccessData = {
  id: string;
  position: number;
  email: string;
  name: string;
  alreadyExists?: boolean;
};

export function WaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessData | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      setSuccess({
        id: data.id,
        position: data.position,
        email: data.email,
        name: data.name,
        alreadyExists: data.alreadyExists,
      });
      setName("");
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join waitlist");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-violet-500/20 bg-zinc-900/80 backdrop-blur p-6 sm:p-7 shadow-2xl shadow-violet-500/10">
        <div className="flex flex-col items-center text-center">
          <div className="tick-pop flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 ring-4 ring-emerald-500/20">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h3 className="mt-4 text-base font-semibold text-white">
            {success.alreadyExists ? `You’re already on the list, ${success.name}!` : `You’re in, ${success.name}! 🎉`}
          </h3>
          <p className="mt-1 text-sm leading-6 text-zinc-400">
            {success.alreadyExists
              ? `We found you! You’re still secured at position `
              : `Welcome to the waitlist. Check your inbox at `}
            {!success.alreadyExists && (
              <span className="font-medium text-zinc-200">{success.email}</span>
            )}
            {!success.alreadyExists && ` — we’ve sent a confirmation.`}
          </p>

          <div className="mt-6 text-center">
            <div className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">Your Position</div>
            <div className="mt-1 text-4xl font-bold tracking-tight text-white">#{success.position}</div>
          </div>

          <p className="mt-4 text-xs leading-5 text-zinc-500">
            We’ll email you at <span className="text-zinc-300">{success.email}</span> with the latest updates.
          </p>

          <button
            onClick={() => setSuccess(null)}
            className="mt-5 text-sm font-medium text-violet-400 hover:text-violet-300 transition"
          >
            Join another email →
          </button>
        </div>
        <style>{`
          .tick-pop {
            animation: tickPop 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
          @keyframes tickPop {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.18); opacity: 1; }
            75% { transform: scale(0.92); }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur p-5 sm:p-6 shadow-2xl shadow-black/40" noValidate>
      <div className="space-y-4">
        <div>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            aria-label="Name"
            required
            minLength={2}
            maxLength={60}
            autoComplete="name"
            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition"
          />
        </div>
        <div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            aria-label="Email"
            required
            autoComplete="email"
            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition"
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white text-zinc-950 px-5 py-3.5 text-sm font-semibold hover:bg-zinc-100 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-lg shadow-white/5"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
              Securing your spot...
            </>
          ) : (
            <>
              Join the waitlist
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-60">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>


      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ParticleWave } from "@/components/ui/particle-wave";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b] px-6 py-16 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none" style={{ opacity: 0.5 }} aria-hidden="true">
        <ParticleWave />
      </div>
      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white">
            ← Back to site
          </Link>
          <div className="mt-6 flex items-center justify-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Uphook%20logo.png" alt="Uphook logo" className="h-10 w-10 object-contain rounded-lg" width={40} height={40} />
            <span className="font-semibold tracking-tight text-white">Uphook</span>
          </div>
          <h1 className="mt-4 text-xl font-semibold text-white tracking-tight font-['Satoshi',sans-serif]">Admin Access</h1>
          <p className="mt-2 text-sm text-zinc-400">Enter the admin password to view the waitlist.</p>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur p-6 shadow-2xl">
          <label className="block text-xs font-medium tracking-wide text-zinc-400 uppercase mb-2">Admin password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoFocus
            required
            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
          />
          {error && <div className="mt-3 rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-2.5 text-sm text-red-300">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-white text-zinc-950 px-5 py-3 text-sm font-semibold hover:bg-zinc-100 disabled:opacity-60 transition"
          >
            {loading ? "Checking..." : "Unlock dashboard"}
          </button>
          <p className="mt-3 text-center text-xs text-zinc-500">
            Hint: set <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">ADMIN_PASSWORD</code> in .env
          </p>
        </form>
      </div>
    </div>
  );
}

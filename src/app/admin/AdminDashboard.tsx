"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CursorRingField from "@/components/ui/cursor-ring-field";

type Entry = {
  id: string;
  name: string;
  email: string;
  position: number;
  created_at: string;
  ip_address?: string | null;
  user_agent?: string | null;
};

export function AdminDashboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [count, setCount] = useState(0);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  async function fetchEntries(query: string = q) {
    setLoading(true);
    setError(null);
    try {
      const url = new URL("/api/admin/entries", window.location.origin);
      if (query) url.searchParams.set("q", query);
      url.searchParams.set("limit", "100");
      const res = await fetch(url.toString());
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setEntries(data.entries || []);
      setCount(data.count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEntries("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchEntries(q);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this entry?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/entries?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setEntries((prev) => prev.filter((x) => x.id !== id));
      setCount((c) => Math.max(0, c - 1));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(null);
    }
  }

  function exportCSV() {
    const header = ["position", "name", "email", "id", "created_at", "ip_address"];
    const rows = entries.map((e) => [e.position, `"${e.name.replace(/"/g, '""')}"`, e.email, e.id, e.created_at, e.ip_address || ""]);
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 overflow-hidden relative">
      <CursorRingField
        density={240}
        dotSize={90}
        speed={13}
        cameraDistance={120}
        colors={["#00FFDA", "#FFF500"]}
        style={{ position: "fixed", inset: 0, opacity: 0.5 }}
      />
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-zinc-950/60 border-b border-zinc-800">
        <div className="mx-auto max-w-6xl px-6 h-[64px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Uphook%20logo.png"
              alt="Uphook logo"
              className="h-8 w-8 object-contain rounded-lg"
              width={32}
              height={32}
            />
            <div>
              <div className="text-sm font-semibold tracking-tight text-white">Uphook</div>
              <div className="text-xs text-zinc-500 hidden sm:block">{count} total signups • {entries.length} shown</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden sm:inline-flex rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800">← Site</Link>
            <button onClick={exportCSV} disabled={!entries.length} className="rounded-full bg-zinc-900 border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-800 disabled:opacity-50">
              Export CSV
            </button>
            <button onClick={logout} className="rounded-full bg-white text-zinc-900 px-4 py-2 text-xs font-semibold hover:bg-zinc-100">Logout</button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-8">
        {/* stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="text-xs tracking-widest uppercase font-semibold text-zinc-500">Total signups</div>
            <div className="mt-2 text-3xl font-bold tracking-tight text-white">{count}</div>
            <div className="text-xs text-zinc-500 mt-1">All time • Supabase</div>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="text-xs tracking-widest uppercase font-semibold text-zinc-500">Latest</div>
            <div className="mt-2 text-sm font-medium text-white truncate">{entries[0]?.email || "—"}</div>
            <div className="text-xs text-zinc-500 mt-1">{entries[0] ? new Date(entries[0].created_at).toLocaleString() : "No entries yet"}</div>
          </div>
        </div>

        {/* search */}
        <form onSubmit={onSearch} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            />
          </div>
          <button type="submit" className="rounded-xl bg-white text-zinc-900 px-5 py-3 text-sm font-semibold hover:bg-zinc-100">Search</button>
          {q && <button type="button" onClick={() => { setQ(""); fetchEntries(""); }} className="rounded-xl bg-zinc-900 border border-zinc-800 px-5 py-3 text-sm font-medium text-zinc-300">Clear</button>}
        </form>

        {/* table */}
        <div className="relative z-10 rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden backdrop-blur">
          {loading ? (
            <div className="p-12 text-center">
              <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-white mb-3" />
              <div className="text-sm text-zinc-400">Loading waitlist...</div>
            </div>
          ) : error ? (
            <div className="p-8">
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-300">{error}</div>
              <div className="mt-3 text-xs text-zinc-500">Hint: Have you run <code className="bg-zinc-800 px-1 py-0.5 rounded">supabase.sql</code> in Supabase? Check env vars.</div>
              <button onClick={() => fetchEntries()} className="mt-4 rounded-xl bg-zinc-800 px-4 py-2 text-sm text-white">Retry</button>
            </div>
          ) : entries.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-500 mb-4">∅</div>
              <div className="text-sm font-medium text-white">No signups yet</div>
              <div className="text-sm text-zinc-500 mt-1">Share your landing page to start collecting emails.</div>
              <div className="mt-4 text-xs font-mono text-zinc-600">Table: public.waitlist • Supabase</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-950/60 border-b border-zinc-800 text-xs tracking-widest uppercase text-zinc-500">
                  <tr>
                    <th className="text-left font-semibold px-4 py-3">#</th>
                    <th className="text-left font-semibold px-4 py-3">Name</th>
                    <th className="text-left font-semibold px-4 py-3">Email</th>
                    <th className="text-left font-semibold px-4 py-3 hidden md:table-cell">ID</th>
                    <th className="text-left font-semibold px-4 py-3 hidden lg:table-cell">Joined</th>
                    <th className="text-right font-semibold px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {entries.map((e) => (
                    <tr key={e.id} className="hover:bg-zinc-800/30 transition">
                      <td className="px-4 py-3.5">
                        <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20 px-2 text-xs font-bold">
                          #{e.position}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-white whitespace-nowrap">{e.name}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-200">{e.email}</span>
                          <button
                            onClick={() => navigator.clipboard.writeText(e.email)}
                            className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:text-white border border-zinc-700"
                            title="Copy email"
                          >
                            Copy
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell font-mono text-xs text-zinc-400 max-w-[120px] truncate" title={e.id}>
                        {e.id.slice(0, 8)}…
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell text-xs text-zinc-400 whitespace-nowrap" title={e.ip_address || ""}>
                        {new Date(e.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => handleDelete(e.id)}
                          disabled={deleting === e.id}
                          className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/15 disabled:opacity-50"
                        >
                          {deleting === e.id ? "..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

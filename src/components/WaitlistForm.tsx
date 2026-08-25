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
          {!success.alreadyExists && (
            <p className="mt-1 text-sm leading-6 text-zinc-400">
              Welcome to the waitlist. Check your inbox at <span className="font-medium text-zinc-200">{success.email}</span> — we’ve sent a confirmation.
            </p>
          )}

          <div className="mt-6 text-center">
            <div className="mt-1 text-[22px] sm:text-[26px] font-bold tracking-tight text-white leading-tight">
              You are all in along with <br></br>{1316 + success.position} users.
            </div>
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
    <form onSubmit={onSubmit} className="flex flex-col gap-[18px] w-full bg-transparent" noValidate>
      <div className="field">
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
          className="input-field"
        />
      </div>
      <div className="field">
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          aria-label="Email"
          required
          autoComplete="email"
          className="input-field"
        />
      </div>

      <div className="buttons">
        <button type="submit" disabled={loading}>
          <span></span>
          <p data-title="Join The Waitlist" data-text="Join The Waitlist"></p>
        </button>
      </div>

      {error && <p className="mt-1 text-sm text-red-500 text-center">{error}</p>}

      <style>{`
        .field {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5em;
          border-radius: 4px;
          padding: 0.75em 1em;
          border: 1px solid #F6F7ED;
          outline: none;
          color: white;
          background-color: #000000;
          box-shadow: none;
        }
        .input-field {
          background: none;
          border: none;
          outline: none;
          width: 100%;
          color: #d3d3d3;
          font-size: 16px;
        }
        @media (min-width: 640px) {
          .input-field {
            font-size: 14px;
          }
        }
        .input-field::placeholder {
          color: #8a8a8a;
        }
        /* Nawsome button — adapted to #F6F7ED */
        .buttons {
          display: flex;
          justify-content: center;
          top: 20px;
          left: 20px;
          width: 100%;
        }
        .buttons button {
          width: 60%;
          max-width: 216px;
          height: 50px;
          background-color: #F6F7ED;
          margin: 32px auto 0 auto;
          color: #171717;
          position: relative;
          overflow: hidden;
          font-size: 14px;
          letter-spacing: 1px;
          font-weight: 600;
          text-transform: uppercase;
          transition: all 0.3s ease;
          cursor: pointer;
          border: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 3px;
        }
        .buttons button:before, .buttons button:after {
          content: "";
          position: absolute;
          width: 0;
          height: 2px;
          background-color: #171717;
          transition: all 0.3s cubic-bezier(0.35, 0.1, 0.25, 1);
        }
        .buttons button:before {
          right: 0;
          top: 0;
          transition: all 0.5s cubic-bezier(0.35, 0.1, 0.25, 1);
        }
        .buttons button:after {
          left: 0;
          bottom: 0;
        }
        .buttons button span {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          margin: 0;
          padding: 0;
          z-index: 1;
        }
        .buttons button span:before, .buttons button span:after {
          content: "";
          position: absolute;
          width: 2px;
          height: 0;
          background-color: #171717;
          transition: all 0.3s cubic-bezier(0.35, 0.1, 0.25, 1);
        }
        .buttons button span:before {
          right: 0;
          top: 0;
          transition: all 0.5s cubic-bezier(0.35, 0.1, 0.25, 1);
        }
        .buttons button span:after {
          left: 0;
          bottom: 0;
        }
        .buttons button p {
          padding: 0;
          margin: 0;
          transition: all 0.4s cubic-bezier(0.35, 0.1, 0.25, 1);
          position: absolute;
          width: 100%;
          height: 100%;
        }
        .buttons button p:before, .buttons button p:after {
          position: absolute;
          width: 100%;
          transition: all 0.4s cubic-bezier(0.35, 0.1, 0.25, 1);
          z-index: 1;
          left: 0;
        }
        .buttons button p:before {
          content: attr(data-title);
          top: 50%;
          transform: translateY(-50%);
        }
        .buttons button p:after {
          content: attr(data-text);
          top: 150%;
          color: #171717;
        }
        .buttons button:hover:before, .buttons button:hover:after {
          width: 100%;
        }
        .buttons button:hover span:before, .buttons button:hover span:after {
          height: 100%;
        }
        .buttons button:hover p:before {
          top: 50%;
          transform: translateY(-50%);
        }
        .buttons button:hover p:after {
          top: 150%;
          transform: none;
        }
        .buttons button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .buttons button:active {
          outline: none;
          border: none;
        }
        .buttons button:focus {
          outline: 0;
        }
        @media (max-width: 640px) {
          .field {
            padding: 0.75em 0.9em;
            border-radius: 4px;
          }
          .input-field {
            font-size: 16px;
          }
          .buttons button {
            height: 52px;
            font-size: 15px;
            letter-spacing: 0.8px;
          }
        }
      `}</style>
    </form>
  );
}

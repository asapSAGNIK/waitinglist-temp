import { NextRequest, NextResponse } from "next/server";
import { waitlistSchema } from "@/lib/validation";
import { supabaseAdmin } from "@/lib/supabase";
import { sendWaitlistEmail } from "@/lib/email";

// Simple in-memory rate limit (resets on deploy) - for production use Upstash Redis
const rateMap = new Map<string, { count: number; ts: number }>();
function isRateLimited(ip: string) {
  const now = Date.now();
  const windowMs = 60_000;
  const max = 5;
  const entry = rateMap.get(ip);
  if (!entry || now - entry.ts > windowMs) {
    rateMap.set(ip, { count: 1, ts: now });
    return false;
  }
  entry.count += 1;
  if (entry.count > max) return true;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || null;

    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = waitlistSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || "Invalid input";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { name, email } = parsed.data;

    // Check for existing email (to avoid duplicate key error and to return existing position)
    const { data: existing, error: selectErr } = await supabaseAdmin
      .from("waitlist")
      .select("id, name, email, position, created_at")
      .eq("email", email)
      .maybeSingle();

    if (selectErr) {
      console.error("[waitlist] select error", selectErr);
      // if table missing, give helpful error
      if (selectErr.message?.includes("does not exist") || selectErr.code === "42P01") {
        return NextResponse.json(
          { error: "Database not initialized. Please run supabase.sql in Supabase SQL Editor." },
          { status: 500 }
        );
      }
    }

    if (existing) {
      // already exists - return same position, optionally re-send email? We choose to not re-send to avoid spam, but inform.
      return NextResponse.json(
        {
          id: existing.id,
          name: existing.name,
          email: existing.email,
          position: existing.position,
          alreadyExists: true,
          message: "You're already on the waitlist",
        },
        { status: 200 }
      );
    }

    // Insert new entry
    const { data: inserted, error: insertErr } = await supabaseAdmin
      .from("waitlist")
      .insert({ name, email, ip_address: ip, user_agent: userAgent })
      .select("id, name, email, position, created_at")
      .single();

    if (insertErr) {
      console.error("[waitlist] insert error", insertErr);
      if (insertErr.code === "23505") {
        // unique violation race condition -> fetch again
        const { data: retry } = await supabaseAdmin.from("waitlist").select("id, name, email, position").eq("email", email).single();
        if (retry) {
          return NextResponse.json({ ...retry, alreadyExists: true }, { status: 200 });
        }
      }
      if (insertErr.message?.includes("does not exist") || insertErr.code === "42P01") {
        return NextResponse.json({ error: "Database not initialized. Run supabase.sql in Supabase." }, { status: 500 });
      }
      return NextResponse.json({ error: "Failed to join waitlist. Try again." }, { status: 500 });
    }

    // Send email async - don't block response too long, but await to catch errors
    // Do not fail the request if email fails
    try {
      await sendWaitlistEmail({
        to: inserted.email,
        name: inserted.name,
        position: inserted.position,
        id: inserted.id,
      });
    } catch (emailErr) {
      console.error("[waitlist] email failed", emailErr);
      // still return success, but indicate email issue
    }

    return NextResponse.json(
      {
        id: inserted.id,
        name: inserted.name,
        email: inserted.email,
        position: inserted.position,
        message: "Joined waitlist",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[waitlist] unexpected", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

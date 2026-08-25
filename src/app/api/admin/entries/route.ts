import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminAuthenticatedFromCookie, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!isAdminAuthenticatedFromCookie(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(10, parseInt(searchParams.get("limit") || "50", 10)));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabaseAdmin
    .from("waitlist")
    .select("id, name, email, position, created_at, ip_address, user_agent", { count: "exact" })
    .order("position", { ascending: true })
    .range(from, to);

  // Simple search: if q, we fetch more and filter in JS (Supabase ilike would be better but we do two-field)
  // For small waitlists (<10k) this is fine. For larger, use .or(`name.ilike.%${q}%,email.ilike.%${q}%`)
  if (q) {
    query = supabaseAdmin
      .from("waitlist")
      .select("id, name, email, position, created_at, ip_address, user_agent", { count: "exact" })
      .or(`name.ilike.%${q}%,email.ilike.%${q}%`)
      .order("position", { ascending: true })
      .range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("[admin entries] error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entries: data, count, page, limit });
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!isAdminAuthenticatedFromCookie(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabaseAdmin.from("waitlist").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

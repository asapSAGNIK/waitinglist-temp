import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAdminAuthenticatedFromCookie, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";
import { AdminDashboard } from "./AdminDashboard";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!isAdminAuthenticatedFromCookie(token)) {
    redirect("/admin/login");
  }

  return <AdminDashboard />;
}

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import ToastProvider from "@/components/ui/ToastProvider";
import type { Metadata } from "next";

// Admin SEMPRE dinâmico (precisa de cookies para auth + queries em tempo real)
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin — Raízes" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin-login");
  }

  return (
    <div className="flex min-h-screen bg-stone-50 font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader userEmail={user.email} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
      <ToastProvider />
    </div>
  );
}

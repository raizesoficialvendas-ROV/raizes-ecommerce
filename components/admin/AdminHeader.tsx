"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutGrid, Package, Layers, ShoppingBag, Settings, Sprout, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const BREADCRUMBS: Record<string, string> = {
  "/admin":                 "Dashboard",
  "/admin/produtos":        "Produtos",
  "/admin/produtos/novo":   "Novo Produto",
  "/admin/colecoes":        "Coleções",
  "/admin/pedidos":         "Pedidos",
  "/admin/configuracoes":   "Configurações",
};

const NAV = [
  { label: "Dashboard",    href: "/admin",               icon: LayoutGrid },
  { label: "Produtos",     href: "/admin/produtos",      icon: Package },
  { label: "Coleções",     href: "/admin/colecoes",      icon: Layers },
  { label: "Pedidos",      href: "/admin/pedidos",       icon: ShoppingBag },
  { label: "Configurações",href: "/admin/configuracoes", icon: Settings },
];

interface AdminHeaderProps {
  userEmail?: string;
}

export default function AdminHeader({ userEmail }: AdminHeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Resolve breadcrumb (handles dynamic routes like /admin/produtos/[id])
  const parts = pathname.split("/").filter(Boolean);
  const currentLabel =
    BREADCRUMBS[pathname] ??
    (parts.length >= 3 ? "Editar Produto" : "Admin");

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200 h-14 flex items-center px-4 md:px-6 gap-4">
        {/* Mobile hamburger */}
        <button
          className="md:hidden p-1.5 text-stone-600 hover:text-obsidian transition-colors"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-stone-400 font-sans">Admin</span>
          {currentLabel !== "Dashboard" && (
            <>
              <span className="text-stone-300">/</span>
              <span className="font-sans font-medium text-obsidian">{currentLabel}</span>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-3">
          {userEmail && (
            <span className="hidden sm:block font-sans text-xs text-stone-400 truncate max-w-[200px]">
              {userEmail}
            </span>
          )}
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-obsidian/60 md:hidden"
            />
            <motion.nav
              key="mobile-nav"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-obsidian flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-gold flex items-center justify-center">
                    <Sprout size={16} className="text-obsidian" />
                  </div>
                  <p className="font-serif text-ivory text-base font-semibold">Raízes Admin</p>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-stone-400 hover:text-ivory transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 px-3 py-4 space-y-1">
                {NAV.map(({ label, href, icon: Icon }) => {
                  const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active ? "bg-white/10 text-ivory" : "text-stone-400 hover:bg-white/5 hover:text-stone-200"}`}
                    >
                      <Icon size={17} /> {label}
                    </Link>
                  );
                })}
              </div>
              <div className="px-3 py-4 border-t border-white/10">
                <form action="/api/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-400 hover:bg-white/5 hover:text-red-400 transition-all cursor-pointer"
                  >
                    <LogOut size={17} /> Sair
                  </button>
                </form>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

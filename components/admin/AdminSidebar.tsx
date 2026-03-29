"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Package,
  Layers,
  ShoppingBag,
  Settings,
  LogOut,
  Sprout,
  Image as ImageIcon,
  BookOpen,
  Star,
} from "lucide-react";

const NAV = [
  { label: "Dashboard",    href: "/admin",               icon: LayoutGrid },
  { label: "Banners",      href: "/admin/banners",       icon: ImageIcon },
  { label: "Produtos",     href: "/admin/produtos",      icon: Package },
  { label: "Coleções",     href: "/admin/colecoes",      icon: Layers },
  { label: "Pedidos",      href: "/admin/pedidos",       icon: ShoppingBag },
  { label: "Avaliações",   href: "/admin/avaliacoes",    icon: Star },
  { label: "Guia",         href: "/admin/guia",          icon: BookOpen },  { label: "Configurações",href: "/admin/configuracoes", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-obsidian min-h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-7 border-b border-white/10">
        <div className="w-8 h-8 rounded-md bg-gold flex items-center justify-center">
          <Sprout size={16} className="text-obsidian" />
        </div>
        <div>
          <p className="font-serif text-ivory text-base font-semibold leading-none tracking-tight">
            Raízes
          </p>
          <p className="font-sans text-[10px] text-stone-400 uppercase tracking-widest mt-0.5">
            Admin
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150
                ${
                  active
                    ? "bg-white/10 text-ivory"
                    : "text-stone-400 hover:bg-white/5 hover:text-stone-200"
                }
              `}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Rodapé */}
      <div className="px-3 py-4 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-400 hover:bg-white/5 hover:text-stone-200 transition-all"
        >
          <Sprout size={17} />
          Ver Site
        </Link>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-400 hover:bg-white/5 hover:text-red-400 transition-all cursor-pointer"
          >
            <LogOut size={17} />
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}

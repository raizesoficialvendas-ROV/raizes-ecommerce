"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, Search, ChevronDown, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types/database.types";

/* ── Tipos de navegação ── */
type NavLink =
  | { label: string; href: string; requiresAuth?: boolean; hasDropdown?: false }
  | { label: string; href: string; requiresAuth?: false; hasDropdown: true };

const NAV_LINKS: NavLink[] = [
  { label: "Coleções", href: "/colecoes", hasDropdown: true },
  { label: "Minhas Compras", href: "/conta/pedidos", requiresAuth: true },
  { label: "Sobre", href: "/sobre" },
];

/* ── Framer variants ── */
const dropdownVariants = {
  hidden: { opacity: 0, y: -4, scaleY: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const, staggerChildren: 0.04 },
  },
  exit: {
    opacity: 0,
    y: -4,
    scaleY: 0.96,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  /* Dropdown states */
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
  const [collections, setCollections] = useState<Category[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { toggleCart, totalItems } = useCartStore();
  const { user } = useUser();
  const router = useRouter();
  const itemCount = mounted ? totalItems() : 0;

  /* ── Fetch collections (client-side) ── */
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (data) setCollections(data as Category[]);
      });
  }, []);

  /* ── Auth-aware click ── */
  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    link: NavLink
  ) {
    if ("requiresAuth" in link && link.requiresAuth && !user) {
      e.preventDefault();
      router.push("/login?redirect=/conta/pedidos");
    }
  }

  /* ── Desktop dropdown hover logic with delay ── */
  const openDesktopDropdown = useCallback(() => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setDesktopDropdownOpen(true);
  }, []);

  const closeDesktopDropdown = useCallback(() => {
    dropdownTimeout.current = setTimeout(() => setDesktopDropdownOpen(false), 150);
  }, []);

  /* ── Close desktop dropdown on outside click ── */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDesktopDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bloqueia scroll quando menu mobile está aberto
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* ── Estilos dinâmicos (scrolled vs transparent) ── */
  const linkClasses = (active?: boolean) =>
    [
      "font-sans text-xs font-medium tracking-widest uppercase transition-colors duration-300",
      scrolled ? "text-stone-600 hover:text-obsidian" : "text-ivory/80 hover:text-ivory",
      active ? (scrolled ? "text-obsidian" : "text-ivory") : "",
    ].join(" ");

  return (
    <>
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-ivory/90 backdrop-blur-md border-b border-stone-200/60 shadow-luxury-sm"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className="raizes-container">
          <div className="flex items-center justify-between h-[72px]">

            {/* ── Logo ── */}
            <Link
              href="/"
              className="font-serif text-xl tracking-tighter select-none"
              style={{ color: scrolled ? "#0A0A0A" : "#F8F5F0" }}
            >
              Raízes
            </Link>

            {/* ── Nav Links (Desktop) ── */}
            <nav className="hidden md:flex items-center gap-10">
              {NAV_LINKS.map((link) =>
                link.hasDropdown ? (
                  /* ── Coleções com Dropdown ── */
                  <div
                    key={link.href}
                    ref={dropdownRef}
                    className="relative"
                    onMouseEnter={openDesktopDropdown}
                    onMouseLeave={closeDesktopDropdown}
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setDesktopDropdownOpen((v) => !v)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setDesktopDropdownOpen((v) => !v); }}
                      className={[
                        linkClasses(desktopDropdownOpen),
                        "flex items-center gap-1.5 cursor-pointer select-none",
                      ].join(" ")}
                    >
                      {link.label}
                      <ChevronDown
                        size={12}
                        strokeWidth={1.5}
                        className={[
                          "transition-transform duration-300",
                          desktopDropdownOpen ? "rotate-180" : "",
                        ].join(" ")}
                      />
                    </div>

                    {/* ── Desktop Dropdown Panel ── */}
                    <AnimatePresence>
                      {desktopDropdownOpen && collections.length > 0 && (
                        <motion.div
                          key="desktop-dropdown"
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          style={{ originY: 0 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 py-3 bg-white/95 backdrop-blur-xl rounded-xl border border-stone-200/60 shadow-luxury-lg"
                        >
                          {/* Seta/indicator */}
                          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white/95 border-l border-t border-stone-200/60" />

                          {collections.map((col) => (
                            <motion.div key={col.id} variants={itemVariants}>
                              <Link
                                href={`/colecoes/${col.slug}`}
                                onClick={() => setDesktopDropdownOpen(false)}
                                className="group flex items-center justify-between px-5 py-2.5 transition-colors duration-200 hover:bg-stone-50/80"
                              >
                                <span className="font-sans text-sm text-stone-700 group-hover:text-obsidian transition-colors">
                                  {col.name}
                                </span>
                                <ArrowRight
                                  size={12}
                                  strokeWidth={1.5}
                                  className="text-stone-300 group-hover:text-obsidian group-hover:translate-x-0.5 transition-all duration-200"
                                />
                              </Link>
                            </motion.div>
                          ))}

                          {/* Link "Ver todas" */}
                          <div className="mt-1 pt-2 mx-4 border-t border-stone-100">
                            <Link
                              href="/colecoes"
                              onClick={() => setDesktopDropdownOpen(false)}
                              className="flex items-center gap-2 py-1.5 font-sans text-[10px] font-medium tracking-widest uppercase text-stone-400 hover:text-obsidian transition-colors"
                            >
                              Ver todas as coleções
                              <ArrowRight size={10} strokeWidth={1.5} />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  /* ── Links normais ── */
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className={[linkClasses(), "underline-reveal"].join(" ")}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* ── Actions ── */}
            <div className="flex items-center gap-5">
              {/* Search */}
              <button
                aria-label="Buscar"
                className={[
                  "hidden md:flex items-center justify-center w-9 h-9 transition-colors duration-300",
                  scrolled ? "text-stone-600 hover:text-obsidian" : "text-ivory/80 hover:text-ivory",
                ].join(" ")}
              >
                <Search size={18} strokeWidth={1.5} />
              </button>

              {/* Cart */}
              <button
                aria-label={`Sacola (${itemCount} ${itemCount === 1 ? "item" : "itens"})`}
                onClick={toggleCart}
                className={[
                  "relative flex items-center justify-center w-9 h-9 transition-colors duration-300",
                  scrolled ? "text-stone-600 hover:text-obsidian" : "text-ivory/80 hover:text-ivory",
                ].join(" ")}
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-obsidian text-ivory text-[9px] font-semibold leading-none"
                    >
                      {itemCount > 9 ? "9+" : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
                onClick={() => setMobileOpen((v) => !v)}
                className={[
                  "flex md:hidden items-center justify-center w-9 h-9 transition-colors duration-300",
                  scrolled ? "text-stone-600 hover:text-obsidian" : "text-ivory/80 hover:text-ivory",
                ].join(" ")}
              >
                {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay com blur */}
            <motion.div
              key="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-obsidian/40 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Painel lateral */}
            <motion.div
              key="mobile-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed top-0 right-0 bottom-0 z-[60] w-[85vw] max-w-sm bg-white/80 backdrop-blur-xl flex flex-col shadow-luxury-xl"
              aria-label="Menu de navegação"
              role="dialog"
              aria-modal="true"
            >
              {/* Header do painel */}
              <div className="flex items-center justify-between h-[72px] px-6 border-b border-stone-200">
                <Link
                  href="/"
                  className="font-serif text-xl tracking-tighter text-obsidian"
                  onClick={() => setMobileOpen(false)}
                >
                  Raízes
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-9 h-9 text-stone-600 hover:text-obsidian transition-colors"
                  aria-label="Fechar menu"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex flex-col justify-center flex-1 px-8 gap-2">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    {link.hasDropdown ? (
                      /* ── Coleções: Accordion no Mobile ── */
                      <div>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setMobileCollectionsOpen((v) => !v)}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setMobileCollectionsOpen((v) => !v); }}
                          className="w-full flex items-center justify-between cursor-pointer select-none font-serif text-4xl font-normal tracking-tighter text-obsidian py-3 border-b border-stone-100 hover:text-stone-500 transition-colors"
                        >
                          {link.label}
                          <ChevronDown
                            size={22}
                            strokeWidth={1.5}
                            className={[
                              "text-stone-400 transition-transform duration-300",
                              mobileCollectionsOpen ? "rotate-180" : "",
                            ].join(" ")}
                          />
                        </div>

                        {/* Sub-items accordion */}
                        <AnimatePresence>
                          {mobileCollectionsOpen && collections.length > 0 && (
                            <motion.div
                              key="mobile-collections"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 pt-2 pb-3 flex flex-col gap-1">
                                {collections.map((col, ci) => (
                                  <motion.div
                                    key={col.id}
                                    initial={{ opacity: 0, x: 12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: ci * 0.05, duration: 0.25 }}
                                  >
                                    <Link
                                      href={`/colecoes/${col.slug}`}
                                      onClick={() => {
                                        setMobileOpen(false);
                                        setMobileCollectionsOpen(false);
                                      }}
                                      className="group flex items-center justify-between py-2.5 border-b border-stone-50"
                                    >
                                      <span className="font-sans text-lg text-stone-600 group-hover:text-obsidian transition-colors">
                                        {col.name}
                                      </span>
                                      <ArrowRight
                                        size={14}
                                        strokeWidth={1.5}
                                        className="text-stone-300 group-hover:text-obsidian group-hover:translate-x-0.5 transition-all duration-200"
                                      />
                                    </Link>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      /* ── Links normais ── */
                      <Link
                        href={link.href}
                        onClick={(e) => {
                          handleNavClick(e, link);
                          setMobileOpen(false);
                        }}
                        className="block font-serif text-4xl font-normal tracking-tighter text-obsidian py-3 border-b border-stone-100 hover:text-stone-500 transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </nav>

              {/* Footer do painel */}
              <div className="px-8 py-8 text-xs font-sans tracking-widest uppercase text-stone-400">
                Feito com propósito.
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

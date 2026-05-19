"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import AccentureLogo from "../../../../../public/accenture_logo_purple1.png";
import Image from "next/image";
import NotificationsPanel from "../NotificationsPanel/NotificationsPanel";

const routes = [
  { name: "Inicio", href: "/home" },
  { name: "Tablero", href: "/tablero" },
  { name: "Cubículos", href: "/cubiculos" },
  { name: "Calendario", href: "/calendario" },
  { name: "Estacionamientos", href: "/estacionamientos" },
];

export default function Navbar() {
  const pathname = usePathname();
  const route = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest("[data-mobile-menu]") &&
        !target.closest("[data-hamburger]")
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <>
      <header className="w-full sticky top-0 h-16 z-40 bg-background flex flex-row items-center gap-2 px-4">
        <a href="/home" className="shrink-0 pl-1">
          <Image
            src={AccentureLogo}
            alt="Accenture logo"
            width={40}
            height={40}
          />
        </a>
        <nav className="hidden md:flex flex-row text-white gap-1 ml-2 items-end h-full">
          <svg width="0" height="0" className="absolute">
            <defs>
              <clipPath id="tab-shape" clipPathUnits="objectBoundingBox">
                <path d="M0.20,0.08 Q0.22,0 0.30,0 L0.70,0 Q0.78,0 0.80,0.08 L1,1 L0,1 Z" />
              </clipPath>
            </defs>
          </svg>
          {routes.map((r) => {
            const isActive = pathname.startsWith(r.href);
            return (
              <Link
                key={r.href}
                href={r.href}
                className={
                  isActive
                    ? "bg-background-page text-on-background flex items-center justify-center"
                    : "bg-background-page text-on-background px-4 py-1.5 rounded-full self-center flex items-center"
                }
                style={
                  isActive
                    ? {
                        clipPath: "url(#tab-shape)",
                        height: "44px",
                        width: "clamp(100px, fit-content, 200px)",
                        paddingTop: "4px",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                      }
                    : {}
                }
              >
                <span className="text-xs font-light select-none">{r.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <label className="hidden sm:flex gap-2 bg-background-page self-center px-4 py-2 rounded-full text-xs text-on-background-2 cursor-pointer">
            <span className="material-symbols-outlined">chat_bubble</span>
            <button
              onClick={() => route.push("/chatbot")}
              className="cursor-pointer whitespace-nowrap"
            >
              Pide al chatbot
            </button>
          </label>

          {/* 🔔 Notifications panel — replaces the static label */}
          <NotificationsPanel />

          <Link
            href="/perfil"
            className="bg-background-page self-center select-none rounded-full text-on-background-2 font-semibold"
          >
            <label className="bg-background-page self-center p-2 select-none rounded-full text-on-background-2 font-semibold material-symbols-outlined cursor-pointer">
              person
            </label>
          </Link>
          <button
            data-hamburger
            onClick={() => setOpen((o) => !o)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-background-page text-on-background-2 transition-colors"
            aria-label="Abrir menú"
          >
            <span className="material-symbols-outlined text-[20px]">
              {open ? "close" : "menu"}
            </span>
          </button>
        </div>
      </header>

      {open && (
        <div
          data-mobile-menu
          className="md:hidden fixed top-16 left-0 right-0 z-30 bg-background border-t border-background-page shadow-xl"
          style={{ animation: "mobileMenuIn 0.18s ease both" }}
        >
          <style>{`
            @keyframes mobileMenuIn {
              from { opacity: 0; transform: translateY(-8px); }
              to   { opacity: 1; transform: translateY(0);    }
            }
          `}</style>
          <nav className="flex flex-col px-4 py-3 gap-1">
            {routes.map((r) => {
              const isActive = pathname.startsWith(r.href);
              return (
                <Link
                  key={r.href}
                  href={r.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
                  style={{
                    background: isActive
                      ? "var(--color-background-page, #f5f5f5)"
                      : "transparent",
                    color: isActive
                      ? "var(--color-on-background, #111)"
                      : "var(--color-on-background-2, #555)",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  <span className="text-sm select-none">{r.name}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-600 shrink-0" />
                  )}
                </Link>
              );
            })}
            <div className="mt-2 pt-2 border-t border-background-page sm:hidden">
              <button
                onClick={() => {
                  route.push("/chatbot");
                  setOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-colors text-left"
                style={{ color: "var(--color-on-background-2, #555)" }}
              >
                <span className="material-symbols-outlined text-[18px]">
                  chat_bubble
                </span>
                <span className="text-sm">Pide al chatbot</span>
              </button>
            </div>
          </nav>
        </div>
      )}
      {open && (
        <div
          className="md:hidden fixed inset-0 top-16 z-20 bg-black/20 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}

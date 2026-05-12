"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import AccentureLogo from "../../../../public/accenture_logo_purple1.png";
import Image from "next/image";
import "./navbar.css";

const routes = [
  { name: "Inicio", href: "/home" },
  { name: "Tablero", href: "/tablero" },
  { name: "Cubículos", href: "/reservaciones" },
  { name: "Calendario", href: "/calendario" },
  { name: "Estacionamientos", href: "/estacionamientos" },
];

export default function Navbar() {
  const pathname = usePathname();
  const route = useRouter();
  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  return (
    <header className="w-full sticky top-0 h-16 z-40 bg-background flex flex-row gap-4 px-4">
      <span className="text-2xl self-center font-bold text-on-surface-container pl-2">
        <a href="/home">
          <Image
            src={AccentureLogo}
            alt="accenture logo"
            width={40}
            height={40}
          />
        </a>
      </span>

      <nav className="flex flex-row text-white gap-1 ml-2 items-end h-full">
        <svg width="0" height="0" className="absolute">
          <defs>
            <clipPath id="tab-shape" clipPathUnits="objectBoundingBox">
              <path
                d="
                M0.20,0.08
                Q0.22,0 0.30,0
                L0.70,0
                Q0.78,0 0.80,0.08
                L1,1
                L0,1
                Z
              "
              />
            </clipPath>
          </defs>
        </svg>

        {routes.map((route) => {
          const isActive = pathname.startsWith(route.href);
          return (
            <Link
              key={route.href}
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
                      width: "120px",
                      alignSelf: "flex-end",
                      paddingTop: "4px",
                    }
                  : {}
              }
              href={route.href}
            >
              <span className="text-xs font-light select-none">
                {route.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <label className="ml-auto flex gap-2 bg-background-page self-center px-4 py-2 rounded-full text-xs text-on-background-2 cursor-pointer">
        <span className="material-symbols-outlined">chat_bubble</span>
        <button
          onClick={() => route.push("/chatbot")}
          className="cursor-pointer"
        >
          Pide al chatbot
        </button>
      </label>
      <label className="bg-background-page self-center p-2 select-none rounded-full text-on-background-2 font-semibold material-symbols-outlined">
        notifications
      </label>
      <Link
        href="/perfil"
        className="bg-background-page self-center select-none rounded-full text-on-background-2 font-semibold"
      >
        <label className="bg-background-page self-center p-2 select-none rounded-full text-on-background-2 font-semibold material-symbols-outlined cursor-pointer">
          person
        </label>
      </Link>
    </header>
  );
}

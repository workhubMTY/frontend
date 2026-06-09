"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import AccentureLogo from "../../../../../public/accenture_logo_purple1.png";
import { useAuth } from "../../auth/useAuth";

export function CheckinNavbar() {
  const { logout, user } = useAuth();
  const router = useRouter();

  return (
    <header className="w-full sticky top-0 h-16 z-40 bg-background flex flex-row items-center gap-2 px-4">
      <a href="/parking-checkin" className="shrink-0 pl-1">
        <Image
          src={AccentureLogo}
          alt="Accenture logo"
          width={40}
          height={40}
        />
      </a>
      <div className="ml-2 flex flex-col justify-center">
        <span className="text-xs font-semibold text-on-background leading-none">
          Control de Acceso
        </span>
        {user?.name && (
          <span className="text-[10px] text-on-background-2 leading-none mt-0.5">
            {user.name}
          </span>
        )}
      </div>
      <div className="ml-auto">
        <button
          onClick={async () => {
            await logout();
            router.push("/login");
          }}
          className="bg-background-page self-center p-2 select-none rounded-full text-on-background-2 hover:text-red-500 transition-colors material-symbols-outlined"
          aria-label="Cerrar sesión"
        >
          logout
        </button>
      </div>
    </header>
  );
}

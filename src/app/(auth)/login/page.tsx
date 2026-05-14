"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authService } from "@/app/modules/auth/auth.service";
import AccentureLogo from "../../../../public/accenture_logo_purple1.png";

interface User {
  eId: string;
  password: string;
}

export default function Login() {
  const [user, setUser] = useState<User>({ eId: "", password: "" });
  const [error, setError] = useState<string>("");
  const [dark, setDark] = useState<boolean>(true);
  const router = useRouter();

  const [verifyingSesion, setVerifyingSesion] = useState(true);
  useEffect(() => {
    authService.me().then(() => {
      router.replace("/home");
    }).catch(() => {
      setVerifyingSesion(false);
    });
  }, []);
  if (verifyingSesion) return null;

  function onChangeUser(e: React.ChangeEvent<HTMLInputElement>) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  async function onSubmitLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!user.eId.trim() || !user.password.trim()) {
      setError("Por favor completa todos los campos.");
      return;
    }
    try {
      await authService.login(user);
      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al iniciar sesión.");
    }
  }

  const t = dark
    ? {
      bg: "#0a0a0a",
      panel: "#161616",
      border: "#2a2a2a",
      inputBg: "#222222",
      text: "#f0f0f0",
      textSub: "#666",
      textMuted: "#444",
      toggleBg: "#2a2a2a",
      toggleIcon: "#888",
      orbOp: "1",
      gridAlpha: "0.06",
    }
    : {
      bg: "#f0eff5",
      panel: "#ffffff",
      border: "#ddd",
      inputBg: "#f4f4f4",
      text: "#111",
      textSub: "#777",
      textMuted: "#bbb",
      toggleBg: "#e8e4f0",
      toggleIcon: "#a100ff",
      orbOp: "0.45",
      gridAlpha: "0.1",
    };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');

        * { box-sizing: border-box; }

        .acc-grid {
          background-image:
            linear-gradient(rgba(161,0,255,${t.gridAlpha}) 1px, transparent 1px),
            linear-gradient(90deg, rgba(161,0,255,${t.gridAlpha}) 1px, transparent 1px);
          background-size: 52px 52px;
          animation: accGrid 20s linear infinite;
        }
        @keyframes accGrid { from { background-position:0 0; } to { background-position:52px 52px; } }

        .acc-orb {
          position:absolute; width:420px; height:420px; border-radius:50%;
          background:radial-gradient(circle, rgba(161,0,255,.32) 0%, transparent 70%);
          bottom:-100px; left:-80px; pointer-events:none;
          opacity:${t.orbOp}; transition:opacity .4s;
          animation:accPulse 5s ease-in-out infinite;
        }
        @keyframes accPulse {
          0%,100% { transform:scale(1);   opacity:.7; }
          50%      { transform:scale(1.1); opacity:1; }
        }

        .acc-divider {
          height:1px;
          background:linear-gradient(90deg,#a100ff,transparent);
          transform-origin:left;
          animation:accSlide .8s .35s ease both;
        }
        @keyframes accSlide { from{transform:scaleX(0);} to{transform:scaleX(1);} }

        .acc-fd  { animation:accFD .6s ease both; }
        .acc-fd2 { animation:accFD .6s .15s ease both; }
        @keyframes accFD { from{transform:translateY(-14px);opacity:0;} to{transform:translateY(0);opacity:1;} }

        .acc-fu  { animation:accFU .7s .15s ease both; }
        .acc-fu2 { animation:accFU .7s .25s ease both; }
        @keyframes accFU { from{transform:translateY(18px);opacity:0;} to{transform:translateY(0);opacity:1;} }

        .acc-panel { animation:accPanel .65s .1s ease both; }
        @keyframes accPanel { from{transform:translateX(60px);opacity:0;} to{transform:translateX(0);opacity:1;} }

        /* Mobile: panel slides up */
        @media (max-width: 767px) {
          .acc-panel { animation:accPanelMobile .65s .1s ease both; }
          @keyframes accPanelMobile { from{transform:translateY(60px);opacity:0;} to{transform:translateY(0);opacity:1;} }
        }

        .acc-r1   { animation:accFU .5s .45s ease both; }
        .acc-r2   { animation:accFU .5s .52s ease both; }
        .acc-rbtn { animation:accFU .5s .60s ease both; }
        .acc-rft  { animation:accFU .5s .68s ease both; }

        .acc-iw {
          display:flex; align-items:center; gap:.6rem;
          background:${t.inputBg};
          border:1px solid ${t.border};
          border-radius:.85rem; padding:.72rem 1rem;
          transition:border-color .25s, box-shadow .25s, background .4s;
        }
        .acc-iw:focus-within {
          border-color:#a100ff;
          box-shadow:0 0 0 3px rgba(161,0,255,.15);
        }

        .acc-sub {
          position:relative; overflow:hidden;
          transition:background .25s, transform .15s;
        }
        .acc-sub::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(120deg,transparent 30%,rgba(255,255,255,.18) 50%,transparent 70%);
          transform:translateX(-100%); transition:transform .5s;
        }
        .acc-sub:hover { background:#7b00c7 !important; transform:translateY(-1px); }
        .acc-sub:hover::after { transform:translateX(100%); }
        .acc-sub:active { transform:translateY(0); }

        .acc-tog {
          position:absolute; top:1.2rem; right:1.2rem;
          width:36px; height:36px; border-radius:50%;
          border:1px solid ${t.border};
          background:${t.toggleBg};
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:background .3s, transform .2s; z-index:10;
        }
        .acc-tog:hover { transform:rotate(20deg) scale(1.08); }

        /* ── LAYOUT ── */

        /* Desktop: side by side */
        .login-root {
          display: flex;
          flex-direction: row;
          height: 100svh;
          width: 100%;
          overflow: hidden;
        }

        .login-left {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          padding: 2.5rem;
        }

        .login-right {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          padding: 3rem 2.5rem;
          width: min(430px, 44%);
          border-left: 1px solid ${t.border};
        }

        /* Tablet: adjust proportions */
        @media (max-width: 1024px) and (min-width: 768px) {
          .login-left {
            padding: 2rem;
          }
          .login-right {
            width: min(380px, 50%);
            padding: 2.5rem 2rem;
          }
        }

        /* Mobile: stack vertically */
        @media (max-width: 767px) {
          .login-root {
            flex-direction: column;
            height: 100svh;
            overflow-y: auto;
          }

          /* Left = compact header strip */
          .login-left {
            flex: none;
            justify-content: flex-start;
            padding: 1.4rem 1.4rem 1rem;
            min-height: 0;
          }

          .login-left-bottom {
            margin-top: 1rem;
          }

          .login-left h1 {
            font-size: clamp(1.4rem, 5vw, 1.8rem) !important;
          }

          .login-left p {
            font-size: .8rem !important;
          }

          .acc-orb {
            width: 260px;
            height: 260px;
            bottom: -60px;
            left: -40px;
          }

          /* Right = main content, fills remaining space */
          .login-right {
            width: 100% !important;
            border-left: none !important;
            border-top: 1px solid ${t.border};
            padding: 2rem 1.4rem 2rem;
            justify-content: flex-start;
            flex: 1;
          }

          /* On mobile the toggle goes to top-right of the right panel */
          .acc-tog {
            top: 1rem;
            right: 1rem;
          }
        }

        /* Small phones (≤ 375px) */
        @media (max-width: 375px) {
          .login-left {
            padding: 1.1rem 1.1rem .8rem;
          }
          .login-right {
            padding: 1.5rem 1.1rem 1.5rem;
          }
        }

        /* Landscape mobile */
        @media (max-width: 767px) and (orientation: landscape) {
          .login-root {
            flex-direction: row;
            overflow: hidden;
          }
          .login-left {
            flex: 0 0 38%;
            padding: 1.2rem;
            justify-content: space-between;
          }
          .login-right {
            width: 62% !important;
            border-left: 1px solid ${t.border} !important;
            border-top: none !important;
            padding: 1.5rem 1.5rem;
            overflow-y: auto;
            justify-content: center;
          }
          .login-right h2 {
            font-size: 1.4rem !important;
          }
          .login-right .mb-8 {
            margin-bottom: 1rem !important;
          }
        }
      `}</style>

      <section
        style={{
          fontFamily: "'DM Sans', sans-serif",
          background: t.bg,
          color: t.text,
          transition: "background .4s, color .4s",
        }}
        className="login-root"
      >
        {/* ── LEFT ───────────────────────────────────────────── */}
        <div className="login-left">
          <div className="acc-grid absolute inset-0" />
          <div className="acc-orb" />

          <div className="acc-fd relative z-10 flex items-center gap-3">
            <Image
              src={AccentureLogo}
              alt="Accenture Logo"
              width={160}
              height={60}
              className="w-[110px] sm:w-[130px] select-none"
              priority
            />
          </div>

          <div className="login-left-bottom relative z-10">
            <h1
              className="login-left acc-fu font-bold leading-[1.1] tracking-tight"
              style={{
                color: t.text,
                transition: "color .4s",
                fontSize: "clamp(1.9rem, 3.2vw, 3rem)",
              }}
            >
              Workhub<br />
              <span style={{ color: "#a100ff" }}>Monterrey</span>
            </h1>
            <p
              className="acc-fu2 mt-2 text-[.88rem]"
              style={{ color: t.textSub, transition: "color .4s" }}
            >
              Gestión de tareas, sprints y KPIs para tu equipo.
            </p>
            <div className="acc-divider mt-4 w-full" />
          </div>
        </div>

        {/* ── RIGHT ──────────────────────────────────────────── */}
        <div
          className="login-right acc-panel"
          style={{
            background:  t.panel,
            transition:  "background .4s, border-color .4s",
          }}
        >
          {/* accent bar */}
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#a100ff] to-transparent" />

          {/* toggle */}
          <button
            className="acc-tog"
            style={{ background: t.toggleBg, borderColor: t.border }}
            onClick={() => setDark(!dark)}
            aria-label="Cambiar tema"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "1.1rem", color: t.toggleIcon }}
            >
              {dark ? "light_mode" : "dark_mode"}
            </span>
          </button>

          <p
            className="acc-fd mb-1 text-[.7rem] font-medium uppercase tracking-widest"
            style={{ fontFamily: "'DM Mono', monospace", color: "#a100ff" }}
          >
            Portal de acceso
          </p>
          <h2
            className="acc-fd2 text-[1.65rem] sm:text-[1.85rem] font-bold tracking-tight"
            style={{ color: t.text, transition: "color .4s" }}
          >
            Bienvenido
          </h2>
          <p
            className="mb-6 sm:mb-8 mt-1 text-[.82rem]"
            style={{ color: t.textSub, transition: "color .4s" }}
          >
            Ingresa tus credenciales corporativas
          </p>

          <form className="flex flex-col gap-[.9rem]" onSubmit={onSubmitLogin}>
            <label className="acc-iw acc-r1">
              <span
                className="material-symbols-outlined pointer-events-none select-none text-base"
                style={{ color: t.textSub }}
              >
                person
              </span>
              <input
                className="w-full bg-transparent text-sm outline-none"
                style={{ color: t.text }}
                type="text"
                name="eId"
                value={user.eId}
                onChange={onChangeUser}
                placeholder="Enterprise ID"
                autoComplete="username"
              />
            </label>

            <label className="acc-iw acc-r2">
              <span
                className="material-symbols-outlined pointer-events-none select-none text-base"
                style={{ color: t.textSub }}
              >
                lock
              </span>
              <input
                className="w-full bg-transparent text-sm outline-none"
                style={{ color: t.text }}
                type="password"
                name="password"
                value={user.password}
                onChange={onChangeUser}
                placeholder="Contraseña"
                autoComplete="current-password"
              />
            </label>

            {error && (
              <p className="border-l-2 border-[#ff4d6d] bg-[rgba(255,77,109,0.06)] px-3 py-2 text-[.78rem] text-[#ff4d6d]">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="acc-sub acc-rbtn mt-1 rounded-[.85rem] bg-[#a100ff] py-[.82rem] text-[.9rem] font-semibold tracking-wide text-white"
            >
              Iniciar sesión
            </button>
          </form>

          <p
            className="acc-rft mt-5 text-center text-[.74rem]"
            style={{ color: t.textSub, transition: "color .4s" }}
          >
            ¿Problemas para acceder?{" "}
            <a href="#" className="text-[#a100ff] hover:underline">
              Contacta a IT Support
            </a>
          </p>

          <div className="absolute bottom-5 right-5 flex items-center gap-1.5 opacity-25">
            <div className="h-1.5 w-1.5 rounded-full bg-[#a100ff]" />
            <span
              className="text-[.65rem] font-bold uppercase tracking-widest"
              style={{ color: t.text, transition: "color .4s" }}
            >
              Accenture
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
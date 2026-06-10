"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { api } from "./Data";
import { FriendRequest } from "./notificationInterfaces";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "ahora";
  if (m < 60) return `hace ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h}h`;
  return `hace ${Math.floor(h / 24)}d`;
}

function FriendRequestItem({
  req,
  onAccept,
  onReject,
}: {
  req: FriendRequest;
  onAccept: (fromUser: string) => void;
  onReject: (fromUser: string) => void;
}) {
  return (
    <div className="notification-item">
      <div className="notif-icon" style={{ background: "#7c3aed18", color: "#7c3aed" }}>
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
          person_add
        </span>
      </div>
      <div className="notif-body" style={{ flex: 1 }}>
        <div className="notif-title">{req.fromUser}</div>
        <div className="notif-text">quiere ser tu amigo</div>
        <div className="notif-time">{timeAgo(req.createdAt)}</div>
      </div>
      <div className="friend-actions">
        <button className="btn-accept" onClick={() => onAccept(req.fromUser)}>
          Aceptar
        </button>
        <button className="btn-reject" onClick={() => onReject(req.fromUser)}>
          Rechazar
        </button>
      </div>
    </div>
  );
}

export default function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const reqs = await api.getFriendRequests();
      setRequests(reqs);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    fetchAll();
  }, [open, fetchAll]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleAccept = async (fromUser: string) => {
    await api.acceptRequest(fromUser);
    setRequests((prev) => prev.filter((r) => r.fromUser !== fromUser));
  };

  const handleReject = async (fromUser: string) => {
    await api.rejectRequest(fromUser);
    setRequests((prev) => prev.filter((r) => r.fromUser !== fromUser));
  };

  return (
    <>
      <style>{`
        .notif-trigger {
          position: relative;
          background: var(--color-background-page, #f5f5f5);
          border: none;
          border-radius: 9999px;
          padding: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-on-background-2, #555);
          transition: background 0.15s;
        }
        .notif-trigger:hover { background: var(--color-background-page, #ebebeb); }

        .notif-badge {
          position: absolute;
          top: 3px; right: 3px;
          min-width: 16px; height: 16px;
          border-radius: 9999px;
          background: #7c3aed;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          padding: 0 3px;
          pointer-events: none;
          line-height: 1;
        }

        .notif-panel {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 380px;
          max-height: 520px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: panelIn 0.18s cubic-bezier(.22,1,.36,1) both;
          z-index: 100;
        }
        @media (max-width: 480px) {
          .notif-panel { width: calc(100vw - 16px); right: -8px; }
        }
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .notif-header {
          padding: 14px 16px;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .notif-header-title {
          font-size: 15px; font-weight: 700;
          color: #111;
          font-family: 'DM Sans', sans-serif;
        }

        .notif-list {
          overflow-y: auto;
          flex: 1;
          padding: 4px 0;
        }
        .notif-list::-webkit-scrollbar { width: 4px; }
        .notif-list::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }

        .notification-item {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px;
          transition: background 0.12s;
          border-bottom: 1px solid #f7f7f7;
        }
        .notification-item:last-child { border-bottom: none; }
        .notification-item:hover { background: #fafafa; }

        .notif-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .notif-body { flex: 1; min-width: 0; }
        .notif-title {
          font-size: 13px; font-weight: 600; color: #111;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .notif-text { font-size: 12px; color: #555; margin-top: 2px; line-height: 1.4; }
        .notif-time { font-size: 11px; color: #aaa; margin-top: 4px; }

        .friend-actions { display: flex; gap: 6px; flex-shrink: 0; }
        .btn-accept {
          background: #7c3aed; color: #fff;
          border: none; border-radius: 6px;
          font-size: 12px; font-weight: 600;
          padding: 5px 10px; cursor: pointer;
          transition: background 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-accept:hover { background: #6d28d9; }
        .btn-reject {
          background: #f0f0f0; color: #555;
          border: none; border-radius: 6px;
          font-size: 12px; font-weight: 600;
          padding: 5px 10px; cursor: pointer;
          transition: background 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-reject:hover { background: #e5e5e5; }

        .notif-empty {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 48px 24px; gap: 8px;
          color: #bbb;
        }
        .notif-empty span.material-symbols-outlined { font-size: 36px; }
        .notif-empty p { font-size: 13px; margin: 0; font-family: 'DM Sans', sans-serif; }

        .notif-loading {
          display: flex; align-items: center; justify-content: center;
          padding: 32px;
          color: #bbb; font-size: 13px;
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      <div ref={panelRef} style={{ position: "relative" }}>
        <button
          className="notif-trigger"
          onClick={() => setOpen((o) => !o)}
          aria-label="Solicitudes de amistad"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
            group
          </span>
          {requests.length > 0 && (
            <span className="notif-badge">
              {requests.length > 99 ? "99+" : requests.length}
            </span>
          )}
        </button>

        {open && (
          <div className="notif-panel">
            <div className="notif-header">
              <span className="notif-header-title">Solicitudes de amistad</span>
              {requests.length > 0 && (
                <span style={{
                  fontSize: 12,
                  color: "#7c3aed",
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif"
                }}>
                  {requests.length} pendiente{requests.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div className="notif-list">
              {loading ? (
                <div className="notif-loading">Cargando...</div>
              ) : requests.length === 0 ? (
                <div className="notif-empty">
                  <span className="material-symbols-outlined">group_off</span>
                  <p>No tienes solicitudes pendientes</p>
                </div>
              ) : (
                requests.map((r) => (
                  <FriendRequestItem
                    key={r.fromUser}
                    req={r}
                    onAccept={handleAccept}
                    onReject={handleReject}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
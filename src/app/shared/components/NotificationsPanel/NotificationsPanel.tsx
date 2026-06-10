"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useReceivedFriendRequests } from "../../data/friendships/hooks";
import { api, TYPE_ICON, TYPE_COLOR } from "./Data";
import { Notification } from "./notificationInterfaces";
import type { FriendRequest as ReceivedFriendRequest } from "../../data/friendships/types";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "ahora";
  if (m < 60) return `hace ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h}h`;
  return `hace ${Math.floor(h / 24)}d`;
}

function NotificationItem({
  n,
  onRead,
  onDelete,
}: {
  n: Notification;
  onRead: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div
      className="notification-item"
      data-unread={!n.is_read}
      onClick={() => !n.is_read && onRead(n.id)}
    >
      <div
        className="notif-icon"
        style={{
          background: TYPE_COLOR[n.type] + "18",
          color: TYPE_COLOR[n.type],
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
          {TYPE_ICON[n.type]}
        </span>
      </div>
      <div className="notif-body">
        <div className="notif-title">
          {!n.is_read && <span className="unread-dot" />}
          {n.title}
        </div>
        <div className="notif-text">{n.body}</div>
        <div className="notif-time">{timeAgo(n.created_at)}</div>
      </div>
      <button
        className="notif-delete"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(n.id);
        }}
        title="Eliminar"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
          close
        </span>
      </button>
    </div>
  );
}

function FriendRequestItem({
  req,
  onAccept,
  onReject,
}: {
  req: ReceivedFriendRequest;
  onAccept: (fromUser: string) => void;
  onReject: (fromUser: string) => void;
}) {
  return (
    <div className="notification-item" style={{ alignItems: "center" }}>
      <div
        className="notif-icon"
        style={{ background: "#7c3aed18", color: "#7c3aed" }}
      >
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
  const [tab, setTab] = useState<"notifs" | "requests">("notifs");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const {
    data: receivedRequests = [],
    isLoading: loadingRequests,
    acceptFriendRequest,
    rejectFriendRequest,
  } = useReceivedFriendRequests();

  const fetchAll = useCallback(async () => {
    setLoadingNotifications(true);
    try {
      const [notifs, count] = await Promise.all([
        api.getNotifications(),
        api.getUnreadCount(),
      ]);
      setNotifications(notifs);
      setUnreadCount(count.count);
    } catch {
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, 30_000); // poll every 30s
    return () => clearInterval(id);
  }, [fetchAll]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleRead = async (id: number) => {
    await api.markRead([id]);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const handleDelete = async (id: number) => {
    await api.deleteNotifications([id]);
    const n = notifications.find((x) => x.id === id);
    setNotifications((prev) => prev.filter((x) => x.id !== id));
    if (n && !n.is_read) setUnreadCount((c) => Math.max(0, c - 1));
  };

  const handleMarkAllRead = async () => {
    await api.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const handleDeleteAll = async () => {
    await api.deleteAll();
    setNotifications([]);
    setUnreadCount(0);
  };

  const handleAccept = async (fromUser: string) => {
    await acceptFriendRequest.mutateAsync({ fromUser });
  };

  const handleReject = async (fromUser: string) => {
    await rejectFriendRequest.mutateAsync(fromUser);
  };

  const totalBadge = unreadCount + receivedRequests.length;

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
          .notif-panel {
            width: calc(100vw - 16px);
            right: -8px;
          }
        }
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }

        .notif-header {
          padding: 16px 16px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .notif-header-top {
          display: flex; align-items: center; justify-content: space-between;
          // margin-bottom: 12px;
        }
        .notif-header-title {
          font-size: 15px; font-weight: 700;
          color: #111;
          font-family: 'DM Sans', sans-serif;
        }
        .notif-header-actions {
          display: flex; gap: 8px;
        }
        .notif-action-btn {
          background: none; border: none; cursor: pointer;
          font-size: 11px; color: #7c3aed; font-weight: 500;
          padding: 2px 4px; border-radius: 4px;
          transition: background 0.12s;
        }
        .notif-action-btn:hover { background: #7c3aed12; }

        .notif-tabs {
          display: flex; gap: 0;
        }
        .notif-tab {
          background: none; border: none; cursor: pointer;
          font-size: 13px; font-weight: 500;
          color: #888;
          padding: 8px 14px;
          border-bottom: 2px solid transparent;
          transition: color 0.15s, border-color 0.15s;
          display: flex; align-items: center; gap: 6px;
          font-family: 'DM Sans', sans-serif;
        }
        .notif-tab[data-active="true"] {
          color: #111;
          border-bottom-color: #7c3aed;
          font-weight: 700;
        }
        .tab-badge {
          background: #7c3aed;
          color: #fff;
          font-size: 10px; font-weight: 700;
          border-radius: 9999px;
          min-width: 16px; height: 16px;
          display: flex; align-items: center; justify-content: center;
          padding: 0 3px;
          line-height: 1;
        }

        .notif-list {
          overflow-y: auto;
          flex: 1;
          padding: 4px 0;
        }
        .notif-list::-webkit-scrollbar { width: 4px; }
        .notif-list::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }

        .notification-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: background 0.12s;
          position: relative;
          border-bottom: 1px solid #f7f7f7;
        }
        .notification-item:last-child { border-bottom: none; }
        .notification-item:hover { background: #fafafa; }
        .notification-item[data-unread="true"] { background: #7c3aed06; }
        .notification-item[data-unread="true"]:hover { background: #7c3aed10; }

        .notif-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 1px;
        }

        .notif-body { flex: 1; min-width: 0; }
        .notif-title {
          font-size: 13px; font-weight: 600; color: #111;
          display: flex; align-items: center; gap: 6px;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .unread-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #7c3aed; flex-shrink: 0;
        }
        .notif-text {
          font-size: 12px; color: #555; margin-top: 2px;
          line-height: 1.4;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .notif-time { font-size: 11px; color: #aaa; margin-top: 4px; }

        .notif-delete {
          background: none; border: none; cursor: pointer;
          color: #ccc; padding: 2px;
          border-radius: 4px; transition: color 0.12s, background 0.12s;
          flex-shrink: 0; align-self: center;
        }
        .notif-delete:hover { color: #ef4444; background: #ef444412; }

        .friend-actions { display: flex; gap: 6px; align-self: center; flex-shrink: 0; }
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
          aria-label="Notificaciones"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
            notifications
          </span>
          {totalBadge > 0 && (
            <span className="notif-badge">
              {totalBadge > 99 ? "99+" : totalBadge}
            </span>
          )}
        </button>
        {open && (
          <div className="notif-panel">
            <div className="notif-header">
              <div className="notif-header-top">
                {/* <span className="notif-header-title">Actividad</span> */}
                {tab === "notifs" && notifications.length > 0 && (
                  <div className="notif-header-actions">
                    {unreadCount > 0 && (
                      <button
                        className="notif-action-btn"
                        onClick={handleMarkAllRead}
                      >
                        Marcar todas leídas
                      </button>
                    )}
                    <button
                      className="notif-action-btn"
                      onClick={handleDeleteAll}
                    >
                      Eliminar todas
                    </button>
                  </div>
                )}
              </div>
              <div className="notif-tabs">
                <button
                  className="notif-tab"
                  data-active={tab === "notifs"}
                  onClick={() => setTab("notifs")}
                >
                  Notificaciones
                  {unreadCount > 0 && (
                    <span className="tab-badge">{unreadCount}</span>
                  )}
                </button>
                <button
                  className="notif-tab"
                  data-active={tab === "requests"}
                  onClick={() => setTab("requests")}
                >
                  Solicitudes
                  {receivedRequests.length > 0 && (
                    <span className="tab-badge">{receivedRequests.length}</span>
                  )}
                </button>
              </div>
            </div>
            <div className="notif-list">
              {(tab === "notifs" ? loadingNotifications : loadingRequests) ? (
                <div className="notif-loading">Cargando...</div>
              ) : tab === "notifs" ? (
                notifications.length === 0 ? (
                  <div className="notif-empty">
                    <span className="material-symbols-outlined">
                      notifications_off
                    </span>
                    <p>No tienes notificaciones</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <NotificationItem
                      key={n.id}
                      n={n}
                      onRead={handleRead}
                      onDelete={handleDelete}
                    />
                  ))
                )
              ) : receivedRequests.length === 0 ? (
                <div className="notif-empty">
                  <span className="material-symbols-outlined">group_off</span>
                  <p>No tienes solicitudes pendientes</p>
                </div>
              ) : (
                receivedRequests.map((r) => (
                  <FriendRequestItem
                    key={`${r.fromUser}-${r.createdAt}`}
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

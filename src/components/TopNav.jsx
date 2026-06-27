import { useEffect, useState } from "react";
import {
  Menu,
  Maximize2,
  Minimize2,
  Bell,
  LogOut,
  ChevronDown,
  User,
  CheckCheck,
  Trash2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getLogo, getSiteName } from "../utils/siteBranding";
import {
  connectNotificationSocket,
  disconnectNotificationSocket,
  notificationService,
} from "../services/notificationService";

const SITE_URL = import.meta.env.VITE_SITE_URL || "/";
const TUTORIAL_URL = import.meta.env.VITE_TUTORIAL_URL || "";

function notificationId(notification) {
  return notification?.Id ?? notification?.id ?? notification?._id;
}

function sameNotification(left, right) {
  const leftId = notificationId(left);
  const rightId =
    typeof right === "object" ? notificationId(right) : (right ?? null);
  return leftId !== undefined && String(leftId) === String(rightId);
}

function toOptionalCount(value) {
  if (value === undefined || value === null || value === "") return undefined;
  const count = Number(value);
  return Number.isFinite(count) ? count : undefined;
}

export default function TopNav({
  siteSettings,
  onQuickNavigate,
  onNotificationNavigate,
}) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(
    Boolean(document.fullscreenElement),
  );
  const userId = user?.Id;
  const logo = getLogo(siteSettings);
  const siteName = getSiteName(siteSettings);

  const displayName = user
    ? [user.FirstName, user.LastName].filter(Boolean).join(" ") || user.Email
    : "Admin";

  const roleBadge = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "";

  useEffect(() => {
    const handleFullscreenChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!userId) return undefined;
    let active = true;
    const refreshUnreadCount = async () => {
      try {
        const response = await notificationService.getUnreadCount();
        if (active) setUnreadCount(Number(response.data?.count || 0));
      } catch {
        /* the next notification refresh will retry */
      }
    };
    const loadNotifications = async () => {
      try {
        const [listResponse, countResponse] = await Promise.all([
          notificationService.getAll({ page: 1, limit: 20 }),
          notificationService.getUnreadCount(),
        ]);
        if (!active) return;
        setNotifications(listResponse.data || []);
        setUnreadCount(Number(countResponse.data?.count || 0));
      } catch {
        // Socket reconnection or the next dropdown open will retry.
      } finally {
        if (active) setNotificationsLoading(false);
      }
    };

    void loadNotifications();
    const socket = connectNotificationSocket();
    const handleNew = (notification) => {
      setNotifications((previous) =>
        [
          notification,
          ...previous.filter((item) => !sameNotification(item, notification)),
        ].slice(0, 20),
      );
      void refreshUnreadCount();
    };
    const handleReady = () => {
      void loadNotifications();
    };
    const handleRead = ({ id, unreadCount: count }) => {
      setNotifications((previous) =>
        previous.map((item) =>
          sameNotification(item, id)
            ? { ...item, isRead: true, readAt: new Date().toISOString() }
            : item,
        ),
      );
      setUnreadCount(Number(count || 0));
    };
    const handleReadAll = () => {
      setNotifications((previous) =>
        previous.map((item) => ({
          ...item,
          isRead: true,
          readAt: item.readAt || new Date().toISOString(),
        })),
      );
      setUnreadCount(0);
    };
    const handleDeleted = ({ id, unreadCount: count }) => {
      setNotifications((previous) =>
        previous.filter((item) => !sameNotification(item, id)),
      );
      setUnreadCount(Number(count || 0));
    };
    socket?.on("notification:new", handleNew);
    socket?.on("notification:ready", handleReady);
    socket?.on("notification:read", handleRead);
    socket?.on("notification:read-all", handleReadAll);
    socket?.on("notification:deleted", handleDeleted);

    return () => {
      active = false;
      socket?.off("notification:new", handleNew);
      socket?.off("notification:ready", handleReady);
      socket?.off("notification:read", handleRead);
      socket?.off("notification:read-all", handleReadAll);
      socket?.off("notification:deleted", handleDeleted);
      disconnectNotificationSocket();
    };
  }, [userId]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      disconnectNotificationSocket();
      await logout();
    } finally {
      setLoggingOut(false);
    }
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else {
        window.alert("এই browser fullscreen mode support করে না।");
      }
    } catch (error) {
      window.alert(error.message || "Fullscreen mode চালু করা যায়নি।");
    }
  }

  async function openNotification(notification) {
    const id = notificationId(notification);
    const wasUnread = !notification.isRead;
    try {
      const response = id
        ? await notificationService.markAsRead(id)
        : { data: {} };
      const countResponse = await notificationService.getUnreadCount();
      const serverUnreadCount = toOptionalCount(
        countResponse.data?.count ?? response.data?.unreadCount,
      );
      setNotifications((previous) => {
        return previous.map((item) =>
          sameNotification(item, notification)
            ? { ...item, isRead: true, readAt: new Date().toISOString() }
            : item,
        );
      });
      setUnreadCount((previous) => {
        if (!wasUnread) return serverUnreadCount ?? previous;
        const optimistic = Math.max(0, previous - 1);
        if (serverUnreadCount === undefined) return optimistic;
        return serverUnreadCount < previous ? serverUnreadCount : optimistic;
      });
    } catch {
      /* keep the item visible if the request fails */
    }
    setNotificationOpen(false);
    if (notification.url) {
      const handled = onNotificationNavigate?.(notification.url);
      if (!handled) window.location.assign(notification.url);
    }
  }

  async function markAllRead() {
    try {
      const response = await notificationService.markAllAsRead();
      setNotifications((previous) =>
        previous.map((item) => ({
          ...item,
          isRead: true,
          readAt: item.readAt || new Date().toISOString(),
        })),
      );
      setUnreadCount(Number(response.data?.unreadCount || 0));
    } catch {
      /* leave current state unchanged */
    }
  }

  async function deleteNotification(event, id) {
    event.stopPropagation();
    const target = notifications.find((item) => sameNotification(item, id));
    try {
      const response = await notificationService.delete(id);
      setNotifications((previous) =>
        previous.filter((item) => !sameNotification(item, id)),
      );
      if (response.data?.unreadCount !== undefined) {
        setUnreadCount(Number(response.data.unreadCount || 0));
      } else if (target && !target.isRead) {
        setUnreadCount((count) => Math.max(0, count - 1));
      }
    } catch {
      /* leave current state unchanged */
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-between px-4 py-2 sticky top-0 z-10 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button className="p-1 hover:bg-gray-100 rounded">
          <Menu size={20} className="text-gray-600" />
        </button>

        {(logo || siteName) && (
          <div className="hidden sm:flex items-center gap-2 pr-2 border-r border-gray-200">
            {logo && (
              <img
                src={logo}
                alt={siteName || "Logo"}
                className="h-8 w-8 rounded-full object-cover border border-gray-200"
              />
            )}
            {siteName && (
              <span className="text-sm font-bold text-gray-800 max-w-[120px] truncate">
                {siteName}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <NavBtn
            color="bg-green-500"
            label="Visit Site"
            onClick={() =>
              window.open(SITE_URL, "_blank", "noopener,noreferrer")
            }
          />
          <NavBtn
            color="bg-blue-500"
            label="Landing Page"
            onClick={() => onQuickNavigate?.("landing")}
          />
          <NavBtn
            color="bg-orange-400"
            label="Visitors"
            onClick={() => onQuickNavigate?.("visitors")}
          />
          <NavBtn
            color="bg-pink-500"
            label="POS"
            onClick={() => onQuickNavigate?.("pos")}
          />
          <NavBtn
            color="bg-emerald-500"
            label="Expense"
            onClick={() => onQuickNavigate?.("expense")}
          />
          <NavBtn
            color="bg-red-500"
            label="Full Tutorial"
            onClick={() =>
              TUTORIAL_URL
                ? window.open(TUTORIAL_URL, "_blank", "noopener,noreferrer")
                : onQuickNavigate?.("tutorial")
            }
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-1 hover:bg-gray-100 rounded"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 size={18} className="text-gray-500" />
          ) : (
            <Maximize2 size={18} className="text-gray-500" />
          )}
        </button>
        <div className="relative">
          <button
            onClick={() => {
              setNotificationOpen((value) => !value);
              setDropdownOpen(false);
            }}
            className="relative p-1 hover:bg-gray-100 rounded"
            aria-label="Notifications"
          >
            <Bell size={18} className="text-gray-500" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 bg-red-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {notificationOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setNotificationOpen(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-2 w-[360px] max-w-[90vw] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      Notifications
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {unreadCount} unread
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                    >
                      <CheckCheck size={14} /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-[420px] overflow-y-auto">
                  {notificationsLoading ? (
                    <p className="px-4 py-10 text-center text-xs text-gray-400">
                      Loading notifications...
                    </p>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-10 text-center">
                      <Bell size={24} className="mx-auto mb-2 text-gray-300" />
                      <p className="text-xs text-gray-400">
                        No notifications yet
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notificationId(notification)}
                        className={`group flex w-full border-b border-gray-50 transition hover:bg-gray-50 ${notification.isRead ? "bg-white" : "bg-blue-50/60"}`}
                      >
                        <button
                          onClick={() => openNotification(notification)}
                          className="flex min-w-0 flex-1 gap-3 px-4 py-3 text-left"
                        >
                          <span
                            className={`mt-1 h-2 w-2 shrink-0 rounded-full ${notification.isRead ? "bg-gray-200" : notification.priority === "high" ? "bg-red-500" : "bg-blue-500"}`}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-bold text-gray-800">
                              {notification.title}
                            </span>
                            <span className="mt-0.5 line-clamp-2 block text-[11px] leading-4 text-gray-500">
                              {notification.message}
                            </span>
                            <span className="mt-1 block text-[10px] text-gray-400">
                              {formatNotificationTime(notification.createdAt)}
                            </span>
                          </span>
                        </button>
                        <button
                          type="button"
                          aria-label="Delete notification"
                          onClick={(event) =>
                            deleteNotification(
                              event,
                              notificationId(notification),
                            )
                          }
                          className="mr-3 mt-3 hidden self-start text-gray-300 hover:text-red-500 group-hover:block"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shrink-0">
              {user?.image ? (
                <img
                  src={`http://localhost:5000/${user.image}`}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User size={15} className="text-white" />
              )}
            </div>
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="text-xs font-semibold text-gray-800 max-w-[100px] truncate">
                {displayName}
              </span>
              {roleBadge && (
                <span className="text-[10px] text-orange-500 font-medium">
                  {roleBadge}
                </span>
              )}
            </div>
            <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
          </button>

          {dropdownOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.Email}
                  </p>
                  {roleBadge && (
                    <span className="inline-block mt-1 text-[10px] font-medium bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                      {roleBadge}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                >
                  <LogOut size={14} />
                  {loggingOut ? "Signing out..." : "Sign out"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function NavBtn({ color, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${color} text-white text-xs font-medium px-3 py-1.5 rounded-full hover:opacity-90 transition`}
    >
      {label}
    </button>
  );
}

function formatNotificationTime(value) {
  if (!value) return "";
  const date = new Date(value);
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return date.toLocaleDateString();
}

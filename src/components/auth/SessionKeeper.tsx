import { useEffect } from "react";
import { ApiClientError, authApi } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";

const REFRESH_INTERVAL_MS = 10 * 60 * 1000;

export default function SessionKeeper() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    if (!accessToken) return;

    let lastRefreshAt = Date.now();
    let disposed = false;

    const refresh = async () => {
      if (disposed) return;
      try {
        await authApi.refresh();
        lastRefreshAt = Date.now();
      } catch (error) {
        if (error instanceof ApiClientError && (error.status === 401 || error.status === 403)) {
          clearSession();
        }
      }
    };

    const refreshWhenActive = () => {
      if (document.visibilityState === "visible" && Date.now() - lastRefreshAt >= REFRESH_INTERVAL_MS) {
        void refresh();
      }
    };

    const interval = window.setInterval(() => void refresh(), REFRESH_INTERVAL_MS);
    window.addEventListener("focus", refreshWhenActive);
    document.addEventListener("visibilitychange", refreshWhenActive);

    return () => {
      disposed = true;
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshWhenActive);
      document.removeEventListener("visibilitychange", refreshWhenActive);
    };
  }, [accessToken, clearSession]);

  return null;
}

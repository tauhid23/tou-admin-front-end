"use client";

import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";
import { useMe } from "@/lib/api/queries";
import { authApi } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function ProtectedRoute() {
  const location = useLocation();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setSession = useAuthStore((state) => state.setSession);
  const setUser = useAuthStore((state) => state.setUser);
  const clearSession = useAuthStore((state) => state.clearSession);
  const me = useMe(Boolean(accessToken));

  useEffect(() => {
    function syncToken(event: Event) {
      const nextToken = (event as CustomEvent<string | null>).detail;
      if (!nextToken) {
        clearSession();
        return;
      }
      const currentUser = useAuthStore.getState().user;
      if (currentUser) setSession(nextToken, currentUser);
    }

    window.addEventListener("sosbd-auth-token", syncToken);
    return () => window.removeEventListener("sosbd-auth-token", syncToken);
  }, [clearSession, setSession]);

  useEffect(() => {
    if (me.data) setUser(me.data);
  }, [me.data, setUser]);

  useEffect(() => {
    if (me.isError) {
      authApi.clearToken();
      clearSession();
    }
  }, [clearSession, me.isError]);

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (me.isLoading || !me.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-950">Checking admin session</p>
          <div className="mt-4 flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
}

"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, LogIn, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useLogin } from "@/lib/api/queries";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useToast } from "@/lib/providers/ToastProvider";
import { authApi } from "@/lib/api/client";

type LocationState = {
  from?: {
    pathname?: string;
  };
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Sign in failed. Please try again.";
}

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setSession = useAuthStore((state) => state.setSession);
  const redirectTo = (location.state as LocationState | null)?.from?.pathname || "/";

  useEffect(() => {
    if (accessToken) navigate(redirectTo, { replace: true });
  }, [accessToken, navigate, redirectTo]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const session = await login.mutateAsync({ email: email.trim().toLowerCase(), password });
      if (!["super_admin", "admin", "manager"].includes(session.user.role)) {
        await authApi.logout();
        throw new Error("This account does not have admin access.");
      }
      setSession(session.accessToken, session.user);
      toast.success("Signed in", `Welcome back, ${session.user.name}.`);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error("Authentication failed", getErrorMessage(error));
    }
  };

  if (accessToken) return <Navigate to={redirectTo} replace />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-xl">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to manage your SOSBD store</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-5 shadow-2xl backdrop-blur-xl sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Email address</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-white/30"
                placeholder="admin@sosbd.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Password</span>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 pr-12 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-white/30"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-400">
                <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/10" />
                Remember this device
              </label>
              <Link to="/forgot-password" className="font-medium text-white transition hover:text-slate-300">
                Forgot password?
              </Link>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={login.isPending}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {login.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn size={18} />}
              {login.isPending ? "Signing in..." : "Sign in"}
            </motion.button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">Protected access for authorized store staff.</p>
      </motion.div>
    </div>
  );
};

export default SignInPage;

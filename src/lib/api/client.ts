export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";
const TOKEN_KEY = "sosbd_admin_access_token";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
};

type AuthSession = {
  accessToken: string;
  user: AdminUser;
};

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new CustomEvent("sosbd-auth-token", { detail: token }));
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new CustomEvent("sosbd-auth-token", { detail: null }));
}

async function refreshAccessToken() {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  const payload = (await response.json().catch(() => null)) as ApiResponse<AuthSession> | null;
  if (!response.ok || !payload?.success) {
    clearToken();
    throw new Error(payload?.message ?? "Session expired");
  }
  setToken(payload.data.accessToken);
  return payload.data.accessToken;
}

async function request<T>(path: string, init: RequestInit = {}) {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok || !payload?.success) {
    const canRefresh =
      response.status === 401 &&
      !path.startsWith("/auth/login") &&
      !path.startsWith("/auth/refresh") &&
      token;

    if (canRefresh) {
      const nextToken = await refreshAccessToken();
      return request<T>(path, {
        ...init,
        headers: {
          ...init.headers,
          Authorization: `Bearer ${nextToken}`,
        },
      });
    }

    throw new Error(payload?.message ?? `API request failed: ${response.status}`);
  }
  return payload.data;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body instanceof FormData ? body : JSON.stringify(body ?? {}) }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body ?? {}) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body ?? {}) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export const authApi = {
  login: (payload: { email: string; password: string }) =>
    api.post<AuthSession>("/auth/login", payload).then((session) => {
      setToken(session.accessToken);
      return session;
    }),
  me: () => api.get<AdminUser>("/auth/me"),
  refresh: refreshAccessToken,
  logout: () =>
    api.post("/auth/logout").finally(() => {
      clearToken();
    }),
  getToken,
  setToken,
  clearToken,
};

export function uploadImages(files: File[], folder = "sosbd/admin") {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  formData.append("folder", folder);
  return api.post<{ url: string; publicId: string; width?: number; height?: number }[]>(
    "/uploads/images",
    formData
  );
}

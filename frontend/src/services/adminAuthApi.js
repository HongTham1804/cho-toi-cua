const API_BASE_URL = "http://localhost:8000/api";

export const ADMIN_TOKEN_KEY = "admin_token";
export const ADMIN_USER_KEY = "admin_user";

export function getAdminToken() {
  return window.localStorage.getItem(ADMIN_TOKEN_KEY) || window.sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function getStoredAdminUser() {
  const rawUser = window.localStorage.getItem(ADMIN_USER_KEY) || window.sessionStorage.getItem(ADMIN_USER_KEY);

  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
  window.localStorage.removeItem(ADMIN_USER_KEY);
  window.sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  window.sessionStorage.removeItem(ADMIN_USER_KEY);
}

export async function loginAdmin({ identifier, password, remember = false }) {
  const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ identifier, password }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const firstError = payload?.errors && Object.values(payload.errors)[0]?.[0];
    throw new Error(payload.message || firstError || "Không thể đăng nhập quản trị.");
  }

  const storage = remember ? window.localStorage : window.sessionStorage;
  storage.setItem(ADMIN_TOKEN_KEY, payload.token);
  storage.setItem(ADMIN_USER_KEY, JSON.stringify(payload.user));

  return payload;
}

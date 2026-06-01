const API_BASE_URL = 'http://localhost:8000/api';

export const AUTH_TOKEN_KEY = 'auth_token';
export const AUTH_USER_KEY = 'auth_user';

export const getStoredAuthUser = () => {
  try {
    return JSON.parse(window.localStorage.getItem(AUTH_USER_KEY)) || null;
  } catch {
    return null;
  }
};

export const getAuthToken = () => window.localStorage.getItem(AUTH_TOKEN_KEY);

export const saveAuthUser = (user) => {
  if (user) {
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
};

export const clearAuthSession = () => {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
};

export const fetchCurrentUser = async () => {
  const token = getAuthToken();

  if (!token) {
    throw new Error('Missing auth token');
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Cannot fetch current user');
  }

  const payload = await response.json();
  saveAuthUser(payload.user);

  return payload.user;
};

export const updateCurrentUserProfile = async ({ name, phone }) => {
  const token = getAuthToken();

  if (!token) {
    throw new Error('Missing auth token');
  }

  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, phone }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const validationMessage = payload.errors
      ? Object.values(payload.errors).flat().find(Boolean)
      : null;

    throw new Error(validationMessage || payload.message || 'Cannot update current user');
  }

  saveAuthUser(payload.user);

  return payload.user;
};

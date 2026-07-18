const TOKEN_KEY = 'recipe_app_token';
const USER_KEY = 'recipe_app_user';
const AUTH_BASE = 'http://localhost:8080/api/auth';

async function handleAuthResponse(res) {
  if (!res.ok) {
    let message = 'Something went wrong.';
    try {
      const data = await res.json();
      message = Object.values(data).join(', ') || message;
    } catch (_) {}
    throw new Error(message);
  }
  return res.json();
}

export async function signup({ email, name, password }) {
  const res = await fetch(`${AUTH_BASE}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, password })
  });
  const data = await handleAuthResponse(res);
  saveSession(data);
  return data;
}

export async function login({ email, password }) {
  const res = await fetch(`${AUTH_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await handleAuthResponse(res);
  saveSession(data);
  return data;
}

export function saveSession(data) {
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify({ email: data.email, name: data.name }));
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function isLoggedIn() {
  return !!getToken();
}

import { getToken, logout } from './auth.js';

const API_BASE = 'http://localhost:8080/api/recipes';

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  if (res.status === 401) {
    logout();
    window.location.reload();
    throw new Error('Session expired. Please log in again.');
  }
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (typeof data === 'object') {
        message = Object.values(data).join(', ') || message;
      }
    } catch (_) {
      // ignore parse errors
    }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function getRecipes(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}${query ? `?${query}` : ''}`, {
    headers: { ...authHeaders() }
  });
  return handleResponse(res);
}

export async function getRecipe(id) {
  const res = await fetch(`${API_BASE}/${id}`, { headers: { ...authHeaders() } });
  return handleResponse(res);
}

export async function createRecipe(recipe) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(recipe)
  });
  return handleResponse(res);
}

export async function updateRecipe(id, recipe) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(recipe)
  });
  return handleResponse(res);
}

export async function deleteRecipe(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() }
  });
  return handleResponse(res);
}

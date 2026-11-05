/**
 * FramePulse REST API Client Layer (React Frontend <-> Java Backend)
 *
 * Automatically connects to the Java Backend when running on http://localhost:8080/api
 * and gracefully falls back to the local React state store when developing frontend standalone.
 */

const API_BASE_URL = '/api';

export async function checkJavaBackendStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/games`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      const data = await res.json();
      return { online: true, data };
    }
    return { online: false, data: null };
  } catch {
    return { online: false, data: null };
  }
}

export async function apiAddGame(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback to frontend state when Java server is offline
  }
  return null;
}

export async function apiLogSession(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback to frontend state when Java server is offline
  }
  return null;
}

export async function apiSubmitReview(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback to frontend state when Java server is offline
  }
  return null;
}

export async function apiModerateReview(reviewId, action) {
  try {
    const method = action === 'DELETE' ? 'DELETE' : 'PUT';
    const res = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: method === 'PUT' ? JSON.stringify({ status: action }) : undefined,
    });
    if (res.ok) return true;
  } catch {
    // Fallback to frontend state when Java server is offline
  }
  return false;
}

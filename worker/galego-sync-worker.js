// =====================================================
// GALEGO — Cloud Sync Worker (Cloudflare Workers + KV)
//
// Endpoints:
//   POST /login   — Authenticate & return progress
//   POST /save    — Save progress (authenticated)
//   GET  /health  — Health check
//
// Uses Cloudflare KV namespace bound as GALEGO_KV
// =====================================================

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CORS_HEADERS });
}

// Validate user credentials against stored hash
async function authenticate(env, username, passwordHash) {
  if (!username || !passwordHash) return false;

  const storedHash = await env.GALEGO_KV.get(`user:${username}:hash`);

  if (!storedHash) {
    // First login — create the user with this password
    await env.GALEGO_KV.put(`user:${username}:hash`, passwordHash);
    return true;
  }

  return storedHash === passwordHash;
}

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+/g, '/');  // normalize double slashes

    // ── Health check ──
    if (path === '/health' && request.method === 'GET') {
      return jsonResponse({ ok: true, service: 'galego-sync' });
    }

    // ── Login — authenticate & return progress ──
    if (path === '/login' && request.method === 'POST') {
      try {
        const { username, passwordHash } = await request.json();

        if (!username || !passwordHash) {
          return jsonResponse({ ok: false, error: 'Missing credentials' }, 400);
        }

        const valid = await authenticate(env, username, passwordHash);
        if (!valid) {
          return jsonResponse({ ok: false, error: 'Invalid credentials' }, 401);
        }

        // Return stored progress (may be null for new users)
        const progressRaw = await env.GALEGO_KV.get(`user:${username}:progress`);
        const progress = progressRaw ? JSON.parse(progressRaw) : null;

        return jsonResponse({ ok: true, progress });
      } catch (e) {
        return jsonResponse({ ok: false, error: 'Bad request' }, 400);
      }
    }

    // ── Save progress ──
    if (path === '/save' && request.method === 'POST') {
      try {
        const { username, passwordHash, data } = await request.json();

        if (!username || !passwordHash || !data) {
          return jsonResponse({ ok: false, error: 'Missing fields' }, 400);
        }

        const valid = await authenticate(env, username, passwordHash);
        if (!valid) {
          return jsonResponse({ ok: false, error: 'Invalid credentials' }, 401);
        }

        // Store progress as JSON
        await env.GALEGO_KV.put(
          `user:${username}:progress`,
          JSON.stringify(data)
        );

        return jsonResponse({ ok: true, savedAt: new Date().toISOString() });
      } catch (e) {
        return jsonResponse({ ok: false, error: 'Bad request' }, 400);
      }
    }

    // ── 404 for everything else ──
    return jsonResponse({ error: 'Not found' }, 404);
  },
};

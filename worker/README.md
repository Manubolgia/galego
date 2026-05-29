# Galego Cloud Sync — Cloudflare Worker Setup

One-time setup to deploy the sync backend. Takes ~5 minutes.

## Prerequisites

- Node.js installed (you already have this)
- A free [Cloudflare account](https://dash.cloudflare.com/sign-up)

## Step-by-Step Setup

### 1. Check Node.js Version

Wrangler requires Node.js v22 or higher. You can check your version with `node -v`. If you need to upgrade, we recommend using NVM (Node Version Manager).

### 2. Log in to Cloudflare

We'll use `npx` so you don't need to install anything globally.

```bash
npx wrangler login
```

This opens a browser window to authenticate. Click "Allow".

### 3. Create the KV Namespace

From the `worker/` directory:

```bash
cd worker
npx wrangler kv namespace create GALEGO_KV
```

This will output something like:

```
⛅ Creating namespace "galego-sync-GALEGO_KV"
✨ Success! Add the following to your wrangler.toml:
[[kv_namespaces]]
binding = "GALEGO_KV"
id = "abc123def456..."
```

### 4. Update `wrangler.toml`

Copy the `id` from the output above and paste it into `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "GALEGO_KV"
id = "abc123def456..."   # ← paste your actual ID here
```

### 5. Deploy

```bash
npx wrangler deploy
```

This will output your Worker URL, e.g.:

```
Published galego-sync (1.2s)
  https://galego-sync.YOUR-SUBDOMAIN.workers.dev
```

### 6. Update the App

Copy the Worker URL and paste it into `js/state.js` where it says:

```javascript
const SYNC_API_URL = 'https://galego-sync.YOUR-SUBDOMAIN.workers.dev';
```

### 7. Test It

```bash
# Health check
curl https://galego-sync.YOUR-SUBDOMAIN.workers.dev/health

# Should return: {"ok":true,"service":"galego-sync"}
```

### 8. Deploy the App

Commit and push to GitHub. That's it!

## How It Works

- **First login**: The app creates your account automatically (username + password hash stored in KV)
- **Subsequent logins**: Password hash is verified, progress is returned
- **Auto-save**: Every lesson completion pushes data to the cloud
- **Cross-device**: Login with the same credentials on any device to get your progress

## Security

- Passwords are hashed (SHA-256) on the client before sending
- No plaintext passwords are ever transmitted or stored
- The Worker URL in the public repo is harmless — nobody can access data without the password
- Cloudflare provides DDoS protection and rate limiting by default

## Costs

**Free forever** for this use case:
- Workers free tier: 100,000 requests/day
- KV free tier: 100,000 reads/day, 1,000 writes/day
- This app will use approximately 5-20 requests per day

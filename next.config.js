const fs = require('fs');
const path = require('path');

// Automatically read and parse backend/.env or .env if present
function loadEnvFile(relPath) {
  const fullPath = path.resolve(relPath);
  if (fs.existsSync(fullPath)) {
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim();
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    } catch (e) {
      // Ignore read errors
    }
  }
}

// Load root .env first, then fallback to backend/.env
loadEnvFile('.env');
loadEnvFile('.env.local');
loadEnvFile('backend/.env');

const backendUrl =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'http://127.0.0.1:8000';

const publicBackendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  backendUrl;

const publicApiUrl =
  process.env.NEXT_PUBLIC_API_URL || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BACKEND_URL: backendUrl,
    NEXT_PUBLIC_BACKEND_URL: publicBackendUrl,
    NEXT_PUBLIC_API_URL: publicApiUrl,
  },
  async rewrites() {
    return [
      {
        source: '/api/py/:path*',
        destination: `${backendUrl.replace(/\/+$/, '')}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;

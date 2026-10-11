// Cloudflare Worker for the apex domain: serves the landing page from OCI Object Storage.
// Configure in the Worker settings (or wrangler.toml), not in this file:
//   ORIGIN_BASE  https://objectstorage.<region>.oraclecloud.com/n/<namespace>/b/<bucket>/o/<prefix>
//   APEX_HOST    hassasin.com
// www.<APEX_HOST> redirects to the apex. See docs/DEPLOY.md.

// Request headers worth passing to the bucket: Range keeps video seeking working (Safari needs 206).
const FORWARDED_HEADERS = ['range', 'if-none-match', 'if-modified-since', 'accept-encoding'];

// Only these origin headers reach the browser; everything else from OCI (request ids,
// storage tier, version ids, CORS) stays behind the worker.
const PASSED_RESPONSE_HEADERS = [
  'content-type',
  'content-length',
  'content-range',
  'content-encoding',
  'accept-ranges',
  'cache-control',
  'etag',
  'last-modified',
  'vary',
];

const SECURITY_HEADERS = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-frame-options': 'DENY',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  'strict-transport-security': 'max-age=31536000',
};

// Statuses passed through from the bucket; anything else becomes a generic error.
const PASSED_STATUSES = new Set([200, 206, 304]);

const hasExtension = (path) => /\.[a-z0-9]+$/i.test(path.split('/').pop() ?? '');

// Encoded slashes/backslashes or dot segments could be decoded by the storage service
// into a different object path, so such requests never reach the bucket.
function isSafePath(path) {
  if (/%2f|%5c|\\/i.test(path)) return false;
  try {
    return !decodeURIComponent(path).split('/').includes('..');
  } catch {
    return false;
  }
}

function siteResponse(body, status, headers = {}) {
  return new Response(body, { status, headers: { ...SECURITY_HEADERS, ...headers } });
}

function redirect(url) {
  return siteResponse(null, 301, { location: url.toString() });
}

function fromOrigin(origin, status, { keepValidators = true } = {}) {
  const headers = { ...SECURITY_HEADERS };
  for (const name of PASSED_RESPONSE_HEADERS) {
    const value = origin.headers.get(name);
    if (value && (keepValidators || (name !== 'etag' && name !== 'last-modified'))) {
      headers[name] = value;
    }
  }
  return new Response(origin.body, { status, headers });
}

export default {
  async fetch(request, env) {
    const apex = env.APEX_HOST;
    const originBase = env.ORIGIN_BASE?.replace(/\/+$/, '');
    if (!apex || !originBase) {
      return siteResponse('Site is not configured', 500, { 'content-type': 'text/plain' });
    }

    const url = new URL(request.url);
    if (url.hostname === `www.${apex}`) {
      url.hostname = apex;
      return redirect(url);
    }
    if (url.hostname !== apex) return siteResponse('Not found', 404);

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return siteResponse('Method not allowed', 405, { allow: 'GET, HEAD' });
    }

    let path = url.pathname;
    if (!isSafePath(path))
      return siteResponse('Bad request', 400, { 'content-type': 'text/plain' });

    // Astro builds folders (/vi/index.html): add the trailing slash, then serve index.html.
    if (!path.endsWith('/') && !hasExtension(path)) {
      url.pathname = `${path}/`;
      return redirect(url);
    }
    if (path.endsWith('/')) path += 'index.html';

    const origin = await fetch(`${originBase}${path}`, {
      method: request.method,
      headers: forwardHeaders(request),
    });

    if (PASSED_STATUSES.has(origin.status)) return fromOrigin(origin, origin.status);

    // Never pass OCI error bodies through: they name the namespace, bucket and object.
    if (origin.status === 404) {
      const notFound = await fetch(`${originBase}/404.html`, { method: request.method });
      if (notFound.ok) return fromOrigin(notFound, 404, { keepValidators: false });
      return siteResponse('Not found', 404, { 'content-type': 'text/plain' });
    }
    if (origin.status === 416) return siteResponse(null, 416);
    return siteResponse('Upstream error', 502, { 'content-type': 'text/plain' });
  },
};

function forwardHeaders(request) {
  const headers = new Headers();
  for (const name of FORWARDED_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  return headers;
}

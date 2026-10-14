// Backend + frontend are served from the same Express process/origin in
// production (see backend/server.js), so default to a same-origin relative
// path rather than a hardcoded host — a hardcoded localhost fallback baked
// into the production build would make every visitor's browser try to hit
// their own machine instead of the real server. Local dev overrides this via
// VITE_API_URL in .env.
const API_URL = import.meta.env.VITE_API_URL || '';
export default API_URL;

export const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL || 'https://bloomaudit.com';

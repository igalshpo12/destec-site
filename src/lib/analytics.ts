/**
 * Lightweight first-party analytics layer for destec.co.il.
 *
 * Responsibilities:
 *  - Read the public GA4 / Meta Pixel IDs from env.
 *  - Manage cookie-consent state (nothing third-party loads until "granted").
 *  - Capture UTM / click-id attribution (first + last touch) into a first-party
 *    cookie so every lead can be tied back to its campaign.
 *  - Fire conversion events to GA4 + Meta Pixel when they are loaded.
 *
 * All of this is safe to import from client components only.
 */

export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? '';
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '';

/** True when at least one tracking tag is configured (so we should ask for consent). */
export const ANALYTICS_CONFIGURED = Boolean(GA4_ID || META_PIXEL_ID);

export const CONSENT_COOKIE = 'des_consent';
export const ATTRIBUTION_COOKIE = 'des_attr';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

export type ConsentValue = 'granted' | 'denied';

export interface TouchData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  landing_page?: string;
  referrer?: string;
  ts?: string;
}

export interface Attribution {
  first?: TouchData;
  last?: TouchData;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void };
  }
}

/* ------------------------------------------------------------------ cookies */

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, maxAge = COOKIE_MAX_AGE) {
  if (typeof document === 'undefined') return;
  document.cookie =
    `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`;
}

/* ------------------------------------------------------------------ consent */

export function getConsent(): ConsentValue | null {
  const v = readCookie(CONSENT_COOKIE);
  return v === 'granted' || v === 'denied' ? v : null;
}

export function setConsent(value: ConsentValue) {
  writeCookie(CONSENT_COOKIE, value);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('des-consent-change', { detail: value }));
    // Reflect into GA4 Consent Mode if present.
    window.gtag?.('consent', 'update', {
      analytics_storage: value === 'granted' ? 'granted' : 'denied',
      ad_storage: value === 'granted' ? 'granted' : 'denied',
      ad_user_data: value === 'granted' ? 'granted' : 'denied',
      ad_personalization: value === 'granted' ? 'granted' : 'denied',
    });
  }
}

/* -------------------------------------------------------------- attribution */

const TOUCH_KEYS: (keyof TouchData)[] = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
];

/**
 * Reads UTM / click ids from the current URL and persists them.
 * First touch is written once; last touch is refreshed whenever a campaign
 * parameter is present. Call once on every page load (client-side).
 */
export function captureAttribution() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const touch: TouchData = {};
  let hasCampaign = false;
  for (const key of TOUCH_KEYS) {
    const val = params.get(key);
    if (val) {
      touch[key] = val;
      if (key !== 'landing_page') hasCampaign = true;
    }
  }
  if (!hasCampaign) return; // nothing new to record

  touch.landing_page = window.location.pathname;
  touch.referrer = document.referrer || undefined;
  touch.ts = new Date().toISOString();

  let attr: Attribution = {};
  try {
    const raw = readCookie(ATTRIBUTION_COOKIE);
    if (raw) attr = JSON.parse(raw) as Attribution;
  } catch {
    attr = {};
  }
  if (!attr.first) attr.first = touch; // first-touch is sticky
  attr.last = touch; // last-touch always wins
  writeCookie(ATTRIBUTION_COOKIE, JSON.stringify(attr));
}

/** Returns the stored attribution object (or empty) for attaching to a lead. */
export function getAttribution(): Attribution {
  try {
    const raw = readCookie(ATTRIBUTION_COOKIE);
    if (raw) return JSON.parse(raw) as Attribution;
  } catch {
    /* ignore malformed cookie */
  }
  return {};
}

/* ------------------------------------------------------------------- events */

/** Sends an event to GA4 and Meta Pixel if they are loaded. No-ops otherwise. */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', name, params);
}

/**
 * Fires a Meta standard event (e.g. "Lead", "Contact") on the client pixel.
 * Pass an eventId to deduplicate against the server-side CAPI event.
 */
export function trackMeta(event: string, params: Record<string, unknown> = {}, eventId?: string) {
  if (typeof window === 'undefined') return;
  window.fbq?.('track', event, params, eventId ? { eventID: eventId } : undefined);
}

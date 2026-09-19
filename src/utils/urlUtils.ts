/**
 * LinkGuard URL & Domain Utilities
 */

/**
 * Normalizes a raw input (URL or domain) to a clean base hostname (e.g., 'theverge.com').
 * Strips protocol, 'www.', subpage paths, query parameters, hashes, and lowercases.
 */
export function normalizeDomain(input: string): string {
  if (!input) return '';
  let clean = input.trim().toLowerCase();

  // If missing protocol, prepend https:// for URL parsing
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = `https://${clean}`;
  }

  try {
    const parsed = new URL(clean);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    // Fallback regex if URL constructor fails
    return clean
      .replace(/^(https?:\/\/)?(www\.)?/, '')
      .split('/')[0]
      .split('?')[0]
      .split('#')[0];
  }
}

/**
 * Normalizes a full URL, ensuring standard scheme and trimming whitespace.
 */
export function normalizeUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  let trimmed = rawUrl.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    trimmed = `https://${trimmed}`;
  }
  return trimmed;
}

/**
 * Determines whether a given URL is internal to the target website base domain.
 */
export function isInternalDomain(targetUrl: string, baseDomain: string): boolean {
  if (!targetUrl || !baseDomain) return false;
  const cleanBase = normalizeDomain(baseDomain);
  const targetHost = normalizeDomain(targetUrl);

  if (!targetHost || !cleanBase) return false;

  return targetHost === cleanBase || targetHost.endsWith(`.${cleanBase}`);
}

/**
 * Validates whether a string is a well-formed HTTP/HTTPS URL.
 */
export function isValidUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(normalizeUrl(url));
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

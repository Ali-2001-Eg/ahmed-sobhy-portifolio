/**
 * Hostnames the site is allowed to load images from.
 *
 * Single source of truth: `next.config.ts` turns this into `images.remotePatterns`,
 * and the dashboard uses it to warn before you save a URL the site cannot render.
 *
 * Deliberately an allowlist rather than a wildcard: `hostname: '**'` would turn
 * /_next/image into an open proxy that anyone could point at any image on the
 * internet, billed to this project's Vercel image-optimisation quota.
 */
export const IMAGE_HOSTS = [
  'placehold.co',
  'images.unsplash.com',
  'picsum.photos',
  // Free hosts you can paste URLs from
  'res.cloudinary.com',
  'i.ibb.co',
  'i.postimg.cc',
  '*.supabase.co',
  'firebasestorage.googleapis.com',
  '*.firebasestorage.app',
] as const;

/** Does `url` point at a host the site can actually render? */
export function isAllowedImageHost(url: string): boolean {
  let host: string;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    host = parsed.hostname;
  } catch {
    return false;
  }
  return IMAGE_HOSTS.some((pattern) =>
    pattern.startsWith('*.')
      ? host.endsWith(pattern.slice(1)) && host !== pattern.slice(2)
      : host === pattern
  );
}

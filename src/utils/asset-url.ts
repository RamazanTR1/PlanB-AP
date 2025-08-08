export function getAssetUrl(
  path: string | null | undefined,
): string | undefined {
  if (!path) return undefined;
  // Already absolute URL
  if (/^https?:\/\//i.test(path)) return path;
  // Remove leading slashes from path
  const cleanPath = path.replace(/^\/+/, "");
  const base = import.meta.env.VITE_ASSET_BASE_URL || "/api/v1/files/";
  // Ensure base ends with a single slash
  const cleanBase = base.endsWith("/") ? base : `${base}/`;
  return `${cleanBase}${cleanPath}`;
}

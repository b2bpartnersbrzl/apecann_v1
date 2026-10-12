export function sitePath(path: string) {
  return (process.env.NEXT_PUBLIC_SITE_BASE_PATH || '') + path;
}

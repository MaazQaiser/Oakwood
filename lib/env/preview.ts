/**
 * Preview / staging notices for unfinished integrations.
 * Never show these to live customers unless explicitly enabled.
 */
export function showPreviewNotices(): boolean {
  if (process.env.NEXT_PUBLIC_SHOW_PREVIEW_NOTICES === "true") {
    return true;
  }
  if (process.env.NEXT_PUBLIC_SHOW_PREVIEW_NOTICES === "false") {
    return false;
  }
  // Vercel preview/dev only — never production.
  return process.env.VERCEL_ENV !== "production" && process.env.NODE_ENV !== "production"
    ? true
    : process.env.VERCEL_ENV === "preview";
}

const ANALYTICS_KEY = "instantbizsite_analytics";

export interface PageView {
  slug: string;
  timestamp: string;
  path?: string;
}

export interface AnalyticsData {
  pageViews: PageView[];
}

function getAnalytics(): AnalyticsData {
  if (typeof window === "undefined") return { pageViews: [] };
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    return raw ? JSON.parse(raw) : { pageViews: [] };
  } catch {
    return { pageViews: [] };
  }
}

function setAnalytics(data: AnalyticsData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
}

export function trackPageView(slug: string, path = "/") {
  const data = getAnalytics();
  data.pageViews.push({ slug, timestamp: new Date().toISOString(), path });
  setAnalytics(data);
}

export function getPageViewsBySlug(slug: string): PageView[] {
  return getAnalytics().pageViews.filter((v) => v.slug === slug);
}

export function getPageViewsBySlugAndDate(slug: string): Record<string, number> {
  const views = getPageViewsBySlug(slug);
  const byDate: Record<string, number> = {};
  for (const v of views) {
    const d = v.timestamp.slice(0, 10);
    byDate[d] = (byDate[d] || 0) + 1;
  }
  return byDate;
}

export function getDailyTraffic(slug: string): { day: string; value: number }[] {
  const byDate = getPageViewsBySlugAndDate(slug);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const result: { day: string; value: number }[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push({ day: days[d.getDay()], value: byDate[key] || 0 });
  }
  return result;
}

export function getTopPages(slug: string): { page: string; views: number }[] {
  const views = getPageViewsBySlug(slug);
  const counts: Record<string, number> = {};
  for (const v of views) {
    const p = v.path || "/";
    counts[p] = (counts[p] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([page, views]) => ({ page, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);
}

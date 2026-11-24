type SiteRelease = {
  version: string;
  name: string;
  publicationDate: string | null;
};

// Update this record only for an approved public website release. Versions do
// not track individual commits or automatic deployments. Keep publicationDate
// null until the release date is confirmed; when set, use YYYY-MM-DD.
export const siteRelease: SiteRelease = {
  version: "1.2",
  name: "The Skyline Lounge & The Blue Hour",
  publicationDate: "2026-11-24",
};

export function formatPublicationDate(publicationDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${publicationDate}T00:00:00Z`));
}

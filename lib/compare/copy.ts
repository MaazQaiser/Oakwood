export const COMPARE_STORAGE_KEY = "oakwood_compare_v1";
export const COMPARE_MAX = 2;

export const compareCopy = {
  title: "Compare cars",
  emptyDescription: "Choose up to 2 cars to compare side by side.",
  countDescription: (count: number) =>
    count === 1 ? "You’re comparing 1 car." : `You’re comparing ${count} cars.`,
  emptyTitle: "No cars to compare yet",
  emptyBody: "Add up to two used cars from search or a vehicle page, then come back here.",
  browseCars: "Browse used cars",
  addAnother: "Add another car",
  addAnotherHint: "Choose a second used car to compare specs and monthly figures.",
  viewCar: "View car",
  remove: "Remove from compare",
  added: "Added to compare",
  replaced: "Replaced earlier car in compare",
  removed: "Removed from compare",
  compareNow: "Compare now",
  trayLabel: (count: number) =>
    count === 1 ? "Compare (1)" : `Compare (${count})`,
  trayMobile: (count: number) =>
    count === 1 ? "Compare 1 car" : `Compare ${count} cars`,
  back: "Back",
  dash: "—",
} as const;

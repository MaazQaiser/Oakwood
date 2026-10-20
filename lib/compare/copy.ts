export const COMPARE_STORAGE_KEY = "oakwood_compare_v1";
export const COMPARE_MAX = 4;
export const COMPARE_MIN_FOR_TABLE = 2;

export const compareCopy = {
  title: "Compare cars",
  emptyDescription: "Compare up to 4 cars side by side.",
  countDescription: (count: number) =>
    count === 1
      ? "You’re comparing 1 of 4 cars. Add another to see differences."
      : `You’re comparing ${count} of ${COMPARE_MAX} cars.`,
  emptyTitle: "No cars to compare yet",
  emptyBody:
    "Add cars from search or a vehicle page using the heart icon, then come back here.",
  oneCarTitle: "Add another car to compare",
  oneCarBody:
    "Comparison works best with at least two cars. Browse stock and tap the heart to add another.",
  browseCars: "Browse used cars",
  addAnother: "Add another car",
  addAnotherHint: "Choose another used car to compare specs and monthly figures.",
  viewCar: "View car",
  remove: "Remove from comparison",
  add: "Add to comparison",
  added: "Added to comparison",
  removed: "Removed from comparison",
  limitReached: `You can compare up to ${COMPARE_MAX} cars. Remove one to add another.`,
  compareNow: "Compare cars",
  compareDisabled: "Select at least 2 cars to compare",
  trayLabel: (count: number) =>
    count === 1 ? "Compare (1)" : `Compare (${count})`,
  trayMobile: (count: number) =>
    count === 1 ? "Compare 1 car" : `Compare ${count} cars`,
  trayHint: (count: number) =>
    count < COMPARE_MIN_FOR_TABLE
      ? "Add another car to compare"
      : count >= COMPARE_MAX
        ? `Maximum ${COMPARE_MAX} cars selected`
        : `${count} of ${COMPARE_MAX} selected`,
  back: "Back to cars",
  changeSelection: "Change selection",
  dash: "—",
  unavailable: "Unavailable",
  financeUnavailable: "Finance figure unavailable",
  priceModeLegend: "Price display",
  differs: "Differs",
  same: "Same",
} as const;

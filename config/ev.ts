/** Editable EV running-cost assumptions for VDP previews. */
export const EV_RUNNING_COSTS = {
  /** Typical real-world range as a share of WLTP. */
  realWorldRangeFactor: 0.85,
  batteryKwhAssumed: 64,
  milesPerKwhAssumed: 3.4,
  homeRatePencePerKwh: 24,
  publicRatePencePerKwh: 58,
  sliderMinMilesPerMonth: 250,
  sliderMaxMilesPerMonth: 2000,
  sliderDefaultMilesPerMonth: 800,
} as const;

export const EV_CHARGE_TIMES = [
  { id: "home-7kw", label: "Home 7 kW", hoursTo80: 7.5 },
  { id: "home-22kw", label: "Home 22 kW", hoursTo80: 2.5 },
  { id: "rapid-150kw", label: "Rapid 150 kW", hoursTo80: 0.5 },
] as const;
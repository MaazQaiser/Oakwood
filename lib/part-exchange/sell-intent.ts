export type SellIntent = "part-exchange" | "sell-outright";

export const SELL_INTENT_COPY = {
  eyebrow: "Sell or part exchange",
  heading: "What do you want to do with your car?",
  support:
    "Part exchange puts your car towards an Oakwood listing. Selling outright is passed to SellCar Instant (SCI).",
  partExchangeTitle: "Part exchange towards an Oakwood car",
  partExchangeBody:
    "Get a valuation and put the estimate towards a car in our stock.",
  sellOutrightTitle: "Sell my car outright",
  sellOutrightBody:
    "We pass your details to SellCar Instant. They contact you about buying the car.",
  sellFormHeading: "Tell us about the car",
  sellFormSupport:
    "We send this to SCI. You stay on Oakwood until the handoff is confirmed.",
  sellSuccessHeading: "We have passed your details to SCI",
  sellSuccessBody:
    "SellCar Instant will be in touch about buying your car. There is no part-exchange quote from Oakwood on this path.",
  sellSuccessNote:
    "A live SCI destination URL can be added later. This confirmation is the handoff for now.",
} as const;

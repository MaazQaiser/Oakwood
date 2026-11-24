export interface RulesPageContent {
  title: string;
  description: string;
  pendingNotice?: string;
  rules: readonly string[];
  journey?: ReadonlyArray<{ title: string; body: string }>;
}

export const pricePromiseContent: RulesPageContent = {
  title: "Price promise",
  description:
    "How Oakwood compares finance and cash offers when you find the same car advertised for less elsewhere.",
  pendingNotice:
    "Final price-promise rules are pending Oakwood compliance sign-off. The points below reflect the intended customer journey, not live legal wording.",
  journey: [
    {
      title: "Find the car on Oakwood",
      body: "Build your deal on the vehicle you want with the monthly or cash price shown on site.",
    },
    {
      title: "Send the matching advert",
      body: "Share a like-for-like listing for the same make, model, age and specification from another UK dealer.",
    },
    {
      title: "We review and respond",
      body: "Our team checks eligibility of the comparison and confirms whether we can match or beat the price.",
    },
  ],
  rules: [
    "The comparison must be a UK dealer listing for a like-for-like vehicle.",
    "Proof must be sent before you reserve or complete the purchase.",
    "Finance comparisons use the same product type, deposit, term and mileage where PCP applies.",
    "Oakwood decides whether an advert qualifies. We do not guarantee every request will be matched.",
    "If we cannot match the price, we will explain why in writing.",
  ],
};

export const protectionContent: RulesPageContent = {
  title: "Protection products",
  description:
    "Paint, cosmetic and alloy wheel protection available when you collect your Oakwood car.",
  pendingNotice:
    "Product names, cover levels and regulated wording are pending Automotive Compliance Ltd review before publication.",
  rules: [
    "Paint protection helps guard lacquer and paintwork against environmental marking.",
    "Cosmetic protection covers fabric and leather interiors against everyday spills and staining.",
    "Alloy protection reduces the impact of brake dust and corrosion on wheel finishes.",
    "Products are optional. You can deselect them in the deal builder before you reserve.",
    "Full policy terms are provided before you pay, not summarised on this page.",
  ],
};

export const servicingPlansContent: RulesPageContent = {
  title: "Servicing plans",
  description:
    "Spread the cost of manufacturer servicing with fixed monthly payments at Oakwood Bury and Chorley.",
  rules: [
    "Plans cover scheduled services listed in your manufacturer handbook.",
    "You book each service through Oakwood when it is due.",
    "MOT tests are not included unless stated on your plan schedule.",
    "Plan terms, cancellation rules and qualifying vehicles are confirmed before you sign up.",
    "Audi manufacturer servicing is available at both showrooms.",
  ],
};

export const careersContent: RulesPageContent = {
  title: "Careers at Oakwood",
  description:
    "Join the sales, preparation and aftersales teams at Oakwood Motor Company in Bury and Chorley.",
  rules: [
    "We advertise roles that are genuinely open — not placeholder listings.",
    "Applications are reviewed by the hiring manager for that department.",
    "If we invite you to interview, we will confirm the location and who you will meet.",
    "Right-to-work checks are completed before any offer is made.",
    "We do not charge candidates for interviews, training or uniform.",
  ],
};
import { redirect } from "next/navigation";
import { getSciUrl } from "@/config/routes";

/**
 * Site map v2: sell-only customers leave Oakwood for SellCar Instant.
 * Part exchange stays on /partex.php and /valuation.
 */
export default function Page() {
  redirect(getSciUrl({ utmContent: "sell-my-car-page" }));
}

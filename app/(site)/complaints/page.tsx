import { permanentRedirect } from "next/navigation";
import { routes } from "@/config/routes";

/** Complaints sit on Problem with your car?, not a separate hub. */
export default function Page() {
  permanentRedirect(routes.problemWithYourCar);
}

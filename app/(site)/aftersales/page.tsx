import { permanentRedirect } from "next/navigation";
import { routes } from "@/config/routes";

/** Aftersales overview merged into servicing (site map v2). */
export default function Page() {
  permanentRedirect(routes.service);
}

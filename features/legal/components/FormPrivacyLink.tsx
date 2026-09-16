import Link from "next/link";
import { routes } from "@/config/routes";

export function FormPrivacyLink({ className }: { className?: string }) {
  return (
    <p className={className ?? "mt-2"}>
      <Link
        href={routes.privacyPolicy}
        className="text-caption text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        Privacy policy
      </Link>
    </p>
  );
}

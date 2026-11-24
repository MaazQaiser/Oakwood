"use client";

import { useSearchParams } from "next/navigation";
import { Alert } from "@/components/ui/Alert";
import { showrooms } from "@/config/locations";

function showroomName(slug: string | null): string | undefined {
  if (!slug) {
    return undefined;
  }
  return showrooms.find((item) => item.slug === slug)?.name;
}

export function DeliveryMoveCarBanner() {
  const searchParams = useSearchParams();
  const context = searchParams.get("context");
  if (context !== "move-car") {
    return null;
  }

  const stockId = searchParams.get("stock");
  const from = showroomName(searchParams.get("from"));
  const to = showroomName(searchParams.get("to"));

  return (
    <div className="mb-6">
      <Alert title="Move this car between showrooms" tone="info">
        {stockId ? (
          <>
            Request reference stock <strong>{stockId}</strong>
            {from && to ? (
              <>
                {" "}
                to move from Oakwood {from} to Oakwood {to}.
              </>
            ) : (
              " to move between Bury and Chorley."
            )}{" "}
            Call or message us and we will confirm timing and any charge before we
            schedule the transfer.
          </>
        ) : (
          <>
            Ask us to move a car between Bury and Chorley for click & collect or a
            viewing. We confirm timing before you travel.
          </>
        )}
      </Alert>
    </div>
  );
}
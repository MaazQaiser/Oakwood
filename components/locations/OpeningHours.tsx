import { Alert } from "@/components/ui/Alert";
import { LOCATION_HOURS_NOTICE } from "@/lib/locations/content";
import type { ShowroomProfile } from "@/types/locations";

const DEPARTMENT_LABEL = {
  sales: "Sales",
  aftersales: "Aftersales",
} as const;

export function OpeningHours({ profile }: { profile: ShowroomProfile }) {
  return (
    <section aria-labelledby="opening-hours-heading">
      <h2 id="opening-hours-heading" className="text-h3">
        Opening hours
      </h2>
      {profile.openingHours.length === 0 ? (
        <div className="mt-4">
          <Alert title="Hours not published yet" tone="info">
            {LOCATION_HOURS_NOTICE} Sales and aftersales hours, weekend times and
            holiday exceptions will use this same listing when they are supplied.
          </Alert>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[20rem] text-left text-body-sm">
            <caption className="sr-only">
              Opening hours for Oakwood {profile.name}
            </caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="py-2 pr-4 text-label">
                  Department
                </th>
                <th scope="col" className="py-2 pr-4 text-label">
                  Days
                </th>
                <th scope="col" className="py-2 text-label">
                  Hours
                </th>
              </tr>
            </thead>
            <tbody>
              {profile.openingHours.map((row) => (
                <tr
                  key={`${row.department}-${row.days}-${row.hours}`}
                  className="border-b border-border"
                >
                  <th scope="row" className="py-3 pr-4 font-normal">
                    {DEPARTMENT_LABEL[row.department]}
                  </th>
                  <td className="py-3 pr-4">{row.days}</td>
                  <td className="py-3">{row.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {profile.exceptions.length > 0 ? (
        <ul className="mt-4 space-y-2 text-body-sm text-muted">
          {profile.exceptions.map((item) => (
            <li key={item.label}>
              <span className="text-ink">{item.label}:</span> {item.note}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

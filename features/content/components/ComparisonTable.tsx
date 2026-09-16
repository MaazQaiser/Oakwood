export function ComparisonTable({
  caption,
  headers,
  rows,
}: {
  caption?: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="w-full max-w-full overflow-x-auto">
      <table className="w-full table-fixed border-collapse text-left text-body-sm">
        {caption ? <caption className="mb-3 text-left text-caption text-muted">{caption}</caption> : null}
        <thead>
          <tr className="border-b border-border">
            {headers.map((header, index) => (
              <th
                key={`${header}-${index}`}
                scope="col"
                className="break-words px-3 py-3 text-label"
              >
                {header || <span className="sr-only">Attribute</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-b border-border align-top">
              {row.map((cell, index) =>
                index === 0 ? (
                  <th
                    key={`${row[0]}-${index}`}
                    scope="row"
                    className="break-words px-3 py-3 text-label"
                  >
                    {cell}
                  </th>
                ) : (
                  <td key={`${row[0]}-${index}`} className="break-words px-3 py-3 text-muted">
                    {cell || "—"}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ElKitabiTable({
  headers,
  rows,
  caption,
}: {
  headers: string[];
  rows: string[][];
  caption?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-sage-200">
      <table className="min-w-full text-left text-xs sm:text-sm">
        {caption && (
          <caption className="px-3 py-2 text-left text-xs font-medium text-sage-500">
            {caption}
          </caption>
        )}
        <thead className="bg-sage-50">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="whitespace-nowrap px-3 py-2 font-semibold text-goethe-blue"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-sage-50/50"}>
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 text-sage-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

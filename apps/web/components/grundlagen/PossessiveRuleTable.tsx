"use client";

import type { PossessiveRule, PossessiveOwnerId } from "@/lib/grundlagen";

interface PossessiveRuleTableProps {
  rules: PossessiveRule[];
  highlightOwner?: PossessiveOwnerId;
}

export function PossessiveRuleTable({ rules, highlightOwner }: PossessiveRuleTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-sage-100">
      <table className="w-full min-w-[480px] text-sm">
        <thead>
          <tr className="bg-sage-50 text-left text-xs uppercase text-sage-500">
            <th className="px-3 py-2">Artikel</th>
            <th className="px-3 py-2">Örnek</th>
            {rules.map((r) => (
              <th
                key={r.owner}
                className={`px-3 py-2 ${highlightOwner === r.owner ? "bg-goethe-blue/10 text-goethe-blue" : ""}`}
              >
                {r.owner_tr}
                <span className="ml-1 font-normal normal-case text-sage-400">({r.owner})</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-sage-100">
            <td className="px-3 py-2 font-medium text-goethe-blue">der / das</td>
            <td className="px-3 py-2 text-sage-600">Sohn, Kind</td>
            {rules.map((r) => (
              <td
                key={`${r.owner}-mn`}
                className={`px-3 py-2 font-semibold text-goethe-blue ${
                  highlightOwner === r.owner ? "bg-goethe-blue/5" : ""
                }`}
              >
                {r.masc_neut} Sohn
              </td>
            ))}
          </tr>
          <tr className="border-t border-sage-100">
            <td className="px-3 py-2 font-medium text-goethe-blue">die</td>
            <td className="px-3 py-2 text-sage-600">Schwester, Familie</td>
            {rules.map((r) => (
              <td
                key={`${r.owner}-f`}
                className={`px-3 py-2 font-semibold text-goethe-blue ${
                  highlightOwner === r.owner ? "bg-goethe-blue/5" : ""
                }`}
              >
                {r.fem_pl} Schwester
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

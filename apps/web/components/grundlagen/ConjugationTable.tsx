"use client";

import { AudioButton } from "@/components/AudioButton";
import type { ConjugationRow, ConjugationVerb } from "@/lib/grundlagen";

interface ConjugationTableProps {
  verb: ConjugationVerb;
}

export function ConjugationTable({ verb }: ConjugationTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-sage-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-goethe-blue/10 text-left text-xs uppercase tracking-wide text-goethe-blue">
            <th className="px-3 py-2">Zamir</th>
            <th className="px-3 py-2">Türkçe</th>
            <th className="px-3 py-2 font-bold">{verb.infinitive}</th>
            <th className="px-3 py-2 w-20" />
          </tr>
        </thead>
        <tbody>
          {verb.rows.map((row) => (
            <ConjugationRowView key={row.personId} row={row} verb={verb} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ConjugationRowView({ row, verb }: { row: ConjugationRow; verb: ConjugationVerb }) {
  const full = `${row.pronoun_de} ${row.form}`;
  const highlight =
    row.personId === "du" ||
    row.personId === "er" ||
    row.personId === "sie_she" ||
    row.personId === "es";

  return (
    <tr
      className={`border-t border-sage-50 ${highlight ? "bg-goethe-gold/10" : "bg-white"}`}
    >
      <td className="px-3 py-2 font-semibold text-goethe-blue">{row.pronoun_de}</td>
      <td className="px-3 py-2 text-sage-600">{row.pronoun_tr}</td>
      <td className="px-3 py-2 font-bold text-goethe-blue">{row.form}</td>
      <td className="px-3 py-2">
        <AudioButton text={full} size="sm" label="Dinle" />
      </td>
    </tr>
  );
}

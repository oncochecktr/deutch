"use client";

import { useState } from "react";
import { ContentTransition } from "@/components/ContentTransition";
import { TrainerCorrectFeedback } from "@/components/grundlagen/TrainerCorrectFeedback";
import type { FormField } from "@/lib/grundlagen";

interface FormTrainerProps {
  fields: FormField[];
}

export function FormTrainer({ fields }: FormTrainerProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const setField = (de: string, v: string) => {
    setValues((prev) => ({ ...prev, [de]: v }));
    setChecked(false);
  };

  const filled = fields.filter((f) => (values[f.de] ?? "").trim().length > 0).length;
  const allFilled = checked && filled === fields.length;

  return (
    <div className="space-y-4">
      <div className="card-soft border-l-4 border-goethe-blue p-4">
        <p className="text-sm font-medium text-goethe-blue">Anmeldung / Meldebogen (örnek)</p>
        <p className="mt-1 text-xs text-sage-500">
          A1 sınavında ve resmi formlarda bu alanlar çıkar. Almanca etiketleri ezberle.
        </p>
        <p className="mt-2 text-xs text-sage-400">
          Doldurulan: {filled}/{fields.length}
        </p>
      </div>

      <ContentTransition stepKey={checked ? "checked" : "form"} direction={1}>
        <div className="card-soft divide-y divide-sage-100">
          {fields.map((f) => (
            <label key={f.de} className="block p-4">
              <span className="text-xs font-semibold uppercase text-goethe-blue">{f.label_de}</span>
              <span className="ml-2 text-xs text-sage-400">({f.tr})</span>
              <input
                type="text"
                className="mt-2 w-full rounded-lg border border-sage-200 px-3 py-2 text-sm focus:border-goethe-blue focus:outline-none focus:ring-2 focus:ring-goethe-blue/20"
                placeholder={f.hint}
                value={values[f.de] ?? ""}
                onChange={(e) => setField(f.de, e.target.value)}
              />
              {checked && !values[f.de]?.trim() && (
                <span className="mt-1 block animate-feedback-in text-xs text-goethe-red">
                  Örnek: {f.hint}
                </span>
              )}
            </label>
          ))}
        </div>
      </ContentTransition>

      <button
        type="button"
        className="btn-primary-lg w-full"
        onClick={() => setChecked(true)}
      >
        Kontrol et
      </button>
      {allFilled && (
        <TrainerCorrectFeedback
          answer="Form tamam — Schreiben bölümünde benzer alanlar gelir."
          reward={{ title: "Form tamam!", subtitle: "Tüm alanlar dolu" }}
        />
      )}
    </div>
  );
}

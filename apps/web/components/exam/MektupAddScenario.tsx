"use client";

import { useState } from "react";
import type { MektupLevel } from "@/lib/mektupTypes";
import { addCustomScenario } from "@/lib/mektupStorage";

const BULLET_COUNT: Record<MektupLevel, number> = { A1: 3, B1: 4 };

export function MektupAddScenario({
  level,
  onAdded,
  onCancel,
}: {
  level: MektupLevel;
  onAdded: (id: string) => void;
  onCancel: () => void;
}) {
  const n = BULLET_COUNT[level];
  const [titleTr, setTitleTr] = useState("");
  const [promptDe, setPromptDe] = useState("");
  const [promptTr, setPromptTr] = useState("");
  const [bullets, setBullets] = useState(() =>
    Array.from({ length: n }, () => ({ de: "", tr: "" }))
  );

  const canSave = titleTr.trim() && promptDe.trim() && bullets.some((b) => b.de.trim());

  const submit = () => {
    if (!canSave) return;
    const scenario = addCustomScenario(level, {
      titleTr,
      promptDe,
      promptTr,
      bullets: bullets.filter((b) => b.de.trim()),
    });
    onAdded(scenario.id);
  };

  return (
    <div className="card-soft space-y-3 border-2 border-goethe-gold/30 p-4">
      <p className="text-sm font-semibold text-goethe-blue">Yeni senaryo ekle</p>
      <p className="text-xs text-sage-500">
        Goethe {level} formatında kendi konunu yaz. Kayıt tarayıcıda kalır.
      </p>

      <label className="block text-xs text-sage-500">
        Başlık (Türkçe)
        <input
          className="mt-1 w-full rounded-lg border border-sage-200 px-3 py-2 text-sm"
          value={titleTr}
          onChange={(e) => setTitleTr(e.target.value)}
          placeholder="Örn: Komşu gürültü şikâyeti"
        />
      </label>

      <label className="block text-xs text-sage-500">
        Görev metni (Almanca — sınavdaki gibi)
        <textarea
          className="mt-1 w-full rounded-lg border border-sage-200 px-3 py-2 text-sm"
          rows={3}
          value={promptDe}
          onChange={(e) => setPromptDe(e.target.value)}
          placeholder="Schreiben Sie an …"
        />
      </label>

      <label className="block text-xs text-sage-500">
        Türkçe açıklama (isteğe bağlı)
        <input
          className="mt-1 w-full rounded-lg border border-sage-200 px-3 py-2 text-sm"
          value={promptTr}
          onChange={(e) => setPromptTr(e.target.value)}
          placeholder="Ne yazman gerektiğini kısaca"
        />
      </label>

      <div className="space-y-2">
        <p className="text-xs font-medium text-sage-600">
          Madde işaretli sorular ({n} adet)
        </p>
        {bullets.map((b, i) => (
          <div key={i} className="grid gap-1 sm:grid-cols-2">
            <input
              className="rounded-lg border border-sage-200 px-2 py-1.5 text-xs"
              value={b.de}
              onChange={(e) => {
                const next = [...bullets];
                next[i] = { ...next[i]!, de: e.target.value };
                setBullets(next);
              }}
              placeholder={`Soru ${i + 1} (DE)`}
            />
            <input
              className="rounded-lg border border-sage-200 px-2 py-1.5 text-xs"
              value={b.tr}
              onChange={(e) => {
                const next = [...bullets];
                next[i] = { ...next[i]!, tr: e.target.value };
                setBullets(next);
              }}
              placeholder={`Soru ${i + 1} (TR)`}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-1">
        <button type="button" className="btn-secondary flex-1" onClick={onCancel}>
          İptal
        </button>
        <button
          type="button"
          className="btn-primary flex-1"
          disabled={!canSave}
          onClick={submit}
        >
          Kaydet ve yaz
        </button>
      </div>
    </div>
  );
}

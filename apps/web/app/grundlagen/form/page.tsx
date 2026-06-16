"use client";

import { PageShell } from "@/components/PageShell";
import { FormTrainer } from "@/components/grundlagen/FormTrainer";
import { getA1Core } from "@/lib/grundlagen";

export default function FormPage() {
  const { goetheForm } = getA1Core();

  return (
    <PageShell
      title={`${goetheForm.title} — ${goetheForm.titleTr}`}
      subtitle="Ad, soyad, adres, telefon, doğum tarihi, ülke"
      backHref="/grundlagen"
      backLabel="Temel modüllere dön"
      maxWidth="md"
    >
      <FormTrainer fields={goetheForm.fields} />
    </PageShell>
  );
}

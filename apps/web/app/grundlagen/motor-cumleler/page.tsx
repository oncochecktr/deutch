"use client";

import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { MotorDrillPanel } from "@/components/grundlagen/MotorDrillPanel";
import { getMotorDrillGroups } from "@/lib/motorDrills";

export default function MotorCumlelerPage() {
  const groups = getMotorDrillGroups();

  return (
    <PageShell
      title="A1 Motor Cümleleri"
      subtitle="Soru–cevap kalıpları · haben · brauchen · wo ist · das ist"
      backHref="/grundlagen"
      backLabel="Gramer modüllere dön"
      maxWidth="md"
    >
      <p className="text-sm text-sage-600">
        Bunlar kursun omurgası — ezberle, sonra kart ve Konuş-Dinle ile pekiştir. Her grup ilgili
        modüle bağlı.
      </p>

      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.id}>
            <Link
              href={group.moduleHref}
              className="mb-2 inline-block text-xs font-semibold text-goethe-blue hover:underline"
            >
              → {group.moduleHref.replace("/grundlagen/", "")}
            </Link>
            <MotorDrillPanel groups={[group]} />
          </div>
        ))}
      </div>
    </PageShell>
  );
}

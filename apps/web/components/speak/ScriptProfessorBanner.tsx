import Link from "next/link";

export function ScriptProfessorBanner({ lessonTitle }: { lessonTitle: string }) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 text-sm text-emerald-950">
      <p className="font-semibold text-emerald-900">Profesör modu — {lessonTitle}</p>
      <p className="mt-1 text-xs leading-relaxed text-emerald-800/90">
        Bu ders API anahtarı olmadan çalışır: müfredat, sesli anlatım ve yerel cevap kontrolü.
        Serbest konuşma ve gelişmiş geri bildirim için{" "}
        <Link href="/ayarlar" className="font-semibold underline">
          API ayarlarına
        </Link>{" "}
        anahtar ekleyebilirsiniz.
      </p>
    </div>
  );
}

import Link from "next/link";

export function ScriptProfessorBanner({ lessonTitle }: { lessonTitle: string }) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
      <p className="font-semibold text-emerald-900">{lessonTitle}</p>
      <p className="mt-1 text-sm text-emerald-800">
        API anahtarı gerekmez.{" "}
        <Link href="/ayarlar" className="font-semibold underline">
          Ayarlar
        </Link>
        {" "}— gelişmiş geri bildirim.
      </p>
    </div>
  );
}

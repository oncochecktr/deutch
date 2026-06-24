import Link from "next/link";

interface ExamModuleShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  backHref?: string;
}

export function ExamModuleShell({
  title,
  subtitle,
  children,
  backHref = "/exam",
}: ExamModuleShellProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-start justify-between gap-4 border-b border-sage-100 pb-4">
        <div>
          <Link href={backHref} className="text-sm text-sage-500 hover:text-goethe-blue">
            ← A1 Sınav Modülleri
          </Link>
          <span className="goethe-badge mt-2 block w-fit">{title}</span>
          <p className="mt-2 text-base leading-relaxed text-sage-600">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export function ExamScoreBar({
  correct,
  total,
  label,
}: {
  correct: number;
  total: number;
  label: string;
}) {
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const pass = pct >= 75;
  return (
    <div className="card-soft p-6 text-center">
      <p className="text-base text-sage-600">{label}</p>
      <p className="mt-2 text-4xl font-bold text-goethe-blue">
        {correct}/{total}
      </p>
      <p className={`mt-1 text-xl font-semibold ${pass ? "text-sage-600" : "text-goethe-red"}`}>%{pct}</p>
      <p className="mt-2 text-sm text-sage-500">
        {pass ? "A1 hedefi geçildi (≥%75)" : "Hedef: en az %75 — tekrar dene"}
      </p>
    </div>
  );
}

import { AudioButton } from "@/components/AudioButton";
import { IconX } from "@/components/icons";

interface TrainerWrongFeedbackProps {
  correctAnswer: string;
  reasons: string[];
  ruleTr?: string | null;
}

export function TrainerWrongFeedback({
  correctAnswer,
  reasons,
  ruleTr,
}: TrainerWrongFeedbackProps) {
  return (
    <div className="animate-feedback-in rounded-xl bg-red-50 p-4 text-sm text-red-900">
      <div className="animate-shake-soft flex items-center gap-2 font-semibold">
        <IconX size={18} />
        Yanlış
      </div>

      <p className="mt-3">
        Doğru cümle: <strong className="text-goethe-blue">{correctAnswer}</strong>
      </p>
      <div className="mt-2">
        <AudioButton text={correctAnswer} label="Doğru cümleyi dinle" />
      </div>

      {reasons.length > 0 && (
        <div className="mt-4 border-t border-red-100 pt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-800/80">
            Neden yanlış?
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-sage-800">
            {reasons.slice(0, 3).map((r, i) => (
              <li
                key={r}
                className="animate-reason-stagger"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {ruleTr && (
        <div className="mt-3 rounded-lg border border-goethe-gold/30 bg-goethe-gold/10 px-3 py-2">
          <p className="text-xs font-semibold text-goethe-blue">Kural</p>
          <p className="mt-1 text-sm leading-relaxed text-sage-800">{ruleTr}</p>
        </div>
      )}
    </div>
  );
}

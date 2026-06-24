import Link from "next/link";
import { IconArrowRight } from "@/components/icons";
import { LEARNING_METHOD_STEPS } from "@/lib/homeLearningPath";

export function LearningMethodGuide() {
  return (
    <section id="nasil-ogrenilir" className="scroll-mt-24">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-goethe-blue sm:text-xl">Nasıl öğrenilir?</h2>
        <p className="mt-0.5 text-sm text-sage-500">Cümle → dikte → konuş → gramer</p>
      </div>

      <ol className="grid gap-3 sm:grid-cols-2">
        {LEARNING_METHOD_STEPS.map((step) => (
          <li key={step.order}>
            <Link
              href={step.href}
              className="animate-fade-in-up group flex h-full flex-col rounded-2xl border border-sage-100 bg-white p-3.5 shadow-sm transition hover:border-goethe-blue/25 hover:shadow-md sm:p-4"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-goethe-gold/20 text-sm font-bold text-goethe-blue">
                  {step.order}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-goethe-blue">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-sage-600">{step.body}</p>
                </div>
              </div>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-goethe-blue group-hover:gap-1.5 transition-all">
                {step.cta}
                <IconArrowRight size={16} />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

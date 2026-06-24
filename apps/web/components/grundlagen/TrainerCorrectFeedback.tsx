import { AudioButton } from "@/components/AudioButton";
import { IconCheck } from "@/components/icons";
import type { TrainerReward } from "@/lib/trainerRewards";

interface TrainerCorrectFeedbackProps {
  answer: string;
  reward?: TrainerReward | null;
}

export function TrainerCorrectFeedback({ answer, reward }: TrainerCorrectFeedbackProps) {
  return (
    <div className="welcome-pop animate-feedback-in rounded-xl bg-sage-100 p-4 text-sm text-sage-800">
      <div className="flex items-center gap-2 font-semibold">
        <span className="animate-check-pulse inline-flex">
          <IconCheck size={18} />
        </span>
        Doğru!
      </div>

      {reward && (
        <div className="mt-2 rounded-lg border border-goethe-gold/40 bg-goethe-gold/15 px-3 py-1.5">
          <p className="text-sm font-semibold text-goethe-blue">{reward.title}</p>
          {reward.subtitle && (
            <p className="text-xs text-sage-600">{reward.subtitle}</p>
          )}
        </div>
      )}

      <div className="mt-3 flex justify-center">
        <AudioButton text={answer} label="Cümleyi dinle" />
      </div>
    </div>
  );
}

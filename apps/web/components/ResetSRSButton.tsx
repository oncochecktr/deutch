"use client";

import { resetStudyProfile } from "@/lib/progress";
import { clearAllStudyStorage, STUDY_RESET_CONFIRM_MSG } from "@/lib/studyReset";
import { useProgress } from "@/lib/ProgressContext";

interface ResetSRSButtonProps {
  className?: string;
  label?: string;
  onAfterReset?: () => void;
}

export function ResetSRSButton({
  className,
  label = "Tüm ilerlemeyi sıfırla",
  onAfterReset,
}: ResetSRSButtonProps) {
  const { progress, updateProgress } = useProgress();

  const handleClick = () => {
    if (!window.confirm(STUDY_RESET_CONFIRM_MSG)) return;
    clearAllStudyStorage();
    if (onAfterReset) {
      onAfterReset();
      return;
    }
    updateProgress(resetStudyProfile(progress));
  };

  return (
    <button type="button" className={className} onClick={handleClick}>
      {label}
    </button>
  );
}

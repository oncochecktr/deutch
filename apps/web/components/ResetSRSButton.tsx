"use client";

import { resetStudyProfile } from "@/lib/progress";
import { useProgress } from "@/lib/ProgressContext";

const CONFIRM_MSG =
  "Tüm profil istatistikleri sıfırlansın mı?\n\n" +
  "• Kelime, SRS, kart konumu\n" +
  "• Hören, Lesen, Schreiben, Sprechen ilerlemesi\n" +
  "• Deneme sınavları ve bugünkü sayaçlar\n" +
  "• Hedef sınav tarihi (yeniden hesaplanır)\n\n" +
  "Bu işlem geri alınamaz. Sadece bu tarayıcıdaki kayıt silinir.";

interface ResetSRSButtonProps {
  className?: string;
  label?: string;
  onAfterReset?: () => void;
}

export function ResetSRSButton({
  className,
  label = "Göstergeleri sıfırla",
  onAfterReset,
}: ResetSRSButtonProps) {
  const { progress, updateProgress } = useProgress();

  const handleClick = () => {
    if (!window.confirm(CONFIRM_MSG)) return;
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

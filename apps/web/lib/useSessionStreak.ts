import { useCallback, useRef, useState } from "react";

/** Oturum içi üst üste doğru cevap sayacı */
export function useSessionStreak() {
  const [streak, setStreak] = useState(0);
  const streakRef = useRef(0);

  const recordCorrect = useCallback(() => {
    streakRef.current += 1;
    setStreak(streakRef.current);
    return streakRef.current;
  }, []);

  const recordWrong = useCallback(() => {
    streakRef.current = 0;
    setStreak(0);
  }, []);

  const reset = useCallback(() => {
    streakRef.current = 0;
    setStreak(0);
  }, []);

  return { streak, recordCorrect, recordWrong, reset };
}

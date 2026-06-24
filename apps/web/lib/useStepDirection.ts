import { useCallback, useState } from "react";
import type { SlideDirection } from "@/components/ContentTransition";

/** Önceki / sonraki adımda animasyon yönü */
export function useStepDirection(initial = 0) {
  const [index, setIndex] = useState(initial);
  const [direction, setDirection] = useState<SlideDirection>(1);

  const goTo = useCallback((next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex(next);
  }, [index]);

  const goNext = useCallback(
    (max?: number) => {
      setDirection(1);
      setIndex((i) => (max !== undefined ? Math.min(i + 1, max) : i + 1));
    },
    []
  );

  const goPrev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const reset = useCallback((to = 0) => {
    setDirection(1);
    setIndex(to);
  }, []);

  return { index, direction, goTo, goNext, goPrev, reset, setIndex };
}

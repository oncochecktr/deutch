"use client";

import { useEffect, useState } from "react";

interface ExamTimerProps {
  endsAt: number;
  onExpire: () => void;
  label?: string;
}

export function ExamTimer({ endsAt, onExpire, label = "Kalan süre" }: ExamTimerProps) {
  const [remaining, setRemaining] = useState(() => Math.max(0, endsAt - Date.now()));

  useEffect(() => {
    const tick = () => {
      const left = Math.max(0, endsAt - Date.now());
      setRemaining(left);
      if (left <= 0) onExpire();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt, onExpire]);

  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  const urgent = remaining < 5 * 60 * 1000;

  return (
    <div
      className={`sticky top-0 z-20 flex items-center justify-between rounded-xl px-4 py-2 text-sm font-medium ${
        urgent ? "bg-red-600 text-white" : "bg-goethe-blue text-white"
      }`}
    >
      <span>{label}</span>
      <span className="tabular-nums text-lg font-bold">
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </span>
    </div>
  );
}

export function createExamDeadline(minutes: number): number {
  return Date.now() + minutes * 60 * 1000;
}

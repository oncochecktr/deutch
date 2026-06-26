"use client";

import { useEffect, useState } from "react";
import {
  loadLearnerProfile,
  saveLearnerProfile,
  type LearnerGender,
  type LearnerLevel,
} from "@/lib/learnerProfileStorage";

interface LearnerOnboardingProps {
  onComplete: () => void;
}

export function LearnerOnboarding({ onComplete }: LearnerOnboardingProps) {
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<LearnerGender>("other");
  const [level, setLevel] = useState<LearnerLevel>("a1");

  useEffect(() => {
    const p = loadLearnerProfile();
    if (p.firstName) setFirstName(p.firstName);
    if (p.lastName) setLastName(p.lastName);
    if (p.gender) setGender(p.gender);
    if (p.level) setLevel(p.level);
  }, []);

  const finish = () => {
    saveLearnerProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      level,
      showTurkish: true,
      onboardingComplete: true,
    });
    onComplete();
  };

  const canNext =
    step === 0 ? firstName.trim().length >= 2 : step === 1 ? true : true;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-goethe-blue/40 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal
      aria-labelledby="onboard-title"
    >
      <div className="w-full max-w-sm rounded-2xl border border-sage-100 bg-cream-50 shadow-xl">
        <div className="border-b border-sage-100 px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-sage-400">
            Adım {step + 1} / 3
          </p>
          <h2 id="onboard-title" className="mt-1 text-lg font-bold text-goethe-blue">
            {step === 0 && "Seni tanıyalım"}
            {step === 1 && "Cinsiyet"}
            {step === 2 && "Almanca seviyen"}
          </h2>
        </div>

        <div className="space-y-4 p-5">
          {step === 0 && (
            <>
              <label className="block">
                <span className="text-xs text-sage-500">Adın</span>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-sage-200 px-3 py-2.5 text-goethe-blue"
                  placeholder="Ayşe"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoFocus
                />
              </label>
              <label className="block">
                <span className="text-xs text-sage-500">Soyadın (isteğe bağlı)</span>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-sage-200 px-3 py-2.5 text-goethe-blue"
                  placeholder="Yılmaz"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
              <p className="text-xs text-sage-400">
                İsminle kişisel cümleler oluşturulur — sadece bu cihazda kalır.
              </p>
            </>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-2">
              {(
                [
                  ["female", "Kadın", "Studentin"],
                  ["male", "Erkek", "Student"],
                  ["other", "Belirtmek istemiyorum", "Schüler"],
                ] as const
              ).map(([id, label, de]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setGender(id)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm ${
                    gender === id
                      ? "border-goethe-blue bg-goethe-blue/5 font-semibold text-goethe-blue"
                      : "border-sage-100 text-sage-600"
                  }`}
                >
                  {label}
                  <span className="ml-2 text-xs text-sage-400">({de})</span>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ["a1", "A1 — başlangıç"],
                  ["a2", "A2"],
                  ["b1", "B1"],
                  ["unsure", "Bilmiyorum"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setLevel(id)}
                  className={`rounded-xl border px-3 py-3 text-sm ${
                    level === id
                      ? "border-goethe-blue bg-goethe-blue text-white"
                      : "border-sage-100 text-sage-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {step > 0 && (
              <button
                type="button"
                className="btn-secondary flex-1"
                onClick={() => setStep((s) => s - 1)}
              >
                Geri
              </button>
            )}
            {step < 2 ? (
              <button
                type="button"
                className="btn-primary flex-1"
                disabled={!canNext}
                onClick={() => setStep((s) => s + 1)}
              >
                İleri
              </button>
            ) : (
              <button type="button" className="btn-primary flex-1" onClick={finish}>
                Başla →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

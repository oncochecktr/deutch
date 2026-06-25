"use client";

import { useMemo, useState } from "react";
import type { VocabularyWord } from "@german-coach/vocabulary";
import { AudioButton } from "./AudioButton";
import { HearAndWrite } from "./HearAndWrite";
import { IconStar } from "./icons";
import { formatWord } from "@/lib/audio";
import { PATTERN_LABEL_TR, type VocabPatternId } from "@/lib/wordPatternSlots";
import { getWordPatterns } from "@/lib/wordPatterns";
import {
  getWordKindLabel,
  isCriticalWord,
  splitExamples,
  splitMeanings,
} from "@/lib/vocabMeta";

interface WordCardProps {
  word: VocabularyWord;
  flipped?: boolean;
  onFlip?: () => void;
  showActions?: boolean;
  onKnow?: () => void;
  onDontKnow?: () => void;
  readOnly?: boolean;
  size?: "default" | "large";
  dontKnowLabel?: string;
  knowLabel?: string;
  showActionHints?: boolean;
  showHearAndWrite?: boolean;
}

function ExampleBlock({
  examples,
  large,
  compact,
}: {
  examples: { de: string; tr: string }[];
  large?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={`w-full space-y-2 text-left ${compact ? "" : "space-y-3"}`}>
      {!compact && (
        <p className="text-sm font-semibold uppercase tracking-wide text-sage-400">Örnek cümle</p>
      )}
      {examples.map((ex) => (
        <div
          key={ex.de || ex.tr}
          className={`rounded-xl border border-sage-100 bg-sage-50 ${
            compact ? "p-3" : large ? "p-4" : "p-3"
          }`}
        >
          <p
            className={`font-medium italic text-sage-800 ${
              compact ? "text-sm sm:text-base" : large ? "text-lg sm:text-xl" : "text-base"
            }`}
          >
            {ex.de && ex.de !== "—" ? (
              <>
                <span className="mr-1.5 text-sm font-semibold uppercase not-italic text-sage-400">
                  DE ·
                </span>
                „{ex.de}"
              </>
            ) : (
              <span className="text-sage-400">Almanca cümle yok</span>
            )}
          </p>
          <p
            className={`mt-2 border-t border-sage-200/80 pt-2 font-semibold text-goethe-blue ${
              compact
                ? "text-base sm:text-lg"
                : large
                  ? "text-xl sm:text-2xl"
                  : "text-lg sm:text-xl"
            }`}
          >
            {ex.tr ? (
              <>
                <span className="mr-1.5 text-sm font-semibold uppercase text-sage-400">
                  TR ·
                </span>
                {ex.tr}
              </>
            ) : (
              <span className="text-sage-400">Çeviri yok</span>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}

function WordPatternBlock({ wordId, large }: { wordId: string; large?: boolean }) {
  const [open, setOpen] = useState(false);
  const entry = useMemo(() => getWordPatterns(wordId), [wordId]);
  if (!entry || entry.patterns.length === 0) return null;

  return (
    <div className="mt-4 w-full text-left">
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-xl border border-goethe-blue/20 bg-goethe-blue/5 px-3 py-2 text-left text-sm font-semibold text-goethe-blue"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <span>Kalıp cümleler ({entry.patterns.length})</span>
        <span className="text-xs text-sage-500">{open ? "Gizle" : "Göster"}</span>
      </button>
      {open ? (
        <ul className="mt-2 space-y-2">
          {entry.patterns.map((p) => (
            <li
              key={p.patternId}
              className="rounded-xl border border-sage-100 bg-white p-3"
            >
              <p className="text-[10px] font-bold uppercase tracking-wide text-sage-400">
                {PATTERN_LABEL_TR[p.patternId as VocabPatternId] ?? p.patternId}
              </p>
              <p
                className={`mt-1 font-medium text-sage-800 ${
                  large ? "text-base" : "text-sm"
                }`}
              >
                {p.de}
              </p>
              <p className={`mt-0.5 text-goethe-blue ${large ? "text-sm" : "text-xs"}`}>
                {p.tr}
              </p>
              <div className="mt-2">
                <AudioButton text={p.de} label="Dinle" size="sm" />
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function WordCard({
  word,
  flipped = false,
  onFlip,
  showActions,
  onKnow,
  onDontKnow,
  readOnly = false,
  size = "default",
  dontKnowLabel = "Bilmiyorum",
  knowLabel = "Biliyorum",
  showActionHints = false,
  showHearAndWrite = false,
}: WordCardProps) {
  const display = formatWord(word.word, word.article);
  const meanings = splitMeanings(word.translation_tr);
  const examples = splitExamples(word.example_de, word.example_tr);
  const critical = isCriticalWord(word);
  const kind = getWordKindLabel(word);
  const large = size === "large";
  const primaryExample = examples[0];

  return (
    <div className="card-soft mx-auto w-full max-w-lg overflow-hidden">
      <div
        className={`flex cursor-pointer flex-col items-center justify-center text-center transition ${
          large ? "min-h-[280px] p-6 sm:p-10" : "min-h-[240px] p-6 sm:p-8"
        }`}
        onClick={onFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onFlip?.()}
      >
        <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-block rounded-full bg-sage-100 px-3 py-1 text-xs font-medium text-sage-500">
            {word.category}
          </span>
          {flipped && (
            <>
              <span className="rounded-full bg-goethe-blue/10 px-2.5 py-1 text-[10px] font-semibold uppercase text-goethe-blue">
                A1 {word.level}
              </span>
              <span className="rounded-full bg-sage-100 px-2.5 py-1 text-[10px] font-medium text-sage-500">
                {kind}
              </span>
              {critical && (
                <span className="inline-flex items-center gap-1 rounded-full bg-goethe-gold/20 px-2.5 py-1 text-[10px] font-semibold text-goethe-blue">
                  <IconStar size={12} />
                  Çok sık
                </span>
              )}
            </>
          )}
        </div>

        {!flipped ? (
          <>
            <p
              className={`mb-1 break-words font-bold leading-tight text-goethe-blue ${
                large ? "text-5xl sm:text-6xl md:text-7xl" : "text-4xl sm:text-5xl"
              }`}
            >
              {display}
            </p>
            <div
              className="word-cue-line mx-auto h-1 w-28 max-w-[70%] rounded-full bg-gradient-to-r from-goethe-gold/20 via-goethe-gold to-goethe-gold/20"
              aria-hidden
            />
            <div className="mt-4 w-full max-w-md">
              <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-sage-400">
                Anlam
              </p>
              <ul className="space-y-1">
                {meanings.map((m) => (
                  <li
                    key={m}
                    className={`font-semibold text-sage-700 ${
                      large ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
                    }`}
                  >
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            {word.plural && (
              <p className={`mt-3 text-sage-400 ${large ? "text-lg" : "text-base"}`}>
                Plural: {word.plural}
              </p>
            )}
            <p className={`mt-4 text-sage-400 ${large ? "text-base" : "text-sm"}`}>
              Kartı çevir · <strong className="text-sage-500">Sonraki kelime</strong>
            </p>
          </>
        ) : (
          <>
            <p
              className={`mb-4 break-words font-semibold text-goethe-blue/80 ${
                large ? "text-2xl sm:text-3xl md:text-4xl" : "text-2xl sm:text-3xl"
              }`}
            >
              {display}
            </p>

            <div className="mb-4 w-full text-left">
              <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-sage-400">Anlam</p>
              <ul className="space-y-1">
                {meanings.map((m) => (
                  <li
                    key={m}
                    className={`font-medium text-sage-700 ${
                      large ? "text-2xl sm:text-3xl md:text-4xl" : "text-xl sm:text-2xl"
                    }`}
                  >
                    {m}
                  </li>
                ))}
              </ul>
              {word.translation_ru && (
                <p className={`mt-2 text-sage-400 ${large ? "text-lg" : "text-base"}`}>
                  {word.translation_ru}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="border-t border-sage-100 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
          <AudioButton text={display} audioSrc={word.audio_word} />
          <AudioButton text={word.example_de} label="Cümle" size="sm" audioSrc={word.audio_example} />
        </div>

        {showHearAndWrite && (
          <HearAndWrite word={word} wordVisible={!flipped} disabled={readOnly} />
        )}

        {primaryExample && (
          <ExampleBlock examples={[primaryExample]} large={large} compact />
        )}

        {flipped ? <WordPatternBlock wordId={word.id} large={large} /> : null}
      </div>

      {readOnly && flipped && (
        <p className="border-t border-sage-100 p-3 text-center text-sm text-sage-500">
          Geçmiş kelime — tekrar oku.
        </p>
      )}

      {showActions && !readOnly && (
        <div className="border-t border-sage-100 p-4">
          {showActionHints && (
            <p className="mb-3 text-center text-sm text-sage-500">
              Kartı çevirdikten sonra: biliyorsan ilerle, bilmiyorsan yarın tekrar sorulur.
            </p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" className="btn-secondary-lg flex flex-1 flex-col gap-0.5 py-3" onClick={onDontKnow}>
              <span>{dontKnowLabel}</span>
              {showActionHints && (
                <span className="text-[10px] font-normal text-sage-400">Yarın tekrar · 1 gün</span>
              )}
            </button>
            <button type="button" className="btn-primary-lg flex flex-1 flex-col gap-0.5 py-3" onClick={onKnow}>
              <span>{knowLabel}</span>
              {showActionHints && (
                <span className="text-[10px] font-normal text-white/80">Ezber · daha seyrek sor</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

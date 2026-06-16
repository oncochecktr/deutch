"use client";

import type { ReactNode } from "react";
import { AudioButton } from "@/components/AudioButton";
import type { A1CoreData } from "@/lib/grundlagen";

function Block({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="card-soft p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase text-goethe-blue">{title}</h2>
      {children}
    </section>
  );
}

function ItemGrid({ items }: { items: { de: string; tr: string }[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.de}
          className="flex items-center justify-between rounded-lg bg-sage-50 px-3 py-2.5 text-sm"
        >
          <span className="font-semibold text-goethe-blue">{item.de}</span>
          <span className="text-sage-600">{item.tr}</span>
        </div>
      ))}
    </div>
  );
}

export function GrammarView({ grammar, fragewoerter }: Pick<A1CoreData, "grammar" | "fragewoerter">) {
  return (
    <div className="space-y-6">
      <Block title={`${fragewoerter.title} · ${fragewoerter.titleTr}`}>
        <ItemGrid items={fragewoerter.items} />
      </Block>

      <Block title={grammar.pronouns.title}>
        <ItemGrid items={grammar.pronouns.items} />
      </Block>

      <Block title={grammar.sein.title}>
        <ItemGrid items={grammar.sein.conjugation} />
        <ul className="mt-4 space-y-2 border-t border-sage-100 pt-4">
          {grammar.sein.examples.map((ex) => (
            <li key={ex.de} className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-goethe-blue">{ex.de}</span>
              <span className="text-sage-500">— {ex.tr}</span>
              <AudioButton text={ex.de} size="sm" />
            </li>
          ))}
        </ul>
      </Block>

      <Block title={grammar.haben.title}>
        <ItemGrid items={grammar.haben.conjugation} />
        <ul className="mt-4 space-y-2 border-t border-sage-100 pt-4">
          {grammar.haben.examples.map((ex) => (
            <li key={ex.de} className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-goethe-blue">{ex.de}</span>
              <span className="text-sage-500">— {ex.tr}</span>
              <AudioButton text={ex.de} size="sm" />
            </li>
          ))}
        </ul>
      </Block>

      {grammar.verbs.map((v) => (
        <Block key={v.infinitive} title={`${v.infinitive} (${v.tr})`}>
          <ItemGrid items={v.forms} />
        </Block>
      ))}

      {grammar.modals.map((m) => (
        <Block key={m.verb} title={`${m.verb} — ${m.tr}`}>
          <ul className="space-y-2">
            {m.examples.map((ex) => (
              <li key={ex.de} className="rounded-lg bg-sage-50 p-3 text-sm">
                <p className="font-medium text-goethe-blue">{ex.de}</p>
                <p className="mt-1 text-sage-600">{ex.tr}</p>
              </li>
            ))}
          </ul>
        </Block>
      ))}

      <Block title={grammar.patterns.title}>
        <ul className="space-y-3">
          {grammar.patterns.items.map((p) => (
            <li key={p.de} className="rounded-xl border border-sage-100 p-4">
              <p className="text-lg font-bold text-goethe-blue">{p.de}</p>
              <p className="text-sm text-sage-500">{p.tr}</p>
              {p.example_de && (
                <p className="mt-2 text-sm italic text-sage-700">{p.example_de}</p>
              )}
              {p.example_tr && (
                <p className="mt-1 text-base font-medium text-goethe-blue">{p.example_tr}</p>
              )}
            </li>
          ))}
        </ul>
      </Block>

      <Block title={`${grammar.jaNein.title} · ${grammar.jaNein.titleTr ?? ""}`}>
        <ItemGrid items={grammar.jaNein.items} />
        <ul className="mt-4 space-y-2 border-t border-sage-100 pt-4">
          {grammar.jaNein.examples.map((ex) => (
            <li key={ex.de} className="rounded-lg bg-sage-50 p-3 text-sm">
              <p className="font-medium text-goethe-blue">{ex.de}</p>
              <p className="text-sage-500">{ex.tr}</p>
              {ex.example_de && (
                <p className="mt-2 italic text-sage-700">{ex.example_de}</p>
              )}
              {ex.example_tr && <p className="mt-1 text-goethe-blue">{ex.example_tr}</p>}
              {ex.example_de && <AudioButton text={ex.example_de} size="sm" />}
            </li>
          ))}
        </ul>
      </Block>

      <Block title={`${grammar.akkusativ.title} · ${grammar.akkusativ.titleTr ?? ""}`}>
        <ItemGrid items={grammar.akkusativ.items} />
        <ul className="mt-4 space-y-2 border-t border-sage-100 pt-4">
          {grammar.akkusativ.examples.map((ex) => (
            <li key={ex.de} className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-goethe-blue">{ex.de}</span>
              <span className="text-sage-500">— {ex.tr}</span>
              <AudioButton text={ex.de} size="sm" />
            </li>
          ))}
        </ul>
      </Block>

      <Block title={`${grammar.trennbareVerben.title} · ${grammar.trennbareVerben.titleTr}`}>
        <ul className="space-y-3">
          {grammar.trennbareVerben.verbs.map((v) => (
            <li key={v.infinitive} className="rounded-xl border border-sage-100 p-4">
              <p className="font-bold text-goethe-blue">
                {v.infinitive}{" "}
                <span className="text-sm font-normal text-goethe-gold">({v.prefix} …)</span>
              </p>
              <p className="text-sm text-sage-500">{v.tr}</p>
              <p className="mt-2 text-sm italic text-sage-700">{v.example_de}</p>
              <p className="mt-1 text-sm text-goethe-blue">{v.example_tr}</p>
              <div className="mt-2">
                <AudioButton text={v.example_de} size="sm" />
              </div>
            </li>
          ))}
        </ul>
      </Block>
    </div>
  );
}

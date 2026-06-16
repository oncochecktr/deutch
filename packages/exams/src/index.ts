export type * from "./types";

import type {
  GoetheExam,
  HoerenQuestion,
  HoerenExamItem,
  HoerenTrueFalse,
  LesenPassage,
  LesenExamItem,
  LesenTrueFalse,
  LesenMatching,
  SchreibenTask,
  SprechenCard,
  GoetheQuestionBank,
} from "./types";

import bankMeta from "../../../data/goethe/a1/bank.json";
import hoerenData from "../../../data/goethe/a1/hoeren.json";
import hoerenRealData from "../../../data/goethe/a1/hoeren-real.json";
import lesenData from "../../../data/goethe/a1/lesen.json";
import lesenRealData from "../../../data/goethe/a1/lesen-real.json";
import schreibenData from "../../../data/goethe/a1/schreiben.json";
import sprechenData from "../../../data/goethe/a1/sprechen.json";
import examsData from "../../../data/goethe/a1/exams.json";

export function getBankMeta(): GoetheQuestionBank {
  return bankMeta as GoetheQuestionBank;
}

export function getHoerenQuestions(): HoerenQuestion[] {
  return hoerenData as HoerenQuestion[];
}

export function getHoerenRealItems(): HoerenTrueFalse[] {
  return hoerenRealData as HoerenTrueFalse[];
}

export function getHoerenById(id: string): HoerenQuestion | undefined {
  return getHoerenQuestions().find((q) => q.id === id);
}

export function getHoerenRealById(id: string): HoerenTrueFalse | undefined {
  return getHoerenRealItems().find((q) => q.id === id);
}

export function resolveHoerenItem(id: string): HoerenExamItem | undefined {
  if (id.startsWith("hrf_")) return getHoerenRealById(id);
  const q = getHoerenById(id);
  return q ? { ...q, format: "mcq" as const } : undefined;
}

export function getLesenPassages(): LesenPassage[] {
  return lesenData as LesenPassage[];
}

export function getLesenTrueFalseItems(): LesenTrueFalse[] {
  return (lesenRealData as { rf: LesenTrueFalse[] }).rf;
}

export function getLesenMatchingItems(): LesenMatching[] {
  return (lesenRealData as { matching: LesenMatching[] }).matching;
}

export function getLesenPassageById(id: string) {
  return getLesenPassages().find((p) => p.id === id);
}

export function getLesenRfById(id: string) {
  return getLesenTrueFalseItems().find((q) => q.id === id);
}

export function getLesenMatchById(id: string) {
  return getLesenMatchingItems().find((q) => q.id === id);
}

export function getLesenQuestionCount(): number {
  return getLesenPassages().reduce((n, p) => n + p.questions.length, 0);
}

export function getSchreibenTasks(): SchreibenTask[] {
  return schreibenData as SchreibenTask[];
}

export function getSprechenCards(): SprechenCard[] {
  return sprechenData as SprechenCard[];
}

export function getGoetheExams(): GoetheExam[] {
  return examsData as GoetheExam[];
}

export function getSchreibenById(id: string) {
  return getSchreibenTasks().find((t) => t.id === id);
}

export function getSprechenById(id: string) {
  return getSprechenCards().find((c) => c.id === id);
}

export function getExamById(id: string) {
  return getGoetheExams().find((e) => e.id === id);
}

export function pickSession<T>(items: T[], count: number, seed = 0): T[] {
  const shuffled = [...items].sort((a, b) => {
    const ha = JSON.stringify(a).length + seed;
    const hb = JSON.stringify(b).length + seed;
    return (ha % 97) - (hb % 97);
  });
  return shuffled.slice(0, Math.min(count, items.length));
}

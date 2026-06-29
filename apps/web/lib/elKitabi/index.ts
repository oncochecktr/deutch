import { EL_KITABI_APPENDICES } from "./appendices";
import { CH01 } from "./chapters/ch01";
import { CH02 } from "./chapters/ch02";
import { CH03 } from "./chapters/ch03";
import { CH04 } from "./chapters/ch04";
import { CH05 } from "./chapters/ch05";
import { CH06 } from "./chapters/ch06";
import { CH07 } from "./chapters/ch07";
import { CH08 } from "./chapters/ch08";
import { CH09 } from "./chapters/ch09";
import { CH10 } from "./chapters/ch10";
import { CH11 } from "./chapters/ch11";
import { EL_KITABI_INTRO } from "./intro";
import { EL_KITABI_ROADMAP } from "./roadmap";
import type { ElKitabiContent, TocEntry } from "./types";

export const EL_KITABI_CHAPTERS = [
  CH01,
  CH02,
  CH03,
  CH04,
  CH05,
  CH06,
  CH07,
  CH08,
  CH09,
  CH10,
  CH11,
];

export const EL_KITABI: ElKitabiContent = {
  intro: EL_KITABI_INTRO,
  roadmap: EL_KITABI_ROADMAP,
  chapters: EL_KITABI_CHAPTERS,
  appendices: EL_KITABI_APPENDICES,
};

export const EL_KITABI_TOC: TocEntry[] = [
  { id: "kullanim", label: "Kullanim kilavuzu" },
  { id: "yol-haritasi", label: "A1 → B1 yol haritasi" },
  ...EL_KITABI_CHAPTERS.map((ch) => ({
    id: ch.id,
    label: `${ch.number}. ${ch.title}`,
    children: ch.subsections.map((sub) => ({
      id: sub.id,
      label: sub.title,
    })),
  })),
  {
    id: "ekler",
    label: "Ekler",
    children: EL_KITABI_APPENDICES.map((a) => ({
      id: a.id,
      label: a.title.replace(/^Ek [A-E] — /, ""),
    })),
  },
];

export function collectElKitabiHrefs(): string[] {
  const hrefs = new Set<string>();
  for (const ch of EL_KITABI_CHAPTERS) {
    if (ch.practiceHref) hrefs.add(ch.practiceHref);
    for (const sub of ch.subsections) {
      for (const block of sub.blocks) {
        if (block.type === "link") hrefs.add(block.href);
      }
    }
  }
  for (const app of EL_KITABI_APPENDICES) {
    for (const block of app.blocks) {
      if (block.type === "link") hrefs.add(block.href);
    }
  }
  for (const level of EL_KITABI_ROADMAP.levels) {
    for (const row of level.rows) {
      if (row.href) hrefs.add(row.href);
    }
  }
  return [...hrefs];
}

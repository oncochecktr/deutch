import type { ScriptStepDef } from "./types";
import { A1_L01_STEPS } from "./lessons/a1_l01";
import { A1_L02_STEPS } from "./lessons/a1_l02";
import { A1_L03_STEPS } from "./lessons/a1_l03";
import { A1_L04_STEPS } from "./lessons/a1_l04";
import { A1_L05_STEPS } from "./lessons/a1_l05";
import { A1_L06_STEPS } from "./lessons/a1_l06";
import { A2_L01_STEPS } from "./lessons/a2_l01";
import {
  A2_L02_STEPS,
  A2_L03_STEPS,
  A2_L04_STEPS,
  A2_L05_STEPS,
  A2_L06_STEPS,
  A2_L07_STEPS,
  A2_L08_STEPS,
  A2_L09_STEPS,
  A2_L10_STEPS,
  A2_L11_STEPS,
  A2_L12_STEPS,
} from "./lessons/a2_batch";

export const SCRIPT_LESSON_REGISTRY: Record<string, ScriptStepDef[]> = {
  a1_l01: A1_L01_STEPS,
  a1_l02: A1_L02_STEPS,
  a1_l03: A1_L03_STEPS,
  a1_l04: A1_L04_STEPS,
  a1_l05: A1_L05_STEPS,
  a1_l06: A1_L06_STEPS,
  a2_l01: A2_L01_STEPS,
  a2_l02: A2_L02_STEPS,
  a2_l03: A2_L03_STEPS,
  a2_l04: A2_L04_STEPS,
  a2_l05: A2_L05_STEPS,
  a2_l06: A2_L06_STEPS,
  a2_l07: A2_L07_STEPS,
  a2_l08: A2_L08_STEPS,
  a2_l09: A2_L09_STEPS,
  a2_l10: A2_L10_STEPS,
  a2_l11: A2_L11_STEPS,
  a2_l12: A2_L12_STEPS,
};

export const SCRIPT_LESSON_IDS = Object.keys(SCRIPT_LESSON_REGISTRY);

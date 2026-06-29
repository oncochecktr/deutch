import { CARDS_SETTINGS_KEY } from "./cardsSettings";
import { DIKTAT_BACKUP_KEY, DIKTAT_STORAGE_KEY } from "./diktatStorage";
import { DIALOGUE_STORAGE_KEY } from "./dialogueStorage";
import { KONUS_DINLE_STORAGE_KEY } from "./konusDinleStorage";
import {
  LEARNER_PROFILE_BACKUP_KEY,
  LEARNER_PROFILE_KEY,
} from "./learnerProfileStorage";
import { clearStoredProgress } from "./progress";
import { SPEAK_STORAGE_KEY } from "./speakStorage";

const COACH_MILESTONES_KEY = "german-coach-milestones";
const DAS_IST_KEY = "german-coach-das-ist";
const DAS_IST_MEIN_KEY = "german-coach-das-ist-mein";
const SENTENCE_ENGINE_KEY = "german-coach-sentence-engine";
const WO_IST_LEGO_KEY = "german-coach-wo-ist-lego";
const WELCOME_KEY = "german-coach-welcome-v2";
const MEKTUP_DONE_KEY = "german-coach-mektup-done";
const SPEAK_FOCUS_KEY = "german-coach-speak-focus";
const SMART_TIP_PREFIX = "german-coach-smart-tip-";
const EXAM_SESSION_PREFIX = "german-coach-exam-session:";

/** API anahtarı ve ses tercihi hariç — tam çalışma profili sıfırlama */
const STUDY_LOCAL_KEYS = [
  CARDS_SETTINGS_KEY,
  COACH_MILESTONES_KEY,
  DAS_IST_KEY,
  DAS_IST_MEIN_KEY,
  DIALOGUE_STORAGE_KEY,
  DIKTAT_STORAGE_KEY,
  KONUS_DINLE_STORAGE_KEY,
  LEARNER_PROFILE_KEY,
  MEKTUP_DONE_KEY,
  SENTENCE_ENGINE_KEY,
  SPEAK_FOCUS_KEY,
  SPEAK_STORAGE_KEY,
  WELCOME_KEY,
  WO_IST_LEGO_KEY,
] as const;

const STUDY_SESSION_KEYS = [DIKTAT_BACKUP_KEY, LEARNER_PROFILE_BACKUP_KEY] as const;

function removeLocal(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function removeSession(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function removePrefixedLocal(prefix: string): void {
  if (typeof window === "undefined") return;
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(prefix)) keys.push(key);
  }
  for (const key of keys) removeLocal(key);
}

/** Kullanıcı onayı — clearAllStudyStorage ile uyumlu */
export const STUDY_RESET_CONFIRM_MSG =
  "Tüm öğrenme verisi bu tarayıcıdan silinsin mi?\n\n" +
  "Silinir:\n" +
  "• Kelime, SRS, quiz ve kart geçmişi\n" +
  "• Goethe (Hören, Lesen, Schreiben, Sprechen) ve deneme sınavları\n" +
  "• Grundlagen, El Kitabı ve gramer paketi ilerlemesi\n" +
  "• Kart ayarları, Speak, Konuş-Dinle, diktat, diyaloglar\n" +
  "• Öğrenci profili ve cümle motoru kayıtları\n" +
  "• Bugünkü sayaçlar ve hedef sınav tarihi\n\n" +
  "Korunur: AI API anahtarı ve ses tercihleri.\n\n" +
  "Bu işlem geri alınamaz.";

/** Tarayıcıdaki tüm öğrenme verisini siler (API anahtarı ve professor ses tercihi kalır). */
export function clearAllStudyStorage(): void {
  if (typeof window === "undefined") return;

  clearStoredProgress();

  for (const key of STUDY_LOCAL_KEYS) removeLocal(key);
  for (const key of STUDY_SESSION_KEYS) removeSession(key);

  removePrefixedLocal(SMART_TIP_PREFIX);
  removePrefixedLocal(EXAM_SESSION_PREFIX);
}

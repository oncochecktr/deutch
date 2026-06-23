/** Profesör (Sınıf) modülü — kullanıcıya gösterilen hata ve yönlendirme metinleri */

export const PROFESSOR_MISSING_API_KEY =
  "Profesörünüzle eğitime devam etmek için API anahtarı eklemeniz gerekir. Ayarlar sayfasından tercih ettiğiniz sağlayıcı için anahtar oluşturup kaydedin.";

export const PROFESSOR_INVALID_API_KEY =
  "API anahtarınız geçersiz veya süresi dolmuş. Ayarlar sayfasından anahtarı kontrol edin.";

export const PROFESSOR_CONNECTION_ERROR =
  "Profesöre bağlanılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.";

export const PROFESSOR_RATE_LIMIT =
  "Çok fazla istek gönderildi. Birkaç saniye bekleyip tekrar deneyin.";

export const PROFESSOR_QUOTA_EXCEEDED =
  "API kotanız veya bakiyeniz yetersiz. Sağlayıcı hesabınızdan limit ve fatura bilgilerinizi kontrol edin.";

export const PROFESSOR_RESPONSE_ERROR =
  "Profesör yanıt veremedi. Lütfen tekrar deneyin.";

export const PROFESSOR_UNAVAILABLE =
  "Profesör şu an kullanılamıyor. Lütfen biraz sonra tekrar deneyin.";

export const PROFESSOR_TIMEOUT =
  "Profesör yanıtı çok uzun sürdü. Lütfen tekrar deneyin.";

const TECHNICAL_PATTERN =
  /DEEPSEEK|GEMINI|ANTHROPIC|CLAUDE|stop\.bat|\.env|GEMINI_MODEL|DEEPSEEK_|API_KEY yapılandır|LLM anahtarı/i;

export function sanitizeProfessorErrorForUser(raw: string | null | undefined): string {
  if (!raw?.trim()) return PROFESSOR_UNAVAILABLE;
  const m = raw.trim();

  if (
    /DEEPSEEK_API_KEY|GEMINI_API_KEY|ANTHROPIC_API_KEY|yapılandırılmamış|LLM anahtarı yok/i.test(m) ||
    /api anahtarı için sağlayıcı/i.test(m)
  ) {
    return PROFESSOR_MISSING_API_KEY;
  }
  if (/geçersiz|invalid.*key|unauthorized|api key not valid|yetkisiz/i.test(m) && /api|anahtar|key/i.test(m)) {
    return PROFESSOR_INVALID_API_KEY;
  }
  if (/rate limit|rpm|dakikalık istek/i.test(m)) {
    return PROFESSOR_RATE_LIMIT;
  }
  if (/kota|quota|bakiye|billing|credit balance/i.test(m)) {
    return PROFESSOR_QUOTA_EXCEEDED;
  }
  if (/bağlanılamadı|network|timeout|zaman aşımı|fetch failed|çok uzun sürdü/i.test(m)) {
    if (/çok uzun sürdü/i.test(m)) return PROFESSOR_TIMEOUT;
    return PROFESSOR_CONNECTION_ERROR;
  }
  if (/model yanıt|işlenemedi|yanıt vermedi/i.test(m)) {
    return PROFESSOR_RESPONSE_ERROR;
  }
  if (TECHNICAL_PATTERN.test(m)) {
    return PROFESSOR_UNAVAILABLE;
  }
  return m;
}

export function isProfessorMissingApiKeyError(raw: string | null | undefined): boolean {
  if (!raw) return false;
  return sanitizeProfessorErrorForUser(raw) === PROFESSOR_MISSING_API_KEY;
}

export function isProfessorQuotaError(raw: string | null | undefined): boolean {
  if (!raw) return false;
  return sanitizeProfessorErrorForUser(raw) === PROFESSOR_QUOTA_EXCEEDED;
}

export function isProfessorRateLimitError(raw: string | null | undefined): boolean {
  if (!raw) return false;
  return sanitizeProfessorErrorForUser(raw) === PROFESSOR_RATE_LIMIT;
}

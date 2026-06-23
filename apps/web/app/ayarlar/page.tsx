"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { StorageWarningBanner } from "@/components/StorageWarningBanner";
import type { ChatProviderId } from "@/lib/chat/types";
import {
  PROVIDER_MODE_LABELS,
  clearUserApiCredentials,
  inferProviderFromApiKey,
  loadUserApiCredentials,
  maskApiKey,
  saveUserApiCredentials,
} from "@/lib/userApiKeys";
import { getStorageWarningText } from "@/lib/browserStorage";

export default function AyarlarPage() {
  const [provider, setProvider] = useState<ChatProviderId>("deepseek");
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState<ReturnType<typeof loadUserApiCredentials>>(null);
  const [testStatus, setTestStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [testMessage, setTestMessage] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const creds = loadUserApiCredentials();
    setSaved(creds);
    if (creds) {
      setProvider(creds.provider);
      setApiKey(creds.apiKey);
    }
  }, []);

  const resolveProvider = (key: string): ChatProviderId =>
    showAdvanced ? provider : inferProviderFromApiKey(key);

  const handleSave = () => {
    if (!apiKey.trim()) return;
    const resolved = resolveProvider(apiKey);
    saveUserApiCredentials(resolved, apiKey);
    setProvider(resolved);
    setSaved(loadUserApiCredentials());
    setTestStatus("idle");
    setTestMessage("");
  };

  const handleClear = () => {
    clearUserApiCredentials();
    setSaved(null);
    setApiKey("");
    setTestStatus("idle");
    setTestMessage("");
  };

  const handleTest = async () => {
    if (!apiKey.trim()) return;
    const resolved = resolveProvider(apiKey);
    setTestStatus("loading");
    setTestMessage("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Hallo",
          level: "A1",
          history: [],
          userApiKey: apiKey.trim(),
          userProvider: resolved,
        }),
        signal: AbortSignal.timeout(60_000),
      });
      const data = (await res.json()) as { error?: string; reply?: string };
      if (!res.ok) {
        setTestStatus("error");
        setTestMessage(data.error ?? "Test başarısız.");
        return;
      }
      setTestStatus("ok");
      setTestMessage("Bağlantı başarılı — Profesör modülü kullanılabilir.");
    } catch {
      setTestStatus("error");
      setTestMessage("Ağ hatası — tekrar deneyin.");
    }
  };

  return (
    <PageShell
      title="AI API Ayarları"
      subtitle="Profesör (Sınıf) modülü için kişisel anahtarınız"
      backHref="/"
      maxWidth="md"
    >
      <StorageWarningBanner className="mb-4" />

      <section className="card-soft space-y-4 p-5">
        <h2 className="text-sm font-bold uppercase text-goethe-blue">Neden AI API anahtarı?</h2>
        <p className="text-sm leading-relaxed text-sage-600">
          Sınıf modülündeki Profesör, gelişmiş geri bildirim için bir AI API anahtarı kullanır.
          Ücretsiz veya düşük maliyetli anahtar oluşturup buraya ekleyebilirsiniz. Anahtar yalnızca
          bu tarayıcıda saklanır; sunucuya kaydedilmez.
        </p>
        <p className="text-xs text-sage-500">
          Anahtar olmadan da A1/A2 derslerinin çoğu çalışır —{" "}
          <Link href="/speak" className="font-medium text-goethe-blue underline">
            Sınıf modülüne git
          </Link>
          .
        </p>
        <p className="text-xs text-sage-500">{getStorageWarningText()}</p>
      </section>

      <section className="card-soft mt-4 space-y-4 p-5">
        <h2 className="text-sm font-bold uppercase text-goethe-blue">AI API anahtarı</h2>
        <p className="text-sm text-sage-600">
          Kullandığınız AI servisinin panelinden oluşturduğunuz anahtarı aşağıya yapıştırın.
          Çoğu servis ücretsiz başlangıç kotası sunar.
        </p>

        <label className="block">
          <span className="text-sm font-semibold text-goethe-blue">Anahtar</span>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="API anahtarınızı buraya yapıştırın"
            className="mt-2 w-full rounded-xl border border-sage-200 px-4 py-3 text-sm"
            autoComplete="off"
          />
        </label>

        <details
          className="rounded-xl border border-sage-200 bg-sage-50/80 p-3"
          onToggle={(e) => setShowAdvanced((e.target as HTMLDetailsElement).open)}
        >
          <summary className="cursor-pointer text-xs font-semibold text-sage-600">
            Gelişmiş — anahtar türü (isteğe bağlı)
          </summary>
          <p className="mt-2 text-xs text-sage-500">
            Çoğu kullanıcı için otomatik algılama yeterlidir. Bağlantı hatası alırsanız türü elle
            seçin.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["deepseek", "gemini", "anthropic"] as ChatProviderId[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setProvider(p)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  provider === p
                    ? "bg-goethe-blue text-white"
                    : "bg-white text-sage-600 ring-1 ring-sage-200"
                }`}
              >
                {PROVIDER_MODE_LABELS[p]}
              </button>
            ))}
          </div>
        </details>

        {saved && (
          <p className="text-xs text-sage-500">
            Kayıtlı AI API anahtarı · {maskApiKey(saved.apiKey)}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handleSave} className="btn-primary">
            Kaydet
          </button>
          <button
            type="button"
            onClick={handleTest}
            disabled={!apiKey.trim() || testStatus === "loading"}
            className="btn-secondary"
          >
            {testStatus === "loading" ? "Test ediliyor…" : "Test et"}
          </button>
          {saved && (
            <button type="button" onClick={handleClear} className="btn-secondary text-red-700">
              Sil
            </button>
          )}
        </div>

        {testMessage && (
          <p
            className={`text-sm ${testStatus === "ok" ? "text-green-700" : "text-red-700"}`}
            role="status"
          >
            {testMessage}
          </p>
        )}
      </section>

      <p className="mt-6 text-center text-sm text-sage-500">
        <Link href="/speak" className="font-semibold text-goethe-blue underline">
          Sınıf modülüne git →
        </Link>
      </p>
    </PageShell>
  );
}

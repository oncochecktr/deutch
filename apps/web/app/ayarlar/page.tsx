"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { StorageWarningBanner } from "@/components/StorageWarningBanner";
import type { ChatProviderId } from "@/lib/chat/types";
import {
  PROVIDER_KEY_URLS,
  PROVIDER_LABELS,
  clearUserApiCredentials,
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

  useEffect(() => {
    const creds = loadUserApiCredentials();
    setSaved(creds);
    if (creds) {
      setProvider(creds.provider);
      setApiKey(creds.apiKey);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) return;
    saveUserApiCredentials(provider, apiKey);
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
          userProvider: provider,
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
      title="API Ayarları"
      subtitle="Profesör (Sınıf) modülü için kendi anahtarınız"
      backHref="/"
      maxWidth="md"
    >
      <StorageWarningBanner className="mb-4" />

      <section className="card-soft space-y-4 p-5">
        <h2 className="text-sm font-bold uppercase text-goethe-blue">Neden kendi anahtarınız?</h2>
        <p className="text-sm leading-relaxed text-sage-600">
          Sınıf modülündeki AI profesör DeepSeek, Gemini veya Claude API kullanır. Kendi
          anahtarınızı girerek ücretsiz veya düşük maliyetli planlarla çalışabilirsiniz.
          Anahtar yalnızca bu tarayıcıda saklanır; sunucuya loglanmaz.
        </p>
        <p className="text-xs text-sage-500">{getStorageWarningText()}</p>
      </section>

      <section className="card-soft mt-4 space-y-4 p-5">
        <h2 className="text-sm font-bold uppercase text-goethe-blue">Sağlayıcı</h2>
        <div className="flex flex-wrap gap-2">
          {(["deepseek", "gemini", "anthropic"] as ChatProviderId[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setProvider(p)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                provider === p
                  ? "bg-goethe-blue text-white"
                  : "bg-sage-100 text-sage-600"
              }`}
            >
              {PROVIDER_LABELS[p]}
            </button>
          ))}
        </div>
        <p className="text-xs text-sage-500">
          Anahtar al:{" "}
          <a
            href={PROVIDER_KEY_URLS[provider]}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-goethe-blue underline"
          >
            {PROVIDER_KEY_URLS[provider]}
          </a>
        </p>

        <label className="block">
          <span className="text-sm font-semibold text-goethe-blue">API anahtarı</span>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-…"
            className="mt-2 w-full rounded-xl border border-sage-200 px-4 py-3 text-sm"
            autoComplete="off"
          />
        </label>

        {saved && (
          <p className="text-xs text-sage-500">
            Kayıtlı: {PROVIDER_LABELS[saved.provider]} · {maskApiKey(saved.apiKey)}
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

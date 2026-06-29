"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { clearStoredProgress } from "@/lib/progress";
interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("German Coach render error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-lg space-y-4 p-6">
          <div className="card-soft p-6 text-center">
            <h1 className="text-lg font-bold text-goethe-blue">Uygulama yüklenemedi</h1>
            <p className="mt-2 text-sm text-sage-500">
              Beyaz ekran genelde bozuk önbellek veya eski kayıtlı veriden kaynaklanır.
            </p>
            <p className="mt-3 rounded-lg bg-red-50 p-3 text-left text-xs text-red-800">
              {this.state.error.message}
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                className="btn-primary-lg w-full"
                onClick={() => this.setState({ error: null })}
              >
                Tekrar dene
              </button>
              <button
                type="button"
                className="btn-secondary-lg w-full"
                onClick={() => {
                  clearStoredProgress();
                  window.location.href = "/";
                }}
              >
                Kayıtlı ilerlemeyi sıfırla
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

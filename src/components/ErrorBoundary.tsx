import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'حدث خطأ غير متوقع في النظام.',
    };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('Vault ErrorBoundary caught:', error, info);
  }

  override render() {
    if (this.state.hasError) {
      let readableError = this.state.errorMessage;
      try {
        const parsed = JSON.parse(this.state.errorMessage);
        if (parsed && typeof parsed.error === 'string') {
          readableError = `تعذّر إتمام العملية (${parsed.operationType || 'read'}): ${parsed.error}`;
        }
      } catch {
        // Not a JSON error string
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
          <div className="max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 space-y-5">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h1 className="text-lg font-semibold">حدث خلل تقني في الخزنة</h1>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed break-words">
              {readableError}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة تحميل الصفحة</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

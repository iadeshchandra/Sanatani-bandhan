import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Dharmic ERP Error:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.removeItem('sanatani_active_workspace_id');
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 text-center shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-stone-100">Application State Recovered</h2>
            <p className="text-xs text-stone-400 leading-relaxed">
              A temporary runtime condition occurred. Click below to safely reboot the workspace into a fresh, stable state.
            </p>
            {this.state.error && (
              <div className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-800 text-[11px] font-mono text-rose-300 text-left overflow-x-auto max-h-28">
                {this.state.error.message}
              </div>
            )}
            <button
              type="button"
              onClick={this.handleReset}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reboot Workspace & Restore</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

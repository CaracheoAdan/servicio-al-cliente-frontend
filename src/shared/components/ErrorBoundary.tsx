import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMsg: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMsg: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMsg: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-card-base border border-red-200 p-8 text-center animate-fade-in-up">
          <AlertOctagon className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Algo salió mal</h2>
          <p className="text-slate-500 text-sm max-w-md">
            Ocurrió un error inesperado al renderizar este componente. Por favor, recarga la página o contacta a soporte si el problema persiste.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, errorMsg: '' })}
            className="mt-4 px-6 py-2.5 bg-[#2A5D8F] text-white rounded-xl font-bold text-sm hover:bg-[#1E4D73] transition-colors shadow-[0_3px_0_#1B3D5C] active:shadow-[0_0px_0_#1B3D5C] active:translate-y-0.5"
          >
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Admin Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8 bg-[#050505] rounded-[2.5rem] border border-white/5 mt-8">
          <div className="text-center space-y-6 max-w-md">
            <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-white italic">Something went wrong</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              An unexpected error occurred while rendering this part of the dashboard. 
              Details: <span className="text-red-400 font-mono text-[10px]">{this.state.error?.message}</span>
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all mx-auto font-black text-xs uppercase tracking-widest"
            >
              <RefreshCcw size={16} /> Reload Interface
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AdminErrorBoundary;

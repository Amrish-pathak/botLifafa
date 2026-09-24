import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, debugMessage: "", debugStack: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, debugMessage: error?.message || String(error) };
  }

  componentDidCatch(error, info) {
    console.error("Chunk load / render error:", error, info);
    this.setState({
      debugMessage: error?.message || String(error),
      debugStack: info?.componentStack || "",
    });
  }

  handleRetry = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col items-center justify-center gap-4 px-6 text-center overflow-y-auto py-10">
          <p className="text-lg font-semibold">Error aayi</p>

          {/* ⚠️ TEMPORARY DEBUG — baad me hata dena */}
          <div className="w-full max-w-sm bg-red-950/40 border border-red-500/40 rounded-xl p-4 text-left">
            <p className="text-red-400 text-xs font-mono break-words whitespace-pre-wrap">
              {this.state.debugMessage}
            </p>
            {this.state.debugStack && (
              <p className="text-red-300/60 text-[10px] font-mono break-words whitespace-pre-wrap mt-2">
                {this.state.debugStack}
              </p>
            )}
          </div>

          <button
            onClick={this.handleRetry}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

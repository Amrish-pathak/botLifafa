import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Chunk load / render error:", error);

    const isChunkError =
      /dynamically imported module|Failed to fetch|Loading chunk/i.test(
        error?.message || ""
      );

    // ⚡ Agar yeh chunk-load error hai (purana cached index.html ki wajah se)
    // toh sirf EK baar silently reload karo — user ko button dikhane se pehle
    const alreadyRetried = sessionStorage.getItem("chunk-reload-attempted");

    if (isChunkError && !alreadyRetried) {
      sessionStorage.setItem("chunk-reload-attempted", "1");
      window.location.reload();
    }
  }

  handleRetry = () => {
    sessionStorage.removeItem("chunk-reload-attempted");
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-lg font-semibold">Connection slow ho gayi</p>
          <p className="text-sm text-gray-400">
            Page load karne me problem aayi. Dobara try karo.
          </p>
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

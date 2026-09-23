export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2018",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          telegram: ["@twa-dev/sdk"],
        },
      },
    },
  },
});

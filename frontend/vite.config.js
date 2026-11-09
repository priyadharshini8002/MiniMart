import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite is the tool that runs our React app during development.
// The proxy sends every request starting with /api to the backend (port 5000),
// so the frontend can simply call "/api/products".
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});

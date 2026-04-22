import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  if (!env.VITE_API_BASE) {
    throw new Error("Missing required env VITE_API_BASE");
  }

  return {
    plugins: [vue()],
    server: {
      host: "0.0.0.0",
      port: 5173,
    },
  };
});

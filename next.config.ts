import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite uma build paralela (testes) sem pisar no servidor de desenvolvimento: NEXT_DIST_DIR=.next-test
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;

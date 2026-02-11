import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Borramos devIndicators de aquí para evitar el error
};

export default nextConfig;
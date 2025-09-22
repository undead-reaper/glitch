import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    useLightningcss: true,
    reactCompiler: true,
    authInterrupts: true,
    typedEnv: true,
  },
  typedRoutes: true,
  allowedDevOrigins: ["http://localhost:3000"],
};

export default nextConfig;

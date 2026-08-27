import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CloudLinux/cPanel: avoid Turbopack symlink issues; build via --webpack
  serverExternalPackages: ["@prisma/client", "prisma"],
  images: {
    unoptimized: true,
    localPatterns: [{ pathname: "/images/**" }],
  },
};

export default nextConfig;

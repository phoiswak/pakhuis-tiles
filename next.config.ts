import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CloudLinux/cPanel: avoid Turbopack symlink issues; build via --webpack
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;

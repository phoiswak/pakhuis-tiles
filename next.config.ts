import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CloudLinux/cPanel: avoid Turbopack symlink issues; build via --webpack
};

export default nextConfig;

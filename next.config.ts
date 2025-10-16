import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Specify the root directory to silence the workspace warning
  turbopack: {
    root: "."
  }
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // We only need basePath for GitHub Pages sub-directories
  basePath: "/ValentinesDay",
};

export default nextConfig;

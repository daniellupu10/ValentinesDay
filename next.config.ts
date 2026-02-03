import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Ensure the base path matches your GitHub repository name exactly
  basePath: "/ValentinesDay",
  // This helps Next.js find its JS/CSS assets on GitHub Pages
  assetPrefix: "/ValentinesDay",
};

export default nextConfig;

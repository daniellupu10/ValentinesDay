import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Since you are using a custom domain (belovable.online), 
  // you must remove the sub-folder path so assets load from the root.
  basePath: "",
  assetPrefix: "",
  trailingSlash: true,
};

export default nextConfig;

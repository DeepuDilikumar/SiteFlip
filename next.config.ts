import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Template stylesheets are read from disk when exporting a site's code.
  outputFileTracingIncludes: {
    "/api/sites/[siteId]/export": ["./src/templates/**/*.css"],
  },
};

export default nextConfig;

const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@german-coach/vocabulary", "@german-coach/exams"],
  experimental: {
    serverComponentsExternalPackages: [
      "msedge-tts",
      "ws",
      "isomorphic-ws",
      "bufferutil",
      "utf-8-validate",
    ],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@german-coach/vocabulary": path.resolve(
        __dirname,
        "../../packages/vocabulary/src"
      ),
      "@german-coach/exams": path.resolve(__dirname, "../../packages/exams/src"),
    };
    if (isServer) {
      config.externals = [...(config.externals || []), "ws", "isomorphic-ws", "msedge-tts"];
    }
    return config;
  },
};

module.exports = nextConfig;

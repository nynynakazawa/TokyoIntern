import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "", // 開発時のみCSPを無効化
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/__/auth/handler",
        destination: "/auth/callback",
      },
    ];
  },
  /* config options here */
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

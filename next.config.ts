import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Anúncios usam URLs externas arbitrárias (vendedores informam a foto).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;

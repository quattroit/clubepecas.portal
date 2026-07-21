import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function apiRemotePattern():
  | {
      protocol: "http" | "https";
      hostname: string;
      port?: string;
      pathname: string;
    }
  | null {
  if (!apiUrl) return null;
  try {
    const parsed = new URL(apiUrl);
    const protocol = parsed.protocol.replace(":", "") as "http" | "https";
    return {
      protocol,
      hostname: parsed.hostname,
      ...(parsed.port ? { port: parsed.port } : {}),
      pathname: "/**",
    };
  } catch {
    return null;
  }
}

const apiPattern = apiRemotePattern();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(apiPattern ? [apiPattern] : []),
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "7000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5229",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;

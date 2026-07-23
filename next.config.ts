import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const s3PublicHost = process.env.NEXT_PUBLIC_S3_PUBLIC_HOST;

function parseRemotePattern(urlOrHost: string | undefined):
  | {
      protocol: "http" | "https";
      hostname: string;
      port?: string;
      pathname: string;
    }
  | null {
  if (!urlOrHost) return null;
  try {
    const withProtocol = urlOrHost.includes("://")
      ? urlOrHost
      : `https://${urlOrHost}`;
    const parsed = new URL(withProtocol);
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

const apiPattern = parseRemotePattern(apiUrl);
const s3Pattern = parseRemotePattern(s3PublicHost);

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      ...(apiPattern ? [apiPattern] : []),
      ...(s3Pattern ? [s3Pattern] : []),
      {
        protocol: "https",
        hostname: "clubepecas-dev.s3.sa-east-1.amazonaws.com",
        pathname: "/**",
      },
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

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    serverExternalPackages:["pino", "pino-pretty"],
    transpilePackages: ["next-mdx-remote"],
    eslint: {
        ignoreDuringBuilds: true
    },
    typescript: {
        ignoreBuildErrors: true
    },
  /* config options here */
    images:{
        remotePatterns: [
            {
                protocol: 'https',
                hostname: "www.google.com",
                port: "",

            },
            {
                protocol: 'https',
                hostname: "lh3.googleusercontent.com",
                port: "",

            },
            {
                protocol: 'https',
                hostname: "avatars.githubusercontent.com",
                port: "",

            }
        ]
    }
};

export default nextConfig;

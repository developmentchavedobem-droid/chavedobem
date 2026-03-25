import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'chave-do-bem.s3.sa-east-1.amazonaws.com', // Ajuste para sua região
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

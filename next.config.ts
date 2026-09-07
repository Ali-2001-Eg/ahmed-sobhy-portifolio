import type {NextConfig} from 'next';
import {IMAGE_HOSTS} from './src/lib/image-hosts';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Derived from src/lib/image-hosts.ts so the dashboard's URL validation and
    // the actual allowlist can never drift apart.
    remotePatterns: IMAGE_HOSTS.map((hostname) => ({
      protocol: 'https' as const,
      hostname,
      port: '',
      pathname: '/**',
    })),
  },
};

export default nextConfig;

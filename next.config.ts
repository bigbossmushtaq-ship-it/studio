
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kfbdkowaslubunczjjgh.supabase.co',
        port: '',
        pathname: '/**',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/supabase-images/:path*',
        destination: 'https://kfbdkowaslubunczjjgh.supabase.co/storage/v1/object/public/:path*',
      },
    ]
  }
};

export default nextConfig;

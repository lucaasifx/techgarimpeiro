import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  transpilePackages: ['@techgarimpeiro/core', '@techgarimpeiro/db'],
  outputFileTracingRoot: path.join(__dirname, '../../'),
};

export default nextConfig;

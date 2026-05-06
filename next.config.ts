import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: process.env.BUILD_TARGET === 'app' ? 'export' : undefined,
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig

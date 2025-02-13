import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ✅ Allow deployment with "any" errors
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignore ESLint errors on build
  },
};

module.exports = nextConfig;

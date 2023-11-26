// @ts-check
import withPlaiceholder from "@plaiceholder/next";
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    webpackBuildWorker: true,
  },

  reactStrictMode: false,
};
export default withPlaiceholder(nextConfig);

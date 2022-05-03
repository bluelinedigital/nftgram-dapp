/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  exportTrailingSlash: true,
  images: {
    loader: "akamai",
    domains: ["ipfs.infura.io"],
  },
};

module.exports = nextConfig;

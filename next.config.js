/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "custom",
    trailingSlash: true,
    domains: ["ipfs.infura.io"],
  },
};

module.exports = nextConfig;

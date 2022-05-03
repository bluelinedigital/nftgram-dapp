/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "custom",
    domains: ["ipfs.infura.io"],
  },
};

module.exports = nextConfig;

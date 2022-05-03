/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "imgix",
    domains: ["ipfs.infura.io"],
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "akamai",
    path: "/",
    domains: ["ipfs.infura.io"],
  },
};

module.exports = nextConfig;

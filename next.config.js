/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    loader: "akamai",
    path: "https://nftgramm.com",
    domains: ["ipfs.infura.io"],
  },
};

module.exports = nextConfig;

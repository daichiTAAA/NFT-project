/** @type {import('next').NextConfig} */

module.exports = {
  images: {
    domains: ["gateway.pinata.cloud"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
      config.resolve.fallback.child_process = false;
      config.resolve.fallback.net = false;
      config.resolve.fallback.dns = false;
      config.resolve.fallback.tls = false;
    }
    return config;
  },
};

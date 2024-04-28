/** @type {import('next').NextConfig} */
const nextConfig = {
  swcPlugins: [["next-superjson-plugin", {}]],
  images: {
    remotePatterns: [
      {
        hostname: "avatar.iran.liara.run",
      },
    ],
  },
};

export default nextConfig;

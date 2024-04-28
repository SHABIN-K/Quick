/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "avatar.iran.liara.run",
      },
    ],
  },
};

export default nextConfig;

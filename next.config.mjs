/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pgtauhyffxbiatarwnmp.supabase.co",
    
      },
    ],
  },
  async redirects() {
    return [];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'openweathermap.org',
            port: '',
            pathname: '/img/wn/**',
            search: '',
          },
          {
            protocol: 'https',
            hostname: 'maps.googleapis.com',
            port: '',
          },
        ],
      },
};

export default nextConfig;

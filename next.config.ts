import type { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
      remotePatterns: [
         {
            protocol: 'http',
            hostname: 'localhost',
            port: '8000', // Ensure this matches your Laravel port
            pathname: '**',
         },
      ],
   },
};

export default nextConfig;

// const nextConfig: NextConfig = {
//   reactCompiler: true,
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'http',
//         hostname: 'localhost',
//         port: '8000',
//         pathname: '/storage/**',
//       },
//     ],
//   },
// };

// export default nextConfig;

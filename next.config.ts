const nextConfig = {
   images: {
      remotePatterns: [
         {
            protocol: 'http',
            hostname: 'localhost',
            port: '8000',
            pathname: '**',
         },
      ],
   },
   async headers() {
      return [
         {
            source: '/firebase-messaging-sw.js',
            headers: [
               {
                  key: 'Cache-Control',
                  value: 'public, max-age=0, must-revalidate',
               },
               { key: 'Service-Worker-Allowed', value: '/' },
            ],
         },
      ];
   },
};

export default nextConfig;

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

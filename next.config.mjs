const nextConfig = {
  output: "standalone",

  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/.prisma/client/**/*",
      "./node_modules/@prisma/client/**/*",
    ],
  },

  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

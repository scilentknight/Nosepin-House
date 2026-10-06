// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   output: "standalone",

//   outputFileTracingIncludes: {
//     "/*": [
//       "./node_modules/.prisma/client/**/*",
//       "./node_modules/@prisma/client/**/*",
//     ],
//   },

//   images: {
//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "3000",
//         pathname: "/uploads/**",
//       },
//     ],
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

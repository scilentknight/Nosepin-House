// import { NextRequest } from "next/server";

// export function getBaseUrl(request?: NextRequest) {
//   if (request) {
//     const protocol = request.headers.get("x-forwarded-proto") || "http";

//     const host =
//       request.headers.get("x-forwarded-host") || request.headers.get("host");

//     if (host) {
//       return `${protocol}://${host}`;
//     }
//   }

//   return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(
//     /\/$/,
//     "",
//   );
// }

// export function absoluteUrl(path: string | null | undefined, baseUrl: string) {
//   if (!path) return null;

//   if (path.startsWith("http://") || path.startsWith("https://")) {
//     return path;
//   }

//   return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
// }

import { NextRequest } from "next/server";

export function getBaseUrl(request?: NextRequest) {
  if (request) {
    const protocol =
      request.headers.get("x-forwarded-proto") ||
      (process.env.NODE_ENV === "production" ? "https" : "http");

    const host =
      request.headers.get("x-forwarded-host") || request.headers.get("host");

    if (host) {
      return `${protocol}://${host}`.replace(/\/$/, "");
    }
  }

  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export function absoluteUrl(path: string | null | undefined, baseUrl: string) {
  if (!path) {
    return null;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

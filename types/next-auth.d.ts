import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      role: "USER" | "ADMIN";
    } & DefaultSession["user"];
  }

  interface User {
    id: number;
    role: "USER" | "ADMIN";
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    role: "USER" | "ADMIN";
    picture?: string | null;
  }
}

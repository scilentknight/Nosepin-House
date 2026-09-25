import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import FloatingIcon from "@/components/layout/FloatingIcon";
import { NavigationProgress } from "@/components/layout/NavigationProgress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NOSEPIN",
  description:
    "NOSEPIN — Discover elegant jewellery crafted to complement every style and occasion.",
  icons: {
    icon: "/nosepin-logo.png",
    shortcut: "/nosepin-logo.png",
    apple: "/nosepin-logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>
          {/* <NavigationProgress /> */}
          {children}
        </Providers>
        <FloatingIcon />
      </body>
    </html>
  );
}

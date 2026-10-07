import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nosepinhouse.com"),

  title: {
    default: "NOSEPIN | Jewellery in Nepal",
    template: "%s | NOSEPIN",
  },

  description:
    "Shop elegant jewellery in Nepal at NOSEPIN. Discover nosepins, earrings, necklaces, rings, bangles, anklets and jewellery sets for everyday wear, weddings and special occasions.",

  keywords: [
    "jewellery in Nepal",
    "jewelry in Nepal",
    "jewellery Nepal",
    "online jewellery Nepal",
    "online jewelry Nepal",
    "jewellery shop Nepal",
    "jewelry shop Nepal",
    "gold jewellery Nepal",
    "nosepin Nepal",
    "nose pins Nepal",
    "earrings Nepal",
    "necklaces Nepal",
    "rings Nepal",
    "bangles Nepal",
    "anklets Nepal",
    "bridal jewellery Nepal",
  ],

  authors: [
    {
      name: "NOSEPIN",
    },
  ],

  creator: "NOSEPIN",
  publisher: "NOSEPIN",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: [
      {
        url: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: "/logo.png",
    apple: [
      {
        url: "/logo.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  openGraph: {
    type: "website",
    locale: "en_NP",
    url: "https://nosepinhouse.com",
    siteName: "NOSEPIN",
    title: "NOSEPIN | Jewellery in Nepal",
    description:
      "Discover elegant jewellery in Nepal including nosepins, earrings, necklaces, rings, bangles, anklets and jewellery sets.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NOSEPIN Jewellery - Jewellery in Nepal",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "NOSEPIN | Jewellery in Nepal",
    description:
      "Shop elegant jewellery in Nepal for everyday wear, weddings and special occasions.",
    images: ["/og-image.jpg"],
  },

  alternates: {
    canonical: "https://nosepinhouse.com",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-NP"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sol Tools - Cheapest Solana Creation Tool",
  description: "Cheapest Solana Creation Tool 🚀",
  openGraph: {
    title: "Sol Tools - Cheapest Solana Creation Tool",
    description: "Cheapest Solana Creation Tool 🚀",
    type: "website",
    locale: "en_US",
    url: "https://soltools.cloud",
    siteName: "Sol Tools",
    images: [
      {
        url: "https://soltools.cloud/favicon.ico",
        width: 1200,
        height: 630,
        alt: "Sol Tools - Cheapest Solana Creation Tool",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

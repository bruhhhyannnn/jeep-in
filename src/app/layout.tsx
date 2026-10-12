import type { Metadata, Viewport } from "next";
import { Figtree, Spline_Sans_Mono } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const splineSansMono = Spline_Sans_Mono({
  variable: "--font-spline-mono",
  subsets: ["latin"],
});

// Absolute base for the share image URL. Vercel sets VERCEL_PROJECT_PRODUCTION_URL on every build.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: site.title,
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_PH",
    title: site.title,
    description: site.shareDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.shareDescription,
  },
};

export const viewport: Viewport = {
  themeColor: "#1670e0",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${figtree.variable} ${splineSansMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

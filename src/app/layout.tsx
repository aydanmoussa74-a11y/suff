import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Suff",
  description: "Design components and flows in one place.",
  manifest: "/manifest.webmanifest",
  applicationName: "Suff",
  appleWebApp: { capable: true, title: "Suff", statusBarStyle: "black-translucent" },
  icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/apple-icon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#07080b" />
      </head>
      <body>{children}</body>
    </html>
  );
}

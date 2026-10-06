import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Suff",
  description: "Design components and flows in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

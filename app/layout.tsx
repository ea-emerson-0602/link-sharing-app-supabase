import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Link Sharing App",
  description: "A free and quick way to have all your links in one place and share them to the world! Built using Next JS and Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`text-primaryText`}>{children}</body>
    </html>
  );
}

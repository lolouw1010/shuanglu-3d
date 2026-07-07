import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "双陆 · 立体对弈",
  description: "固定机位的双陆立体对弈场景。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

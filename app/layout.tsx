import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { TokenProvider } from "@/containers/hook/useToken";

const outfit = Outfit({subsets: ["latin"]});
export const metadata: Metadata = {
  title: "Blogo",
  description: "View and create blogs via GitHub issues",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <TokenProvider>
      <body className={outfit.className}>
        <Navbar />
        {children}
      </body>
      </TokenProvider>
    </html>
  );
}

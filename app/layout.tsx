import type { Metadata } from "next";
import { Oxygen } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { TokenProvider } from "@/containers/hook/useToken";

const oxygen = Oxygen({weight: ["300", "700"], subsets: ["latin"]});
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
      <body className={`${oxygen.className}`}>
        <Navbar />
        {children}
      </body>
      </TokenProvider>
    </html>
  );
}

import type { Metadata } from "next";
import { Oxygen } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { TokenProvider } from "@/containers/hook/useToken";
import ParallaxProvider from "@/containers/hook/useParallax";
import { SpeedInsights } from "@vercel/speed-insights/next";

const oxygen = Oxygen({weight: ["300","400", "700"], subsets: ["latin"]});
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
    <ParallaxProvider>
    <TokenProvider>
      <body className={`${oxygen.className}`}>
        <Navbar />
        {children}
        <Footer />
        <SpeedInsights />
      </body>
    </TokenProvider>
    </ParallaxProvider>
    </html>
  );
}

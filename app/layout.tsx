import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-noto-bengali"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://deshvox.com"),
  title: {
    default: "DeshVox",
    template: "%s | DeshVox"
  },
  description: "The omnichannel AI PBX ecosystem for Bangladesh with voice automation, marketing, analytics, and reseller tools.",
  openGraph: {
    title: "DeshVox",
    description: "The omnichannel AI PBX ecosystem for Bangladesh.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "DeshVox",
    description: "The omnichannel AI PBX ecosystem for Bangladesh."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoBengali.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

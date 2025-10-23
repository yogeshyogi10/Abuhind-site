// app/layout.tsx (or app/(site)/layout.tsx)
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-poppins",
});

const alro = localFont({
  src: [
    { path: "./font/alro/Alro-Regular.woff2", weight: "400", style: "normal" },
    { path: "./font/alro/Alro-Bold.woff2",    weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-alro",
});

export const metadata: Metadata = {
  title: "Abuhind",
  description: "Legacy of Royal Taste",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} ${alro.variable}`}>
      <body>{children}</body>
    </html>
  );
}

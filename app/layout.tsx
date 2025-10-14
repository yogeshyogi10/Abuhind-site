// app/layout.tsx (or app/(site)/layout.tsx)
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css"


const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Abuhind",
  description: "Legacy of Royal Taste",
   icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={manrope.variable}>
      {/* If you want Manrope everywhere by default, use manrope.className instead of .variable */}
      <body className={`${manrope.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}

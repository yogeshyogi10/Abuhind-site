// app/fonts.ts
import localFont from "next/font/local";

export const alro = localFont({
  src: [
    { path: "./assets/font/alro/Alro-Regular.woff2", weight: "400", style: "normal" },
    { path: "./assets/font/alro/Alro-Bold.woff2",    weight: "700", style: "normal" },
  ],
  variable: "--font-alro", // exposes a CSS var
  display: "swap",
  preload: true,           // only for above-the-fold fonts
});
